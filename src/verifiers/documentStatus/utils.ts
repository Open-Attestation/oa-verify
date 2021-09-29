import { utils } from "@govtechsg/open-attestation";
import { DocumentStore } from "@govtechsg/document-store";
import { errors, providers } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { Hash } from "../../types/core";
import { OpenAttestationEthereumDocumentStoreStatusCode } from "../../types/error";
import { CodedError } from "../../common/error";
import { RevocationStatus } from "./revocation.types";

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
