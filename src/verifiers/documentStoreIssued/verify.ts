import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { isIssued } from "./contractInterface";
import { Hash, OpenAttestationContract } from "../../types/core";

export const issuedStatusOnContracts = async (smartContracts: OpenAttestationContract[] = [], hash: Hash) => {
  const issueStatusesDeferred = smartContracts.map(smartContract => isIssued(smartContract, hash));
  return Promise.all(issueStatusesDeferred);
};

export const isIssuedOnAll = (statuses: { address: Hash; issued: boolean }[]) => {
  if (!statuses || statuses.length === 0) return false;
  return statuses.every(status => status.issued);
};

export const verifyIssued = async (
  document: WrappedDocument<v2.OpenAttestationDocument | v3.OpenAttestationDocument>,
  smartContracts: OpenAttestationContract[] = []
) => {
  const hash = `0x${document.signature.merkleRoot}`;
  const details = await issuedStatusOnContracts(smartContracts, hash);
  const issuedOnAll = isIssuedOnAll(details);

  return {
    issuedOnAll,
    details
  };
};
