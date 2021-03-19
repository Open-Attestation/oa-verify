import {
  ErrorVerificationFragment,
  InvalidVerificationFragment,
  SkippedVerificationFragment,
  ValidVerificationFragment,
} from "../../../types/core";

export type OpenAttestationHashValidFragment = ValidVerificationFragment<true>;
export type OpenAttestationHashInvalidFragment = InvalidVerificationFragment<false>;
export type OpenAttestationHashErrorFragment = ErrorVerificationFragment<any>;
export type OpenAttestationHashVerificationFragment =
  | OpenAttestationHashValidFragment
  | OpenAttestationHashInvalidFragment
  | OpenAttestationHashErrorFragment
  | SkippedVerificationFragment;
