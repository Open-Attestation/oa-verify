import { constants } from "ethers";
import { Hash, OpenAttestationContract } from "../types";
import { TYPES } from "../common/smartContract/constants";

export const isRevokedOnTokenRegistry = async (
  smartContract: OpenAttestationContract,
  hash: Hash
): Promise<boolean> => {
  const owner = await smartContract.instance.functions.ownerOf(hash);
  return owner === constants.AddressZero || owner === smartContract.address;
};

export const isRevokedOnDocumentStore = async (
  smartContract: OpenAttestationContract,
  hash: Hash
): Promise<boolean> => {
  return smartContract.instance.functions.isRevoked(hash);
};

export const isRevoked = (
  smartContract: OpenAttestationContract,
  hash: Hash
) => {
  switch (smartContract.type) {
    case TYPES.TOKEN_REGISTRY:
      return isRevokedOnTokenRegistry(smartContract, hash);
    case TYPES.DOCUMENT_STORE:
      return isRevokedOnDocumentStore(smartContract, hash);
    default:
      throw new Error("Smart contract type not supported");
  }
};
