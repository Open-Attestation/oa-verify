import { Array as RunTypesArray, Literal, Optional, Record, Static, String, Union } from "runtypes";
import { ErrorVerificationFragment, InvalidVerificationFragment, SkippedVerificationFragment, ValidVerificationFragment } from "../../../types/core";
/**
 * DNS-TXT verification status
 */
export declare const ValidDnsTxtVerificationStatus: Record<{
    status: Literal<"VALID">;
    location: String;
    value: String;
}, false>;
export declare type ValidDnsTxtVerificationStatus = Static<typeof ValidDnsTxtVerificationStatus>;
export declare const ValidDnsTxtVerificationStatusArray: import("runtypes").Constraint<RunTypesArray<Record<{
    status: Literal<"VALID">;
    location: String;
    value: String;
}, false>, false>, {
    status: "VALID";
    location: string;
    value: string;
}[], unknown>;
export declare type ValidDnsTxtVerificationStatusArray = Static<typeof ValidDnsTxtVerificationStatusArray>;
export declare const InvalidDnsTxtVerificationStatus: Record<{
    status: Literal<"INVALID">;
    location: Optional<String>;
    value: Optional<String>;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>;
export declare type InvalidDnsTxtVerificationStatus = Static<typeof InvalidDnsTxtVerificationStatus>;
export declare const DnsTxtVerificationStatus: Union<[Record<{
    status: Literal<"VALID">;
    location: String;
    value: String;
}, false>, Record<{
    status: Literal<"INVALID">;
    location: Optional<String>;
    value: Optional<String>;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>]>;
export declare type DnsTxtVerificationStatus = Static<typeof DnsTxtVerificationStatus>;
export declare const DnsTxtVerificationStatusArray: RunTypesArray<Union<[Record<{
    status: Literal<"VALID">;
    location: String;
    value: String;
}, false>, Record<{
    status: Literal<"INVALID">;
    location: Optional<String>;
    value: Optional<String>;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>]>, false>;
export declare type DnsTxtVerificationStatusArray = Static<typeof DnsTxtVerificationStatusArray>;
/**
 * Data for v3 Fragments
 */
export declare const ValidDnsTxtVerificationStatusDataV3: Record<{
    identifier: String;
    value: String;
}, false>;
export declare type ValidDnsTxtVerificationStatusDataV3 = Static<typeof ValidDnsTxtVerificationStatusDataV3>;
export declare const InvalidDnsTxtVerificationStatusDataV3: import("runtypes").Constraint<import("runtypes").InternalRecord<{
    identifier: String;
    value: String;
}, true, false>, {
    identifier?: string | undefined;
    value?: string | undefined;
}, unknown>;
export declare type InvalidDnsTxtVerificationStatusDataV3 = Static<typeof InvalidDnsTxtVerificationStatusDataV3>;
export declare const DnsTxtVerificationStatusDataV3: Union<[Record<{
    identifier: String;
    value: String;
}, false>, import("runtypes").Constraint<import("runtypes").InternalRecord<{
    identifier: String;
    value: String;
}, true, false>, {
    identifier?: string | undefined;
    value?: string | undefined;
}, unknown>]>;
export declare type DnsTxtVerificationStatusDataV3 = Static<typeof DnsTxtVerificationStatusDataV3>;
/**
 * Fragments
 */
export declare type OpenAttestationDnsTxtIdentityProofValidFragmentV2 = ValidVerificationFragment<ValidDnsTxtVerificationStatusArray>;
export declare type OpenAttestationDnsTxtIdentityProofInvalidFragmentV2 = InvalidVerificationFragment<DnsTxtVerificationStatusArray>;
export declare type OpenAttestationDnsTxtIdentityProofValidFragmentV3 = ValidVerificationFragment<ValidDnsTxtVerificationStatusDataV3>;
export declare type OpenAttestationDnsTxtIdentityProofInvalidFragmentV3 = InvalidVerificationFragment<InvalidDnsTxtVerificationStatusDataV3>;
export declare type OpenAttestationDnsTxtIdentityProofVerificationFragment = OpenAttestationDnsTxtIdentityProofValidFragmentV2 | OpenAttestationDnsTxtIdentityProofInvalidFragmentV2 | OpenAttestationDnsTxtIdentityProofValidFragmentV3 | OpenAttestationDnsTxtIdentityProofInvalidFragmentV3 | ErrorVerificationFragment<any> | SkippedVerificationFragment;
