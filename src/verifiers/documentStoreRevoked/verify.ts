import { WrappedDocument, utils, v2, v3 } from "@govtechsg/open-attestation";
import { errors } from "ethers";
import { Hash, OpenAttestationContract } from "../../types/core";
import { OpenAttestationEthereumDocumentStoreRevokedCode, Reason } from "../../types/error";
import { isRevoked } from "./contractInterface";

const contractNotFound = (address: string): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreRevokedCode.CONTRACT_NOT_FOUND,
    codeString:
      OpenAttestationEthereumDocumentStoreRevokedCode[
        OpenAttestationEthereumDocumentStoreRevokedCode.CONTRACT_NOT_FOUND
      ],
    message: `Contract ${address} was not found`
  };
};
const contractAddressInvalid = (address: string): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreRevokedCode.CONTRACT_ADDRESS_INVALID,
    codeString:
      OpenAttestationEthereumDocumentStoreRevokedCode[
        OpenAttestationEthereumDocumentStoreRevokedCode.CONTRACT_ADDRESS_INVALID
      ],
    message: `Contract address ${address} is invalid`
  };
};
const contractRevoked = (merkleRoot: string, address: string): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreRevokedCode.DOCUMENT_REVOKED,
    codeString:
      OpenAttestationEthereumDocumentStoreRevokedCode[OpenAttestationEthereumDocumentStoreRevokedCode.DOCUMENT_REVOKED],
    message: `Certificate ${merkleRoot} has been revoked under contract ${address}`
  };
};

interface EthersError extends Error {
  reason?: string | string[];
  code?: string;
}
const getErrorReason = (error: EthersError, address: string): Reason => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  if (reason.toLowerCase() === "contract not deployed".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) {
    return contractNotFound(address);
  } else if (
    reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
    error.code === errors.UNSUPPORTED_OPERATION
  ) {
    return contractAddressInvalid(address);
  }
  return {
    message: `Error with smart contract ${address}: ${error.reason}`,
    code: OpenAttestationEthereumDocumentStoreRevokedCode.ETHERS_UNHANDLED_ERROR,
    codeString:
      OpenAttestationEthereumDocumentStoreRevokedCode[
        OpenAttestationEthereumDocumentStoreRevokedCode.ETHERS_UNHANDLED_ERROR
      ]
  };
};

// Given a list of hashes, check against one smart contract if any of the hash has been revoked
export const isAnyHashRevokedOnStore = async (smartContract: OpenAttestationContract, intermediateHashes: Hash[]) => {
  const revokedStatusDeferred = intermediateHashes.map(hash =>
    isRevoked(smartContract, hash).then(status => (status ? hash : undefined))
  );
  const revokedStatuses = await Promise.all(revokedStatusDeferred);
  return revokedStatuses.find(hash => hash);
};

export const revokedStatusOnContracts = async (
  smartContracts: OpenAttestationContract[] = [],
  intermediateHashes: Hash[] = []
) => {
  const revokeStatusesDefered = smartContracts.map(smartContract =>
    isAnyHashRevokedOnStore(smartContract, intermediateHashes)
      .then(hash => {
        const reason = hash ? { reason: contractRevoked(hash, smartContract.address) } : {};
        return {
          address: smartContract.address,
          revoked: !!hash,
          ...reason
        };
      })
      .catch(e => ({
        address: smartContract.address,
        revoked: true,
        reason: getErrorReason(e, smartContract.address)
      }))
  );
  return Promise.all(revokeStatusesDefered);
};

export const isRevokedOnAny = (statuses: { address: Hash; revoked: boolean }[]) => {
  if (!statuses || statuses.length === 0) return false;
  return statuses.some(status => status.revoked);
};

export const getIntermediateHashes = (targetHash: Hash, proofs: Hash[] = []) => {
  const hashes = [`0x${targetHash}`];
  proofs.reduce((prev, curr) => {
    const next = utils.combineHashString(prev, curr);
    hashes.push(`0x${next}`);
    return next;
  }, targetHash);
  return hashes;
};

export const verifyRevoked = async (
  document: WrappedDocument<v2.OpenAttestationDocument | v3.OpenAttestationDocument>,
  smartContracts: OpenAttestationContract[] = []
) => {
  const { targetHash } = document.signature;
  const proofs = document.signature.proof || [];
  const intermediateHashes = getIntermediateHashes(targetHash, proofs);
  const details = await revokedStatusOnContracts(smartContracts, intermediateHashes);
  const revokedOnAny = isRevokedOnAny(details);

  return {
    revokedOnAny,
    details
  };
};
