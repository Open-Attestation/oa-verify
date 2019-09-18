const contractInstance = require("./contractInstance");
const documentStoreAbi = require("./abi/documentStore.json");
const tokenRegistryAbi = require("./abi/tokenRegistry.json");

// Given a list of issuers, convert to smart contract
const mapIssuersToSmartContracts = (issuers, network) =>
  issuers.map(issuer => {
    if (issuer.tokenRegistry) {
      return {
        type: "TOKEN_REGISTRY",
        address: issuer.tokenRegistry,
        instance: contractInstance({
          contractAddress: issuer.tokenRegistry,
          abi: tokenRegistryAbi,
          network
        })
      };
    } else if (issuer.certificateStore) {
      return {
        type: "DOCUMENT_STORE",
        address: issuer.certificateStore,
        instance: contractInstance({
          contractAddress: issuer.certificateStore,
          abi: documentStoreAbi,
          network
        })
      };
    } else if (issuer.documentStore) {
      return {
        type: "DOCUMENT_STORE",
        address: issuer.documentStore,
        instance: contractInstance({
          contractAddress: issuer.documentStore,
          abi: documentStoreAbi,
          network
        })
      };
    } else {
      throw new Error("Issuer does not have a smart contract");
    }
  });

module.exports = mapIssuersToSmartContracts;
