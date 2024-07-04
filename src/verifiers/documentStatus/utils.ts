import { utils } from "@govtechsg/open-attestation";
import { DocumentStore__factory } from "@govtechsg/document-store-ethers-v5";
import { Contract, errors, providers } from "ethers";
import { Hash } from "../../types/core";
import {
  OpenAttestationEthereumDocumentStoreStatusCode,
  OpenAttestationDidSignedDocumentStatusCode,
} from "../../types/error";
import { CodedError } from "../../common/error";
import { OcspResponderRevocationReason, RevocationStatus } from "./revocation.types";
import axios from "axios";
import { ValidOcspResponse, ValidOcspResponseRevoked } from "./didSigned/didSignedDocumentStatus.type";
import { isBatchableDocumentStore } from "../../common/utils";

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
export const isAnyHashRevoked = async (smartContract: Contract, intermediateHashes: Hash[]) => {
  const revokedStatusDeferred = intermediateHashes.map((hash) =>
    smartContract["isRevoked(bytes32)"](hash).then((status: boolean) => status)
  );
  const revokedStatuses = await Promise.all(revokedStatusDeferred);
  return !revokedStatuses.every((status) => !status);
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
  provider: providers.Provider | providers.Provider[];
  targetHash: Hash;
  proofs: Hash[];
}): Promise<RevocationStatus> => {
  const providers = Array.isArray(provider) ? provider : [provider];
  const queryProviderIndex = Math.floor(Math.random() * providers.length);
  const documentStoreContractQueryProviders = providers.map((p) => DocumentStore__factory.connect(documentStore, p));

  let tries = 0;
  for (;;) {
    const documentStoreContract =
      documentStoreContractQueryProviders[(queryProviderIndex + tries) % documentStoreContractQueryProviders.length];
    console.log(
      "Trying with query index ",
      queryProviderIndex + tries,
      "out of ",
      documentStoreContractQueryProviders.length
    );

    try {
      const isBatchable = await isBatchableDocumentStore(documentStoreContract);
      let revoked: boolean;
      if (isBatchable) {
        revoked = (await documentStoreContract["isRevoked(bytes32,bytes32,bytes32[])"](
          merkleRoot,
          targetHash,
          proofs
        )) as boolean;
      } else {
        const intermediateHashes = getIntermediateHashes(targetHash, proofs);
        revoked = await isAnyHashRevoked(documentStoreContract, intermediateHashes);
      }

      return revoked
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
    } catch (error: any) {
      if (
        (error.code === errors.SERVER_ERROR || error.code === errors.TIMEOUT || error.code === errors.CALL_EXCEPTION) &&
        tries < 3
      ) {
        tries++;
        continue;
      }
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
  }
};

export const isRevokedByOcspResponder = async ({
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

    if (ValidOcspResponse.guard(data)) {
      continue;
    } else if (ValidOcspResponseRevoked.guard(data)) {
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
