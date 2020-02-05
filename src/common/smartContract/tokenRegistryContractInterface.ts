import { constants, Contract } from "ethers";
import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { Hash, isWrappedV2Document } from "../../types/core";
import { contractInstance } from "./contractInstance";
import tokenRegistryAbi from "./abi/tokenRegistry.json";

export const getIssuersTokenRegistry = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string[] => {
  if (isWrappedV2Document(document)) {
    const data = getData(document);
    return data.issuers.map(issuer => issuer.tokenRegistry || "");
  }
  return [getData(document).proof.value];
};

export const createTokenRegistryContract = (address: string, { network }: { network: string }) => {
  return contractInstance({
    contractAddress: address,
    abi: tokenRegistryAbi,
    network
  });
};

export const isMintedOnTokenRegistry = async (smartContract: Contract, hash: Hash): Promise<boolean> => {
  return smartContract.functions.ownerOf(hash).then(owner => !(owner === constants.AddressZero));
};
