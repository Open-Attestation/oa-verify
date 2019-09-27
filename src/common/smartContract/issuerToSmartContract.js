const contractInstance = require("./contractInstance");
const documentStoreAbi = require("./abi/documentStore.json");
const tokenRegistryAbi = require("./abi/tokenRegistry.json");
const { TYPES } = require("./constants");

const issuerToSmartContract = (issuer, network) => {
  switch (true) {
    case "tokenRegistry" in issuer:
      return {
        type: TYPES.TOKEN_REGISTRY,
        address: issuer.tokenRegistry,
        instance: contractInstance({
          contractAddress: issuer.tokenRegistry,
          abi: tokenRegistryAbi,
          network
        })
      };
    case "certificateStore" in issuer:
      return {
        type: TYPES.DOCUMENT_STORE,
        address: issuer.certificateStore,
        instance: contractInstance({
          contractAddress: issuer.certificateStore,
          abi: documentStoreAbi,
          network
        })
      };
    case "documentStore" in issuer:
      return {
        type: TYPES.DOCUMENT_STORE,
        address: issuer.documentStore,
        instance: contractInstance({
          contractAddress: issuer.documentStore,
          abi: documentStoreAbi,
          network
        })
      };
    default:
      throw new Error("Issuer does not have a smart contract");
  }
};

module.exports = issuerToSmartContract;
