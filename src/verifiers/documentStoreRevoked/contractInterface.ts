import { constants } from "ethers";
import { v3 } from "@govtechsg/open-attestation";
import { Hash, OpenAttestationContract } from "../../types/core";

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

export const isRevoked = (smartContract: OpenAttestationContract, hash: Hash) => {
  switch (smartContract.type) {
    case v3.Method.TokenRegistry:
      return isRevokedOnTokenRegistry(smartContract, hash);
    case v3.Method.DocumentStore:
      return isRevokedOnDocumentStore(smartContract, hash);
    default:
      throw new Error("Smart contract type not supported");
  }
};
