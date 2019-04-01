const { get, every, values, zipObject } = require("lodash");
const { getData } = require("@govtechsg/open-attestation");

const documentStore = require("../common/documentStore");

/**
 * Checks issue status on a single document store
 *
 * @param  {} storeAddress Address of document store to check issue status on
 * @param  {} hash Hash of the merkle root of the document, not the target hash
 */
const getIssued = async (storeAddress, hash) => {
  try {
    const issued = await documentStore(storeAddress, "isIssued", `0x${hash}`);
    return issued;
  } catch (e) {
    // If contract is not deployed, the function will throw.
    // It should default to false if there is errors.
    return false;
  }
};

/**
 * Get issue states on all store in parallel
 *
 * @param  {string[]} storeAddresses Array of all store addresses
 * @param  {string} hash Hash of the merkle root of the document, not the target hash
 * @return {object} Issue status of the document on each of the store, with store address as the key
 */
const getIssuedOnAll = async (storeAddresses = [], hash) => {
  const issueStatusesDefered = storeAddresses.map(storeAddress =>
    getIssued(storeAddress, hash)
  );
  const issueStatuses = await Promise.all(issueStatusesDefered);
  return zipObject(storeAddresses, issueStatuses);
};

/**
 * Provide a summary of the validity of the issued status
 *
 * @param  {string[]} storeAddresses Array of all store addresses
 * @param  {string} hash Hash of the merkle root of the document, not the target hash
 * @return {object} Object containing valid status and the issued status on all store
 */
const getIssuedSummary = async (storeAddresses = [], hash) => {
  const issued = await getIssuedOnAll(storeAddresses, hash);
  const issuedValues = values(issued);
  const valid =
    every(issuedValues, isTrue => isTrue === true) && issuedValues.length > 0;
  return {
    valid,
    issued
  };
};

/**
 * Provide a summary of issued status, given a document
 *
 * @param  {object} document Raw document data
 * @return {object} Summary of validity status, see getIssuedSummary()
 */
const verifyIssued = document => {
  const documentData = getData(document);
  const documentStoreAddresses = get(documentData, "issuers", []).map(
    // Returns the documentStore or certificateStore(openCerts's legacy) address
    i => i.documentStore || i.certificateStore
  );
  const merkleRoot = get(document, "signature.merkleRoot");
  return getIssuedSummary(documentStoreAddresses, merkleRoot);
};

module.exports = {
  getIssued,
  getIssuedOnAll,
  getIssuedSummary,
  verifyIssued
};
