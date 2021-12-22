import { ErrorVerificationFragment, InvalidVerificationFragment, SkippedVerificationFragment, ValidVerificationFragment } from "../../../types/core";
import { DidVerificationStatusArray, InvalidDidVerificationStatus, ValidDidVerificationStatus, ValidDidVerificationStatusArray } from "../../../did/verifier";
/**
 * Fragments
 */
export declare type OpenAttestationDidIdentityProofValidFragmentV3 = ValidVerificationFragment<ValidDidVerificationStatus>;
export declare type OpenAttestationDidIdentityProofInvalidFragmentV3 = InvalidVerificationFragment<InvalidDidVerificationStatus>;
export declare type OpenAttestationDidIdentityProofValidFragmentV2 = ValidVerificationFragment<ValidDidVerificationStatusArray>;
export declare type OpenAttestationDidIdentityProofInvalidFragmentV2 = InvalidVerificationFragment<DidVerificationStatusArray>;
export declare type OpenAttestationDidIdentityProofErrorFragment = ErrorVerificationFragment<any>;
export declare type OpenAttestationDidIdentityProofVerificationFragment = OpenAttestationDidIdentityProofValidFragmentV2 | OpenAttestationDidIdentityProofInvalidFragmentV2 | OpenAttestationDidIdentityProofValidFragmentV3 | OpenAttestationDidIdentityProofInvalidFragmentV3 | OpenAttestationDidIdentityProofErrorFragment | SkippedVerificationFragment;
