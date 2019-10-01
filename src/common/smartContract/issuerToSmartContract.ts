/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { contractInstance } from "./contractInstance";
import { TYPES } from "./constants";
import * as tokenRegistryAbi from "./abi/tokenRegistry.json";
import * as documentStoreAbi from "./abi/documentStore.json";
import { Issuer, OpenAttestationContract } from "../../types";

export const issuerToSmartContract = (
  issuer: Issuer,
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
