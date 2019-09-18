const { get, every, values, some, zipObject } = require("lodash");
const { utils, getData } = require("@govtechsg/open-attestation");

const { execute } = require("../common/documentStore");

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
 * @param  {string} contractAddress Store address to check against, starts with 0x
 * @param  {string} hash Hash to check, does not start with 0x
 * @param  {string} network Network to check on
 * @returns {boolean} True if the hash is revoked
 */
const getRevoked = async (contractAddress, hash, network) => {
  try {
    const revoked = await execute({
      network,
      contractAddress,
      method: "isRevoked",
      args: [`0x${hash}`]
    });
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
 * @param  {string} contractAddress Contract addresss of store to check against. Starts with 0x.
 * @param  {string[]} intermediateHashes Array of intermediate hashes to check. Does not have 0x.
 * @param  {string} network Network to check on
 * @returns {boolean} True if any of the hashes is revoked on the single store.
 */
const getRevokedByStore = async (
  contractAddress,
  intermediateHashes = [],
  network
) => {
  const revokeStatusesDeferred = intermediateHashes.map(hash =>
    getRevoked(contractAddress, hash, network)
  );
  const revokeStatues = await Promise.all(revokeStatusesDeferred);
  return some(revokeStatues, isTrue => isTrue);
};

/**
 * Checks the revoked states of the hashes against all the store.
 *
 * @param  {string[]} contractAddresses Array of all store addresses to check against
 * @param  {string[]} intermediateHashes Array of all hashes to check
 * @param  {string} network Network to check on
 * @returns {object} Revoke status mapped to each store address
 */
const getRevokedOnAllStore = async (
  contractAddresses = [],
  intermediateHashes = [],
  network
) => {
  const revokeStatusesByStoreDefered = contractAddresses.map(contractAddress =>
    getRevokedByStore(contractAddress, intermediateHashes, network)
  );
  const revokeStatusesByStore = await Promise.all(revokeStatusesByStoreDefered);
  return zipObject(contractAddresses, revokeStatusesByStore);
};

/**
 * Gets a summary of the check
 *
 * @param  {string[]} contractAddresses Array of all store addresses to check against
 * @param  {string[]} intermediateHashes Array of all hashes to check
 * @param  {string} network Network to check on
 * @returns {object} Object with a valid status flag and the individual stores' responses
 */
const getIssuedSummary = async (
  contractAddresses = [],
  intermediateHashes = [],
  network
) => {
  // Needs to calculate all hash
  const revoked = await getRevokedOnAllStore(
    contractAddresses,
    intermediateHashes,
    network
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

const verifyRevoked = async (document, network) => {
  const documentData = getData(document);
  const contractAddresses = get(documentData, "issuers", []).map(
    // Returns the documentStore or certificateStore(openCerts's legacy) address
    i => i.documentStore || i.certificateStore
  );
  const targetHash = get(document, "signature.targetHash");
  const proofs = get(document, "signature.proof");
  const intermediateHashes = getIntermediateHashes(targetHash, proofs);
  return getIssuedSummary(contractAddresses, intermediateHashes, network);
};

module.exports = {
  getRevoked,
  getRevokedByStore,
  getRevokedOnAllStore,
  getIssuedSummary,
  getIntermediateHashes,
  verifyRevoked
};
