const { get, every, values, some, zipObject } = require("lodash");
const { utils, getData } = require("@govtechsg/open-attestation");

const documentStore = require("../common/documentStore");

/**
 * Returns array of the target hash, intermediate hashes and merkle root of the document
 *
 * @param  {string} targetHash Hash of the document
 * @param  {string[]} proofs All the proofs of the document
 */
const getIntermediateHashes = (targetHash, proofs = []) => {
  const hashes = [targetHash];
  proofs.reduce((prev, curr) => {
    const next = utils.combineHashString(prev, curr);
    hashes.push(next);
    return next;
  }, targetHash);
  return hashes;
};

/**
 * Get revoke status of one hash on a single store address
 *
 * @param  {string} storeAddress Store address to check against, starts with 0x
 * @param  {string} hash Hash to check, does not start with 0x
 * @returns {boolean} True if the hash is revoked
 */
const getRevoked = async (storeAddress, hash) => {
  try {
    const revoked = await documentStore(storeAddress, "isRevoked", `0x${hash}`);
    return revoked;
  } catch (e) {
    // If contract is not deployed, the function will throw.
    // It should default to true if there is errors.
    return true;
  }
};

/**
 * Checks a single store if any of the intermediate hash is revoked on it.
 * If any hash is revoked, the function returns true.
 *
 * @param  {string} storeAddress Contract addresss of store to check against. Starts with 0x.
 * @param  {string[]} intermediateHashes Array of intermediate hashes to check. Does not have 0x.
 * @returns {boolean} True if any of the hashes is revoked on the single store.
 */
const getRevokedByStore = async (storeAddress, intermediateHashes = []) => {
  const revokeStatusesDeferred = intermediateHashes.map(hash =>
    getRevoked(storeAddress, hash)
  );
  const revokeStatues = await Promise.all(revokeStatusesDeferred);
  return some(revokeStatues, isTrue => isTrue);
};

/**
 * Checks the revoked states of the hashes against all the store.
 *
 * @param  {string[]} storeAddresses Array of all store addresses to check against
 * @param  {string[]} intermediateHashes Array of all hashes to check
 * @returns {object} Revoke status mapped to each store address
 */
const getRevokedOnAllStore = async (
  storeAddresses = [],
  intermediateHashes = []
) => {
  const revokeStatusesByStoreDefered = storeAddresses.map(storeAddress =>
    getRevokedByStore(storeAddress, intermediateHashes)
  );
  const revokeStatusesByStore = await Promise.all(revokeStatusesByStoreDefered);
  return zipObject(storeAddresses, revokeStatusesByStore);
};

/**
 * Gets a summary of the check
 *
 * @param  {string[]} storeAddresses Array of all store addresses to check against
 * @param  {string[]} intermediateHashes Array of all hashes to check
 * @returns {object} Object with a valid status flag and the individual stores' responses
 */
const getIssuedSummary = async (
  storeAddresses = [],
  intermediateHashes = []
) => {
  // Needs to calculate all hash
  const revoked = await getRevokedOnAllStore(
    storeAddresses,
    intermediateHashes
  );
  const revokedValues = values(revoked);
  const valid =
    every(revokedValues, isTrue => isTrue === false) &&
    revokedValues.length > 0;
  return {
    valid,
    revoked
  };
};
const verifyRevoked = async document => {
  const documentData = getData(document);
  const storeAddresses = get(documentData, "issuers", []).map(
    // Returns the documentStore or certificateStore(openCerts's legacy) address
    i => i.documentStore || i.certificateStore
  );
  const targetHash = get(document, "signature.targetHash");
  const proofs = get(document, "signature.proof");
  const intermediateHashes = getIntermediateHashes(targetHash, proofs);
  return getIssuedSummary(storeAddresses, intermediateHashes);
};

module.exports = {
  getRevoked,
  getRevokedByStore,
  getRevokedOnAllStore,
  getIssuedSummary,
  getIntermediateHashes,
  verifyRevoked
};
