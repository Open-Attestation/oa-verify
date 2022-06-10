import { utils } from "@govtechsg/open-attestation";
import { DocumentStore } from "@govtechsg/document-store";
import { errors, providers } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { Hash } from "../../types/core";
import {
  OpenAttestationEthereumDocumentStoreStatusCode,
  OpenAttestationDidSignedDocumentStatusCode,
} from "../../types/error";
import { CodedError } from "../../common/error";
import { OcspResponderRevocationReason, RevocationStatus } from "./revocation.types";
import axios from "axios";
import {
  ValidOcspResponse,
  ValidOcspResponseRevoked,
  ValidOcspResponse2,
  ValidOcspResponseRevoked2,
} from "./didSigned/didSignedDocumentStatus.type";

export const getIntermediateHashes = (targetHash: Hash, proofs: Hash[] = []) => {
  const hashes = [`0x${targetHash}`];
  proofs.reduce((prev, curr) => {
    const next = utils.combineHashString(prev, curr);
    hashes.push(`0x${next}`);
    return next;
  }, targetHash);
  return hashes;
};

/**
 * Try to decode the error to see if we can deterministically tell if the document has NOT been issued or revoked.
 *
 * In case where we cannot tell, we throw an error
 * */
export const decodeError = (error: any) => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  switch (true) {
    case !error.reason &&
      (error.method?.toLowerCase() === "isRevoked(bytes32)".toLowerCase() ||
        error.method?.toLowerCase() === "isIssued(bytes32)".toLowerCase()) &&
      error.code === errors.CALL_EXCEPTION:
      return "Contract is not found";
    case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
      error.code === errors.UNSUPPORTED_OPERATION:
      return "ENS name is not configured";
    case reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
      return "Bad document store address checksum";
    case error.message?.toLowerCase() === "name not found".toLowerCase():
      return "ENS name is not found";
    case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
      return "Invalid document store address";
    case error.code === errors.INVALID_ARGUMENT:
      return "Invalid call arguments";
    case error.code === errors.SERVER_ERROR:
      throw new CodedError(
        "Unable to connect to the Ethereum network, please try again later",
        OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR,
        OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR]
      );
    default:
      throw error;
  }
};

/**
 * Given a list of hashes, check against one smart contract if any of the hash has been revoked
 * */
export const isAnyHashRevoked = async (smartContract: DocumentStore, intermediateHashes: Hash[]) => {
  const revokedStatusDeferred = intermediateHashes.map((hash) =>
    smartContract.isRevoked(hash).then((status) => (status ? hash : undefined))
  );
  const revokedStatuses = await Promise.all(revokedStatusDeferred);
  return revokedStatuses.find((hash) => hash);
};

export const isRevokedOnDocumentStore = async ({
  documentStore,
  merkleRoot,
  provider,
  targetHash,
  proofs,
}: {
  documentStore: string;
  merkleRoot: string;
  provider: providers.Provider;
  targetHash: Hash;
  proofs?: Hash[];
}): Promise<RevocationStatus> => {
  try {
    const documentStoreContract = await DocumentStoreFactory.connect(documentStore, provider);
    const intermediateHashes = getIntermediateHashes(targetHash, proofs);
    const revokedHash = await isAnyHashRevoked(documentStoreContract, intermediateHashes);

    return revokedHash
      ? {
          revoked: true,
          address: documentStore,
          reason: {
            message: `Document ${merkleRoot} has been revoked under contract ${documentStore}`,
            code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED,
            codeString:
              OpenAttestationEthereumDocumentStoreStatusCode[
                OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED
              ],
          },
        }
      : {
          revoked: false,
          address: documentStore,
        };
  } catch (error) {
    // If error can be decoded and it's because of document is not revoked, we return false
    // Else allow error to continue to bubble up
    return {
      revoked: true,
      address: documentStore,
      reason: {
        message: decodeError(error),
        code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED,
        codeString:
          OpenAttestationEthereumDocumentStoreStatusCode[
            OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED
          ],
      },
    };
  }
};

/**
 * @deprecated Replaced by `isRevokedByOcspResponder2()` to check against merkle root & intermediate hashes (i.e. do not revoke by document id)
 *
 * These checks retained for backwards compatibility with older OCSP responders
 * that are already in the wild. Do consider removing support for old OCSP responders
 * in the next major version of oa-verify.
 */
export const isRevokedByOcspResponder = async ({
  certificateId,
  location,
}: {
  certificateId: string;
  location: string;
}): Promise<RevocationStatus> => {
  const { data } = await axios.get(`${location}/${certificateId}`);

  if (ValidOcspResponseRevoked.guard(data) && data.certificateStatus === "revoked") {
    const { reasonCode } = data;
    return {
      revoked: true,
      address: location,
      reason: {
        message: OcspResponderRevocationReason[reasonCode],
        code: reasonCode,
        codeString: OcspResponderRevocationReason[reasonCode],
      },
    };
  } else if (ValidOcspResponse.guard(data) && data.certificateStatus !== "revoked") {
    return {
      revoked: false,
      address: location,
    };
  }

  throw new CodedError(
    "Invalid or unexpected response from OCSP Responder",
    OpenAttestationDidSignedDocumentStatusCode.OCSP_RESPONSE_INVALID,
    "OCSP_RESPONSE_INVALID"
  );
};

export const isRevokedByOcspResponder2 = async ({
  merkleRoot,
  targetHash,
  proofs,
  location,
}: {
  merkleRoot: string;
  targetHash: Hash;
  proofs?: Hash[];
  location: string;
}): Promise<RevocationStatus> => {
  const intermediateHashes = getIntermediateHashes(targetHash, proofs);

  for (const hash of intermediateHashes) {
    const { data } = await axios.get(`${location}/${hash}`).catch((e) => {
      throw new CodedError(
        `Invalid or unexpected response from OCSP Responder - ${e}`,
        OpenAttestationDidSignedDocumentStatusCode.OCSP_RESPONSE_INVALID,
        "OCSP_RESPONSE_INVALID"
      );
    });

    if (ValidOcspResponse2.guard(data)) {
      continue;
    } else if (ValidOcspResponseRevoked2.guard(data)) {
      const { reasonCode } = data;
      return {
        revoked: true,
        address: location,
        reason: {
          message: `Document ${merkleRoot} has been revoked under OCSP Responder: ${location}`,
          code: reasonCode,
          codeString: OcspResponderRevocationReason[reasonCode],
        },
      };
    } else {
      throw new CodedError(
        `Invalid or unexpected response from OCSP Responder`,
        OpenAttestationDidSignedDocumentStatusCode.OCSP_RESPONSE_INVALID,
        "OCSP_RESPONSE_INVALID"
      );
    }
  }

  return {
    revoked: false,
    address: location,
  };
};
