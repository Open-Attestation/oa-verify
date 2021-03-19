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
