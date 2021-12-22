import { Array as RunTypesArray, Literal, Record, Static, String, Union } from "runtypes";
import { ErrorVerificationFragment, InvalidVerificationFragment, SkippedVerificationFragment, ValidVerificationFragment } from "../../../types/core";
/**
 * DNS-DID verification status
 */
export declare const ValidDnsDidVerificationStatus: Record<{
    status: Literal<"VALID">;
    location: String;
    key: String;
}, false>;
export declare type ValidDnsDidVerificationStatus = Static<typeof ValidDnsDidVerificationStatus>;
export declare const ValidDnsDidVerificationStatusArray: import("runtypes").Constraint<RunTypesArray<Record<{
    status: Literal<"VALID">;
    location: String;
    key: String;
}, false>, false>, {
    status: "VALID";
    location: string;
    key: string;
}[], unknown>;
export declare type ValidDnsDidVerificationStatusArray = Static<typeof ValidDnsDidVerificationStatusArray>;
export declare const InvalidDnsDidVerificationStatus: Record<{
    status: Literal<"INVALID">;
    location: String;
    key: String;
}, false>;
export declare type InvalidDnsDidVerificationStatus = Static<typeof InvalidDnsDidVerificationStatus>;
export declare const DnsDidVerificationStatus: Union<[Record<{
    status: Literal<"VALID">;
    location: String;
    key: String;
}, false>, Record<{
    status: Literal<"INVALID">;
    location: String;
    key: String;
}, false>]>;
export declare type DnsDidVerificationStatus = Static<typeof DnsDidVerificationStatus>;
export declare const DnsDidVerificationStatusArray: RunTypesArray<Union<[Record<{
    status: Literal<"VALID">;
    location: String;
    key: String;
}, false>, Record<{
    status: Literal<"INVALID">;
    location: String;
    key: String;
}, false>]>, false>;
export declare type DnsDidVerificationStatusArray = Static<typeof DnsDidVerificationStatusArray>;
/**
 * Fragments
 */
export declare type OpenAttestationDnsDidIdentityProofValidFragmentV3 = ValidVerificationFragment<ValidDnsDidVerificationStatus>;
export declare type OpenAttestationDnsDidIdentityProofInvalidFragmentV3 = InvalidVerificationFragment<InvalidDnsDidVerificationStatus>;
export declare type OpenAttestationDnsDidIdentityProofValidFragmentV2 = ValidVerificationFragment<ValidDnsDidVerificationStatusArray>;
export declare type OpenAttestationDnsDidIdentityProofInvalidFragmentV2 = InvalidVerificationFragment<DnsDidVerificationStatusArray>;
export declare type OpenAttestationDnsDidIdentityProofErrorFragment = ErrorVerificationFragment<any>;
export declare type OpenAttestationDnsDidIdentityProofVerificationFragment = OpenAttestationDnsDidIdentityProofValidFragmentV2 | OpenAttestationDnsDidIdentityProofInvalidFragmentV2 | OpenAttestationDnsDidIdentityProofValidFragmentV3 | OpenAttestationDnsDidIdentityProofInvalidFragmentV3 | OpenAttestationDnsDidIdentityProofErrorFragment | SkippedVerificationFragment;
