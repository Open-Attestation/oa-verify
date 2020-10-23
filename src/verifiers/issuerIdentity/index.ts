import { issuerIdentityVerifierBuilder } from "./builder";
import {
  OpenAttestationDidIdentityProof,
  OpenAttestationDnsDidIdentityProof,
  OpenAttestationDnsTxtIdentityProof,
} from "./verifiers";

// Default set of issuer identity verifiers
// Currently excludes OpenAttestationDidIdentityProof
export const defaultIssuerIdentityProofVerifiers = [
  OpenAttestationDnsDidIdentityProof,
  OpenAttestationDnsTxtIdentityProof,
];

// Default ISSUER_IDENTITY verifier, built from defaultIssuerIdentityProofVerifiers
export const OpenAttestationIssuerIdentityVerifier = issuerIdentityVerifierBuilder(defaultIssuerIdentityProofVerifiers);

// Exporting all verifiers for dependant apps to compose
export const verifiers = {
  OpenAttestationDidIdentityProof,
  OpenAttestationDnsDidIdentityProof,
  OpenAttestationDnsTxtIdentityProof,
  defaultIssuerIdentityProofVerifiers,
};

// Exporting builder for dependant app to build issuer identity verifier
export * from "./builder";
