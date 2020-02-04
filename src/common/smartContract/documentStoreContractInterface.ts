import { Contract } from "ethers";
import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { Hash, isWrappedV2Document } from "../../types/core";
import { contractInstance } from "./contractInstance";
import documentStoreAbi from "./abi/documentStore.json";

export const getIssuersDocumentStore = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string[] => {
  if (isWrappedV2Document(document)) {
    const data = getData(document);
    return data.issuers.map(issuer => issuer.documentStore || issuer.certificateStore || "");
  }
  return [getData(document).proof.value];
};

export const createDocumentStoreContract = (address: string, { network }: { network: string }) => {
  return contractInstance({
    contractAddress: address,
    abi: documentStoreAbi,
    network
  });
};

export const isIssuedOnDocumentStore = async (smartContract: Contract, hash: Hash): Promise<boolean> => {
  return smartContract.functions.isIssued(hash);
};

export const isRevokedOnDocumentStore = async (smartContract: Contract, hash: Hash): Promise<boolean> => {
  return smartContract.functions.isRevoked(hash);
};
