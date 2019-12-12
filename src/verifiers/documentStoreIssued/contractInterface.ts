import { constants } from "ethers";
import { v3 } from "@govtechsg/open-attestation";
import { Hash, OpenAttestationContract } from "../../types/core";

// Return issued status given a smart contract instance (documentStore/tokenRegistry)
export const isIssuedOnTokenRegistry = async (smartContract: OpenAttestationContract, hash: Hash): Promise<boolean> => {
  const owner = await smartContract.instance.functions.ownerOf(hash);
  return !(owner === constants.AddressZero);
};

export const isIssuedOnDocumentStore = async (smartContract: OpenAttestationContract, hash: Hash): Promise<boolean> => {
  return smartContract.instance.functions.isIssued(hash);
};

export const isIssued = (smartContract: OpenAttestationContract, hash: Hash) => {
  switch (smartContract.type) {
    case v3.Method.TokenRegistry:
      return isIssuedOnTokenRegistry(smartContract, hash);
    case v3.Method.DocumentStore:
      return isIssuedOnDocumentStore(smartContract, hash);
    default:
      throw new Error("Smart contract type not supported");
  }
};
