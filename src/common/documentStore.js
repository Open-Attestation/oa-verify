const ethers = require("ethers");
const abi = require("../common/smartContract/abi/documentStore.json");
const { INFURA_API_KEY } = require("../config");

const documentStore = async ({ network, storeAddress, method, args }) => {
  const provider = new ethers.providers.InfuraProvider(network, INFURA_API_KEY);
  const contract = new ethers.Contract(storeAddress, abi, provider);
  const result = await contract.functions[method](...args);
  return result;
};

module.exports = documentStore;
