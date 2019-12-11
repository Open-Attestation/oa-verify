/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { v2 } from "@govtechsg/open-attestation";
import { contractInstance } from "./contractInstance";
import { TYPES } from "./constants";
import tokenRegistryAbi from "./abi/tokenRegistry.json";
import documentStoreAbi from "./abi/documentStore.json";
import { OpenAttestationContract } from "../../types";

export const issuerToSmartContract = (
  issuer: v2.Issuer,
  network: string
): OpenAttestationContract => {
  switch (true) {
    case "tokenRegistry" in issuer:
      return {
        type: TYPES.TOKEN_REGISTRY,
        address: issuer.tokenRegistry!,
        instance: contractInstance({
          contractAddress: issuer.tokenRegistry!,
          abi: tokenRegistryAbi,
          network
        })
      };
    case "certificateStore" in issuer:
      return {
        type: TYPES.DOCUMENT_STORE,
        address: issuer.certificateStore!,
        instance: contractInstance({
          contractAddress: issuer.certificateStore!,
          abi: documentStoreAbi,
          network
        })
      };
    case "documentStore" in issuer:
      return {
        type: TYPES.DOCUMENT_STORE,
        address: issuer.documentStore!,
        instance: contractInstance({
          contractAddress: issuer.documentStore!,
          abi: documentStoreAbi,
          network
        })
      };
    default:
      throw new Error("Issuer does not have a smart contract");
  }
};
