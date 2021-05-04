import { Array as RunTypesArray, Literal, Record, Static, String, Union } from "runtypes";
import {
  ErrorVerificationFragment,
  InvalidVerificationFragment,
  SkippedVerificationFragment,
  ValidVerificationFragment,
} from "../../../types/core";

/**
 * DNS-DID verification status
 */
export const ValidDnsDidVerificationStatus = Record({
  status: Literal("VALID"),
  location: String,
  key: String,
});
export type ValidDnsDidVerificationStatus = Static<typeof ValidDnsDidVerificationStatus>;
export const ValidDnsDidVerificationStatusArray = RunTypesArray(ValidDnsDidVerificationStatus).withConstraint(
  (elements) => elements.length > 0 || "Expect at least one valid element"
);
export type ValidDnsDidVerificationStatusArray = Static<typeof ValidDnsDidVerificationStatusArray>;

export const InvalidDnsDidVerificationStatus = Record({
  status: Literal("INVALID"),
  location: String,
  key: String,
});
export type InvalidDnsDidVerificationStatus = Static<typeof InvalidDnsDidVerificationStatus>;

export const DnsDidVerificationStatus = Union(ValidDnsDidVerificationStatus, InvalidDnsDidVerificationStatus);
export type DnsDidVerificationStatus = Static<typeof DnsDidVerificationStatus>;
export const DnsDidVerificationStatusArray = RunTypesArray(DnsDidVerificationStatus);
export type DnsDidVerificationStatusArray = Static<typeof DnsDidVerificationStatusArray>;

/**
 * Fragments
 */
export type OpenAttestationDnsDidIdentityProofValidFragmentV3 = ValidVerificationFragment<ValidDnsDidVerificationStatus>;
export type OpenAttestationDnsDidIdentityProofInvalidFragmentV3 = InvalidVerificationFragment<InvalidDnsDidVerificationStatus>;
export type OpenAttestationDnsDidIdentityProofValidFragmentV2 = ValidVerificationFragment<ValidDnsDidVerificationStatusArray>;
export type OpenAttestationDnsDidIdentityProofInvalidFragmentV2 = InvalidVerificationFragment<DnsDidVerificationStatusArray>;
export type OpenAttestationDnsDidIdentityProofErrorFragment = ErrorVerificationFragment<any>;
export type OpenAttestationDnsDidIdentityProofVerificationFragment =
  | OpenAttestationDnsDidIdentityProofValidFragmentV2
  | OpenAttestationDnsDidIdentityProofInvalidFragmentV2
  | OpenAttestationDnsDidIdentityProofValidFragmentV3
  | OpenAttestationDnsDidIdentityProofInvalidFragmentV3
  | OpenAttestationDnsDidIdentityProofErrorFragment
  | SkippedVerificationFragment;
