import { SignedDocument, utils } from "@govtechsg/open-attestation";
import { Hash, OpenAttestationContract } from "../types";
import { isRevoked } from "./contractInterface";

// Given a list of hashes, check against one smart contract if any of the hash has been revoked
export const isAnyHashRevokedOnStore = async (
  smartContract: OpenAttestationContract,
  intermediateHashes: Hash[]
) => {
  const revokedStatusDeferred = intermediateHashes.map(hash =>
    isRevoked(smartContract, hash)
  );
  const revokedStatuses = await Promise.all(revokedStatusDeferred);
  return revokedStatuses.some(status => status);
};

export const revokedStatusOnContracts = async (
  smartContracts: OpenAttestationContract[] = [],
  intermediateHashes: Hash[] = []
) => {
  const revokeStatusesDefered = smartContracts.map(smartContract =>
    isAnyHashRevokedOnStore(smartContract, intermediateHashes)
      .then(revoked => ({
        address: smartContract.address,
        revoked
      }))
      .catch(e => ({
        address: smartContract.address,
        revoked: true,
        error: e.message || e
      }))
  );
  return Promise.all(revokeStatusesDefered);
};

export const isRevokedOnAny = (
  statuses: { address: Hash; revoked: boolean }[]
) => {
  if (!statuses || statuses.length === 0) return false;
  return statuses.some(status => status.revoked);
};

export const getIntermediateHashes = (
  targetHash: Hash,
  proofs: Hash[] = []
) => {
  const hashes = [`0x${targetHash}`];
  proofs.reduce((prev, curr) => {
    const next = utils.combineHashString(prev, curr);
    hashes.push(`0x${next}`);
    return next;
  }, targetHash);
  return hashes;
};

export const verifyRevoked = async (
  document: SignedDocument,
  smartContracts: OpenAttestationContract[] = []
) => {
  const { targetHash } = document.signature;
  const proofs = document.signature.proof || [];
  const intermediateHashes = getIntermediateHashes(targetHash, proofs);
  const details = await revokedStatusOnContracts(
    smartContracts,
    intermediateHashes
  );
  const revokedOnAny = isRevokedOnAny(details);

  return {
    revokedOnAny,
    details
  };
};
