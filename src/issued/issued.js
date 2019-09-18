const { get, every, values, zipObject } = require("lodash");
const { getData } = require("@govtechsg/open-attestation");

const { execute } = require("../common/documentStore");

/**
 * Checks issue status on a single document store
 *
 * @param  {} contractAddress Address of document store to check issue status on
 * @param  {} hash Hash of the merkle root of the document, not the target hash
 * @param  {} network Ethereum network to check against
 */
const getIssued = async (contractAddress, hash, network) => {
  try {
    const issued = await execute({
      network,
      contractAddress,
      method: "isIssued",
      args: [`0x${hash}`]
    });
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
 * @param  {string[]} contractAddresses Array of all store addresses
 * @param  {string} hash Hash of the merkle root of the document, not the target hash
 * @param  {string} network Ethereum network to check against
 * @return {object} Issue status of the document on each of the store, with store address as the key
 */
const getIssuedOnAll = async (contractAddresses = [], hash, network) => {
  const issueStatusesDefered = contractAddresses.map(contractAddress =>
    getIssued(contractAddress, hash, network)
  );
  const issueStatuses = await Promise.all(issueStatusesDefered);
  return zipObject(contractAddresses, issueStatuses);
};

/**
 * Provide a summary of the validity of the issued status
 *
 * @param  {string[]} contractAddresses Array of all store addresses
 * @param  {string} hash Hash of the merkle root of the document, not the target hash
 * @param  {string} network Ethereum network to check against
 * @return {object} Object containing valid status and the issued status on all store
 */
const getIssuedSummary = async (contractAddresses = [], hash, network) => {
  const issued = await getIssuedOnAll(contractAddresses, hash, network);
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
 * @param  {string} network Ethereum network to check against
 * @return {object} Summary of validity status, see getIssuedSummary()
 */
const verifyIssued = (document, network) => {
  const documentData = getData(document);
  const documentcontractAddresses = get(documentData, "issuers", []).map(
    // Returns the documentStore or certificateStore(openCerts's legacy) address
    i => i.documentStore || i.certificateStore
  );
  const merkleRoot = get(document, "signature.merkleRoot");
  return getIssuedSummary(documentcontractAddresses, merkleRoot, network);
};

module.exports = {
  getIssued,
  getIssuedOnAll,
  getIssuedSummary,
  verifyIssued
};
