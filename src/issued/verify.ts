import { WrappedDocument } from "@govtechsg/open-attestation";
import { isIssued } from "./contractInterface";
import { Hash, OpenAttestationContract } from "../types";

export const issuedStatusOnContracts = async (
  smartContracts: OpenAttestationContract[] = [],
  hash: Hash
) => {
  const issueStatusesDeferred = smartContracts.map(smartContract =>
    isIssued(smartContract, hash)
      .then(issued => ({
        address: smartContract.address,
        issued
      }))
      .catch(e => ({
        address: smartContract.address,
        issued: false,
        error: e.message || e
      }))
  );
  return Promise.all(issueStatusesDeferred);
};

export const isIssuedOnAll = (
  statuses: { address: Hash; issued: boolean }[]
) => {
  if (!statuses || statuses.length === 0) return false;
  return statuses.every(status => status.issued);
};

export const verifyIssued = async (
  document: WrappedDocument,
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
