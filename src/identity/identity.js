const { get, every, values } = require("lodash");
const { getIdentity } = require("../common/identityRegistry");
const { getData } = require("@govtechsg/open-attestation");

/**
 * Resolves multiple addresses, returning their identities if found
 *
 * @param  {string[]} addresses Array of addresses to resolve
 * @returns {object} Object of identities, with address as identifier
 */
const getIdentities = async (addresses = []) => {
  const identities = {};
  for (const address of addresses) {
    // Resolving identity in series because of caching in getIdentity
    const id = await getIdentity(address);
    identities[address] = id;
  }
  return identities;
};

/**
 * Checks an identity object to see if all identifier has resolved identity
 *
 * @param  {object} identities Object of identities, with address as identifier
 * @returns {boolean} True if all identifiers resolves
 */
const isAllIdentityValid = (identities = {}) => {
  const identityValues = values(identities);
  const valid =
    every(identityValues, isTrue => isTrue) && identityValues.length > 0;
  return valid;
};

/**
 * Get summary of the identity check, with a valid flag
 *
 * @param  {string[]} addresses Array of addresses to resolve, to support ENS names in future
 * @return {object} Summary of the check, with a valid flag
 */
const getIdentitySummary = async (addresses = []) => {
  const identities = await getIdentities(addresses);
  const valid = isAllIdentityValid(identities);
  return {
    valid,
    identities
  };
};

/**
 * Given a document, perform the check and return a summary
 *
 * @param  {object} document Raw OpenAttestation document
 * @return {object} Summary of the check, with a valid flag
 */
const verifyIdentity = document => {
  const documentData = getData(document);
  const documentStoreAddresses = get(documentData, "issuers", []).map(
    // Returns the documentStore or certificateStore(openCerts's legacy) address
    i => i.documentStore || i.certificateStore
  );
  return getIdentitySummary(documentStoreAddresses);
};

module.exports = {
  getIdentities,
  isAllIdentityValid,
  getIdentitySummary,
  verifyIdentity
};
