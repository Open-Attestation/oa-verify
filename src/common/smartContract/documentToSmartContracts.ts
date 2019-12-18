import { getData, WrappedDocument, v3, v2 } from "@govtechsg/open-attestation";
import { issuerToSmartContract } from "./issuerToSmartContract";
import { contractInstance } from "./contractInstance";
import documentStoreAbi from "./abi/documentStore.json";
import { OpenAttestationContract } from "../../types";

// Given a list of issuers, convert to smart contract
const mapIssuersToSmartContracts = (issuers: v2.Issuer[], network: string) =>
  issuers.map(issuer => issuerToSmartContract(issuer, network));

const isV2Document = (
  document: any
): document is v2.OpenAttestationDocument => {
  return !document.issuer; // issuer is a mandatory field for v3 open-attestation document
};

// Given a raw document, return list of all smart contracts
export const documentToSmartContracts = (
  document:
    | WrappedDocument<v3.OpenAttestationDocument>
    | WrappedDocument<v2.OpenAttestationDocument>,
  network: string
): OpenAttestationContract[] => {
  const data = getData(document);

  if (isV2Document(data)) {
    const issuers = data.issuers || [];
    return mapIssuersToSmartContracts(issuers, network);
  }
  return [
    {
      type: data.proof.method,
      address: data.proof.value,
      instance: contractInstance({
        contractAddress: data.proof.value,
        abi: documentStoreAbi,
        network
      })
    }
  ];
};
