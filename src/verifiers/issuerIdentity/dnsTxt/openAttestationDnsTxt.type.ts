import { Array as RunTypesArray, Literal, Optional, Record, Static, String, Union } from "runtypes";
import {
  ErrorVerificationFragment,
  InvalidVerificationFragment,
  SkippedVerificationFragment,
  ValidVerificationFragment,
} from "../../../types/core";
import { Reason } from "../../../types/error";

/**
 * DNS-TXT verification status
 */
export const ValidDnsTxtVerificationStatus = Record({
  status: Literal("VALID"),
  location: String,
  value: String,
});
export type ValidDnsTxtVerificationStatus = Static<typeof ValidDnsTxtVerificationStatus>;
export const ValidDnsTxtVerificationStatusArray = RunTypesArray(ValidDnsTxtVerificationStatus).withConstraint(
  (elements) => elements.length > 0 || "Expect at least one valid element"
);
export type ValidDnsTxtVerificationStatusArray = Static<typeof ValidDnsTxtVerificationStatusArray>;

export const InvalidDnsTxtVerificationStatus = Record({
  status: Literal("INVALID"),
  location: Optional(String),
  value: Optional(String),
  reason: Reason,
});
export type InvalidDnsTxtVerificationStatus = Static<typeof InvalidDnsTxtVerificationStatus>;

export const DnsTxtVerificationStatus = Union(ValidDnsTxtVerificationStatus, InvalidDnsTxtVerificationStatus);
export type DnsTxtVerificationStatus = Static<typeof DnsTxtVerificationStatus>;
export const DnsTxtVerificationStatusArray = RunTypesArray(DnsTxtVerificationStatus);
export type DnsTxtVerificationStatusArray = Static<typeof DnsTxtVerificationStatusArray>;

/**
 * Data for v3 Fragments
 */
export const ValidDnsTxtVerificationStatusDataV3 = Record({
  identifier: String,
  value: String,
});
export type ValidDnsTxtVerificationStatusDataV3 = Static<typeof ValidDnsTxtVerificationStatusDataV3>;

// by design runtypes will validate arrays when an object has only partial properties
// https://github.com/pelotom/runtypes/issues/32
export const InvalidDnsTxtVerificationStatusDataV3 = ValidDnsTxtVerificationStatusDataV3.asPartial().withConstraint(
  (value) => !Array.isArray(value) || "can't be an array"
);
export type InvalidDnsTxtVerificationStatusDataV3 = Static<typeof InvalidDnsTxtVerificationStatusDataV3>;
export const DnsTxtVerificationStatusDataV3 = Union(
  ValidDnsTxtVerificationStatusDataV3,
  InvalidDnsTxtVerificationStatusDataV3
);
export type DnsTxtVerificationStatusDataV3 = Static<typeof DnsTxtVerificationStatusDataV3>;

/**
 * Fragments
 */
export type OpenAttestationDnsTxtIdentityProofValidFragmentV2 = ValidVerificationFragment<ValidDnsTxtVerificationStatusArray>;
export type OpenAttestationDnsTxtIdentityProofInvalidFragmentV2 = InvalidVerificationFragment<DnsTxtVerificationStatusArray>;
export type OpenAttestationDnsTxtIdentityProofValidFragmentV3 = ValidVerificationFragment<ValidDnsTxtVerificationStatusDataV3>;
export type OpenAttestationDnsTxtIdentityProofInvalidFragmentV3 = InvalidVerificationFragment<InvalidDnsTxtVerificationStatusDataV3>;
export type OpenAttestationDnsTxtIdentityProofVerificationFragment =
  | OpenAttestationDnsTxtIdentityProofValidFragmentV2
  | OpenAttestationDnsTxtIdentityProofInvalidFragmentV2
  | OpenAttestationDnsTxtIdentityProofValidFragmentV3
  | OpenAttestationDnsTxtIdentityProofInvalidFragmentV3
  | ErrorVerificationFragment<any>
  | SkippedVerificationFragment;
