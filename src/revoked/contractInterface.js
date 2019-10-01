const { constants } = require("ethers");
const { TYPES } = require("../common/smartContract/constants");

const isRevokedOnTokenRegistry = async (smartContract, hash) => {
  const owner = await smartContract.instance.functions.ownerOf(hash);
  return owner === constants.AddressZero || owner === smartContract.address;
};

const isRevokedOnDocumentStore = async (smartContract, hash) => {
  const revoked = await smartContract.instance.functions.isRevoked(hash);
  return revoked;
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
