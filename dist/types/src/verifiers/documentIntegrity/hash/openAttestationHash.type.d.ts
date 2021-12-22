import { ErrorVerificationFragment, InvalidVerificationFragment, SkippedVerificationFragment, ValidVerificationFragment } from "../../../types/core";
export declare type OpenAttestationHashValidFragment = ValidVerificationFragment<true>;
export declare type OpenAttestationHashInvalidFragment = InvalidVerificationFragment<false>;
export declare type OpenAttestationHashErrorFragment = ErrorVerificationFragment<any>;
export declare type OpenAttestationHashVerificationFragment = OpenAttestationHashValidFragment | OpenAttestationHashInvalidFragment | OpenAttestationHashErrorFragment | SkippedVerificationFragment;
