import { Contract } from "ethers";
import { getData, v2, v3, WrappedDocument, utils } from "@govtechsg/open-attestation";
import { Hash } from "../../types/core";
import { contractInstance } from "./contractInstance";
import documentStoreAbi from "./abi/documentStore.json";

export const getIssuersDocumentStore = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string[] => {
  if (utils.isWrappedV2Document(document)) {
    const data = getData(document);
    return data.issuers.map((issuer) => issuer.documentStore || issuer.certificateStore || "");
  }
  return [getData(document).proof.value];
};

export const createDocumentStoreContract = (address: string, { network }: { network: string }) => {
  return contractInstance({
    contractAddress: address,
    abi: documentStoreAbi,
    network,
  });
};

export const isIssuedOnDocumentStore = async (smartContract: Contract, hash: Hash): Promise<boolean> => {
  return (await smartContract.functions.isIssued(hash))[0];
};

export const isRevokedOnDocumentStore = async (smartContract: Contract, hash: Hash): Promise<boolean> => {
  return (await smartContract.functions.isRevoked(hash))[0];
};
