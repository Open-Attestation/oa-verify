import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { contractInstance } from "./contractInstance";
import tokenRegistryAbi from "./abi/tokenRegistry.json";
import documentStoreAbi from "./abi/documentStore.json";
import { isWrappedV2Document, OpenAttestationContract } from "../../types/core";

// Given a raw document, return list of all token registry contracts
export const getTokenRegistrySmartContract = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>,
  options: { network: string }
): OpenAttestationContract[] => {
  if (isWrappedV2Document(document)) {
    const documentData = getData(document);
    const issuersWithTokenRegistry = documentData.issuers.filter(issuer => "tokenRegistry" in issuer).length;
    if (issuersWithTokenRegistry > 1) {
      throw new Error(`Only one token registry is allowed. Found ${issuersWithTokenRegistry}`);
    }
    return (documentData.issuers || []).map(issuer => {
      if (!issuer.tokenRegistry) {
        throw new Error(`No token registry for issuer "${issuer.name}"`);
      }
      return {
        type: v3.Method.TokenRegistry,
        address: issuer.tokenRegistry,
        instance: contractInstance({
          contractAddress: issuer.tokenRegistry,
          abi: tokenRegistryAbi,
          network: options.network
        })
      };
    });
  }
  const documentData = getData(document);
  return [
    {
      type: documentData.proof.method,
      address: documentData.proof.value,
      instance: contractInstance({
        contractAddress: documentData.proof.value,
        abi: tokenRegistryAbi,
        network: options.network
      })
    }
  ];
};

export const getDocumentStoreSmartContract = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>,
  options: { network: string }
) => {
  if (isWrappedV2Document(document)) {
    const documentData = getData(document);
    return (documentData.issuers || []).map(issuer => {
      if (!issuer.certificateStore && !issuer.documentStore) {
        throw new Error(`No document store for issuer "${issuer.name}"`);
      }
      const address = issuer.documentStore || issuer.certificateStore || "";
      return {
        type: v3.Method.DocumentStore,
        address,
        instance: contractInstance({
          contractAddress: address,
          abi: documentStoreAbi,
          network: options.network
        })
      };
    });
  }
  const documentData = getData(document);
  return [
    {
      type: documentData.proof.method,
      address: documentData.proof.value,
      instance: contractInstance({
        contractAddress: documentData.proof.value,
        abi: documentStoreAbi,
        network: options.network
      })
    }
  ];
};
