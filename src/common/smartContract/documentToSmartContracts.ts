import { Document, getData } from "@govtechsg/open-attestation";
import { issuerToSmartContract } from "./issuerToSmartContract";
import { Issuer } from "../../types";

// Given a list of issuers, convert to smart contract
const mapIssuersToSmartContracts = (issuers: Issuer[], network: string) =>
  issuers.map(issuer => issuerToSmartContract(issuer, network));

// Given a raw document, return list of all smart contracts
export const documentToSmartContracts = (
  document: Document,
  network: string
) => {
  const data = getData(document);
  const issuers = data.issuers || [];

  return mapIssuersToSmartContracts(issuers, network);
};
