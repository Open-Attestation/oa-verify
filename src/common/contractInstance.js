const ethers = require("ethers");
const { INFURA_API_KEY } = require("../config");

const contractInstance = ({ abi, network, contractAddress }) => {
  const provider = new ethers.providers.InfuraProvider(network, INFURA_API_KEY);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return contract;
};

module.exports = contractInstance;
