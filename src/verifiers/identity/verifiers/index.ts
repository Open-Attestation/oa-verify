import { OpenAttestationDidIdentityProof } from "./did";
import { OpenAttestationDnsDidIdentityProof } from "./dnsDid";
import { OpenAttestationDnsTxtIdentityProof } from "./dnsTxt";

export { OpenAttestationDidIdentityProof, OpenAttestationDnsDidIdentityProof, OpenAttestationDnsTxtIdentityProof };

export const defaultIssuerIdentityProofVerifiers = [
  OpenAttestationDnsDidIdentityProof,
  OpenAttestationDnsTxtIdentityProof,
];
