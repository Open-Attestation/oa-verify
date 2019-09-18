const ethers = require("ethers");
const abi = require("../common/abi/documentStore.json");
const { INFURA_API_KEY } = require("../config");

const contractInstance = ({ network, contractAddress }) => {
  const provider = new ethers.providers.InfuraProvider(network, INFURA_API_KEY);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return contract;
};

const execute = async ({ network, contractAddress, method, args }) => {
  const contract = contractInstance({ network, contractAddress });
  const result = await contract.functions[method](...args);
  return result;
};

module.exports = { contractInstance, execute };
