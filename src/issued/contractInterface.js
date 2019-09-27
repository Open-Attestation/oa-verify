const { constants } = require("ethers");
const { TYPES } = require("../common/smartContract/constants");

// Return issued status given a smart contract instance (documentStore/tokenRegistry)
const isIssuedOnTokenRegistry = async (smartContract, hash) => {
  try {
    const owner = await smartContract.instance.functions.ownerOf(hash);
    return !(owner === constants.AddressZero);
  } catch (e) {
    return false;
  }
};

const isIssuedOnDocumentStore = async (smartContract, hash) => {
  try {
    const issued = await smartContract.instance.functions.isIssued(hash);
    return issued;
  } catch (e) {
    return false;
  }
};

const isIssued = (smartContract, hash) => {
  switch (smartContract.type) {
    case TYPES.TOKEN_REGISTRY:
      return isIssuedOnTokenRegistry(smartContract, hash);
    case TYPES.DOCUMENT_STORE:
      return isIssuedOnDocumentStore(smartContract, hash);
    default:
      throw new Error("Smart contract type not supported");
  }
};

module.exports = { isIssuedOnTokenRegistry, isIssuedOnDocumentStore, isIssued };
