(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@govtechsg/open-attestation'), require('lodash'), require('axios'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['@govtechsg/open-attestation', 'lodash', 'axios', 'ethers'], factory) :
  (global = global || self, global['@govtechsg/oa-verify'] = factory(global.openAttestation, global.lodash, global.axios, global.ethers));
}(this, function (openAttestation, lodash, axios, ethers) { 'use strict';

  openAttestation = openAttestation && openAttestation.hasOwnProperty('default') ? openAttestation['default'] : openAttestation;
  lodash = lodash && lodash.hasOwnProperty('default') ? lodash['default'] : lodash;
  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
  ethers = ethers && ethers.hasOwnProperty('default') ? ethers['default'] : ethers;

  const { verifySignature } = openAttestation;

  const verifyHash = certificate => ({ valid: verifySignature(certificate) });

  var hash = { verifyHash };

  const { mapKeys } = lodash;

  const REGISTRY_URL = "https://opencerts.io/static/registry.json";
  const CACHE_TTL = 30 * 60 * 1000; // 30 min

  let cachedRegistryResponse;
  let cachedRegistryBestBefore;

  const setCache = (res, expiry) => {
    cachedRegistryResponse = res;
    cachedRegistryBestBefore = expiry;
  };

  const isValidData = () =>
    !!cachedRegistryResponse && Date.now() < cachedRegistryBestBefore;

  const fetchData = async () => {
    if (isValidData()) return cachedRegistryResponse;
    const res = await axios.get(REGISTRY_URL);
    setCache(res, Date.now() + CACHE_TTL);
    return res;
  };

  const getIdentity = async (identifier = "") => {
    const {
      data: { issuers }
    } = await fetchData();
    const lowercaseAddress = mapKeys(issuers, (_val, key) => key.toLowerCase());
    const identity = lowercaseAddress[identifier.toLowerCase()];
    return identity;
  };

  var identityRegistry = {
    setCache,
    isValidData,
    fetchData,
    getIdentity
  };

  const { getData } = openAttestation;
  const { get, every, values } = lodash;
  const { getIdentity: getIdentity$1 } = identityRegistry;

  /**
   * Resolves multiple addresses, returning their identities if found
   *
   * @param  {string[]} addresses Array of addresses to resolve
   * @returns {object} Object of identities, with address as identifier
   */
  const getIdentities = async (addresses = []) => {
    const identities = {};
    for (let i = 0; i < addresses.length; i += 1) {
      const address = addresses[i];
      // Resolving identity in series because of caching in getIdentity
      // eslint-disable-next-line no-await-in-loop
      const id = await getIdentity$1(address);
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

  var identity = {
    getIdentities,
    isAllIdentityValid,
    getIdentitySummary,
    verifyIdentity
  };



  var abi = /*#__PURE__*/Object.freeze({

  });

  function getCjsExportFromNamespace (n) {
  	return n && n.default || n;
  }

  var abi$1 = getCjsExportFromNamespace(abi);

  const NETWORK = "homestead";
  const INFURA_API_KEY = "92c9a51428b946c1b8c1ac5a237616e4";

  const provider = new ethers.providers.InfuraProvider(NETWORK, INFURA_API_KEY);

  const documentStore = async (storeAddress, contractMethod, ...args) => {
    const contract = new ethers.Contract(storeAddress, abi$1, provider);
    const result = await contract.functions[contractMethod](...args);
    return result;
  };

  var documentStore_1 = documentStore;

  const { get: get$1, every: every$1, values: values$1, zipObject } = lodash;
  const { getData: getData$1 } = openAttestation;



  /**
   * Checks issue status on a single document store
   *
   * @param  {} storeAddress Address of document store to check issue status on
   * @param  {} hash Hash of the merkle root of the document, not the target hash
   */
  const getIssued = async (storeAddress, hash) => {
    try {
      const issued = await documentStore_1(storeAddress, "isIssued", `0x${hash}`);
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
    const issuedValues = values$1(issued);
    const valid =
      every$1(issuedValues, isTrue => isTrue === true) && issuedValues.length > 0;
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
    const documentData = getData$1(document);
    const documentStoreAddresses = get$1(documentData, "issuers", []).map(
      // Returns the documentStore or certificateStore(openCerts's legacy) address
      i => i.documentStore || i.certificateStore
    );
    const merkleRoot = get$1(document, "signature.merkleRoot");
    return getIssuedSummary(documentStoreAddresses, merkleRoot);
  };

  var issued = {
    getIssued,
    getIssuedOnAll,
    getIssuedSummary,
    verifyIssued
  };

  const { get: get$2, every: every$2, values: values$2, some, zipObject: zipObject$1 } = lodash;
  const { utils, getData: getData$2 } = openAttestation;



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
      const revoked = await documentStore_1(storeAddress, "isRevoked", `0x${hash}`);
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
    return zipObject$1(storeAddresses, revokeStatusesByStore);
  };

  /**
   * Gets a summary of the check
   *
   * @param  {string[]} storeAddresses Array of all store addresses to check against
   * @param  {string[]} intermediateHashes Array of all hashes to check
   * @returns {object} Object with a valid status flag and the individual stores' responses
   */
  const getIssuedSummary$1 = async (
    storeAddresses = [],
    intermediateHashes = []
  ) => {
    // Needs to calculate all hash
    const revoked = await getRevokedOnAllStore(
      storeAddresses,
      intermediateHashes
    );
    const revokedValues = values$2(revoked);
    const valid =
      every$2(revokedValues, isTrue => isTrue === false) &&
      revokedValues.length > 0;
    return {
      valid,
      revoked
    };
  };
  const verifyRevoked = async document => {
    const documentData = getData$2(document);
    const storeAddresses = get$2(documentData, "issuers", []).map(
      // Returns the documentStore or certificateStore(openCerts's legacy) address
      i => i.documentStore || i.certificateStore
    );
    const targetHash = get$2(document, "signature.targetHash");
    const proofs = get$2(document, "signature.proof");
    const intermediateHashes = getIntermediateHashes(targetHash, proofs);
    return getIssuedSummary$1(storeAddresses, intermediateHashes);
  };

  var unrevoked = {
    getRevoked,
    getRevokedByStore,
    getRevokedOnAllStore,
    getIssuedSummary: getIssuedSummary$1,
    getIntermediateHashes,
    verifyRevoked
  };

  const { verifyHash: verifyHash$1 } = hash;
  const { verifyIdentity: verifyIdentity$1 } = identity;
  const { verifyIssued: verifyIssued$1 } = issued;
  const { verifyRevoked: verifyRevoked$1 } = unrevoked;

  const verify = async document => {
    const verificationsDeferred = [
      verifyHash$1(document),
      verifyIdentity$1(document),
      verifyIssued$1(document),
      verifyRevoked$1(document)
    ];

    const [hash, identity, issued, revoked] = await Promise.all(
      verificationsDeferred
    );

    return {
      hash,
      identity,
      issued,
      revoked,
      valid: hash.valid && identity.valid && issued.valid && revoked.valid
    };
  };

  var src = verify;

  return src;

}));
