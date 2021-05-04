import {
  ErrorVerificationFragment,
  InvalidVerificationFragment,
  SkippedVerificationFragment,
  ValidVerificationFragment,
} from "../../../types/core";
import {
  DidVerificationStatusArray,
  InvalidDidVerificationStatus,
  ValidDidVerificationStatus,
  ValidDidVerificationStatusArray,
} from "../../../did/verifier";

/**
 * Fragments
 */
export type OpenAttestationDidIdentityProofValidFragmentV3 = ValidVerificationFragment<ValidDidVerificationStatus>;
export type OpenAttestationDidIdentityProofInvalidFragmentV3 = InvalidVerificationFragment<InvalidDidVerificationStatus>;
export type OpenAttestationDidIdentityProofValidFragmentV2 = ValidVerificationFragment<ValidDidVerificationStatusArray>;
export type OpenAttestationDidIdentityProofInvalidFragmentV2 = InvalidVerificationFragment<DidVerificationStatusArray>;
export type OpenAttestationDidIdentityProofErrorFragment = ErrorVerificationFragment<any>;
export type OpenAttestationDidIdentityProofVerificationFragment =
  | OpenAttestationDidIdentityProofValidFragmentV2
  | OpenAttestationDidIdentityProofInvalidFragmentV2
  | OpenAttestationDidIdentityProofValidFragmentV3
  | OpenAttestationDidIdentityProofInvalidFragmentV3
  | OpenAttestationDidIdentityProofErrorFragment
  | SkippedVerificationFragment;
