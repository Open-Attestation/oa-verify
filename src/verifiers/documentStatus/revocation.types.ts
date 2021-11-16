import { Literal, Record, Static, String, Union, Array as RunTypesArray, Optional } from "runtypes";
import { Reason } from "../../types/error";

export const ValidRevocationStatus = Record({
  revoked: Literal(false),
  address: Optional(String),
});
export type ValidRevocationStatus = Static<typeof ValidRevocationStatus>;
export const ValidRevocationStatusArray = RunTypesArray(ValidRevocationStatus);
export type ValidRevocationStatusArray = Static<typeof ValidRevocationStatusArray>;

export const InvalidRevocationStatus = Record({
  revoked: Literal(true),
  address: String,
  reason: Reason,
});
export type InvalidRevocationStatus = Static<typeof InvalidRevocationStatus>;

export const RevocationStatus = Union(ValidRevocationStatus, InvalidRevocationStatus);
export type RevocationStatus = Static<typeof RevocationStatus>;
export const RevocationStatusArray = RunTypesArray(RevocationStatus);
export type RevocationStatusArray = Static<typeof RevocationStatusArray>;

export const OcspResponderRevocationStatus = Union(Literal("good"), Literal("revoked"), Literal("unknown"));
export type OcspResponderRevocationStatus = Static<typeof OcspResponderRevocationStatus>;

export enum OcspResponderRevocationReason {
  UNSPECIFIED = 0,
  KEY_COMPROMISE = 1,
  CA_COMPROMISE = 2,
  AFFILIATION_CHANGED = 3,
  SUPERSEDED = 4,
  CESSATION_OF_OPERATION = 5,
  CERTIFICATE_HOLD = 6,
  REMOVE_FROM_CRL = 8,
  PRIVILEGE_WITHDRAWN = 9,
  A_A_COMPROMISE = 10,
}
