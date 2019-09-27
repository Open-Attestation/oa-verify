const { constants } = require("ethers");
const { TYPES } = require("../common/smartContract/constants");

const isRevokedOnTokenRegistry = async (smartContract, hash) => {
  try {
    const owner = await smartContract.instance.functions.ownerOf(hash);
    return owner === constants.AddressZero || owner === smartContract.address;
  } catch (e) {
    return true;
  }
};

const isRevokedOnDocumentStore = async (smartContract, hash) => {
  try {
    const revoked = await smartContract.instance.functions.isRevoked(hash);
    return revoked;
  } catch (e) {
    return true;
  }
};

const isRevoked = (smartContract, hash) => {
  switch (smartContract.type) {
    case TYPES.TOKEN_REGISTRY:
      return isRevokedOnTokenRegistry(smartContract, hash);
    case TYPES.DOCUMENT_STORE:
      return isRevokedOnDocumentStore(smartContract, hash);
    default:
      throw new Error("Smart contract type not supported");
  }
};

module.exports = {
  isRevokedOnTokenRegistry,
  isRevokedOnDocumentStore,
  isRevoked
};
