import { defaultIssuerIdentityProofVerifiers } from "./verifiers";
import { issuerIdentityVerifierBuilder } from "./builder";

export const defaultIssuerIdentityVerifier = issuerIdentityVerifierBuilder(defaultIssuerIdentityProofVerifiers);
