const axios = require("axios");
const { mapKeys } = require("lodash");

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
  const getIdentity = lowercaseAddress[identifier.toLowerCase()];
  return getIdentity;
};

module.exports = {
  setCache,
  isValidData,
  fetchData,
  getIdentity
};
