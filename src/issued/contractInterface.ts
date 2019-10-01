import { constants } from "ethers";
import { Hash, OpenAttestationContract } from "../types";
import { TYPES } from "../common/smartContract/constants";

// Return issued status given a smart contract instance (documentStore/tokenRegistry)
export const isIssuedOnTokenRegistry = async (
  smartContract: OpenAttestationContract,
  hash: Hash
): Promise<boolean> => {
  const owner = await smartContract.instance.functions.ownerOf(hash);
  return !(owner === constants.AddressZero);
};

export const isIssuedOnDocumentStore = async (
  smartContract: OpenAttestationContract,
  hash: Hash
): Promise<boolean> => {
  return smartContract.instance.functions.isIssued(hash);
};

export const isIssued = (
  smartContract: OpenAttestationContract,
  hash: Hash
) => {
  switch (smartContract.type) {
    case TYPES.TOKEN_REGISTRY:
      return isIssuedOnTokenRegistry(smartContract, hash);
    case TYPES.DOCUMENT_STORE:
      return isIssuedOnDocumentStore(smartContract, hash);
    default:
      throw new Error("Smart contract type not supported");
  }
};
