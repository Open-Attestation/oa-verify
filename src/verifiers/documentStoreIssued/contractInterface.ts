import { v3 } from "@govtechsg/open-attestation";
import { Hash, OpenAttestationContract } from "../../types/core";
import { isIssuedOnDocumentStore } from "./documentStoreContractInterface";
import { isIssuedOnTokenRegistry } from "./tokenRegistryContractInterface";

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
