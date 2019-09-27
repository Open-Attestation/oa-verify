const { get, zipWith } = require("lodash");
const { utils } = require("@govtechsg/open-attestation");
const { isRevoked } = require("./contractInterface");

// Given a list of hashes, check against one smart contract if any of the hash has been revoked
const isAnyHashRevokedOnStore = async (smartContract, intermediateHashes) => {
  const revokedStatusDeferred = intermediateHashes.map(hash =>
    isRevoked(smartContract, hash)
  );
  const revokedStatuses = await Promise.all(revokedStatusDeferred);
  const revoked = revokedStatuses.reduce((prev, curr) => prev || curr, false);
  return revoked;
};

const revokedStatusOnContracts = async (
  smartContracts = [],
  intermediateHashes = []
) => {
  const revokeStatusesDefered = smartContracts.map(smartContract =>
    isAnyHashRevokedOnStore(smartContract, intermediateHashes)
  );
  const revokeStatuses = await Promise.all(revokeStatusesDefered);
  const smartContractAddresses = smartContracts.map(
    smartContract => smartContract.address
  );
  return zipWith(
    smartContractAddresses,
    revokeStatuses,
    (address, revoked) => ({
      address,
      revoked
    })
  );
};

const isRevokedOnAny = status => {
  if (!status || status.length === 0) return false;
  return status.reduce((prev, curr) => prev || curr.revoked, false);
};

const getIntermediateHashes = (targetHash, proofs = []) => {
  const hashes = [`0x${targetHash}`];
  proofs.reduce((prev, curr) => {
    const next = utils.combineHashString(prev, curr);
    hashes.push(`0x${next}`);
    return next;
  }, targetHash);
  return hashes;
};

const verifyRevoked = async (document, smartContracts = []) => {
  const targetHash = get(document, "signature.targetHash");
  const proofs = get(document, "signature.proof", []);
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

module.exports = {
  isAnyHashRevokedOnStore,
  revokedStatusOnContracts,
  isRevokedOnAny,
  getIntermediateHashes,
  verifyRevoked
};
