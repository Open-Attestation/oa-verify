import { Array as RunTypesArray, Literal, Optional, Record, String, Union } from "runtypes";
import { Reason } from "../../../types/error";
/**
 * DNS-TXT verification status
 */
export var ValidDnsTxtVerificationStatus = Record({
    status: Literal("VALID"),
    location: String,
    value: String,
});
export var ValidDnsTxtVerificationStatusArray = RunTypesArray(ValidDnsTxtVerificationStatus).withConstraint(function (elements) { return elements.length > 0 || "Expect at least one valid element"; });
export var InvalidDnsTxtVerificationStatus = Record({
    status: Literal("INVALID"),
    location: Optional(String),
    value: Optional(String),
    reason: Reason,
});
export var DnsTxtVerificationStatus = Union(ValidDnsTxtVerificationStatus, InvalidDnsTxtVerificationStatus);
export var DnsTxtVerificationStatusArray = RunTypesArray(DnsTxtVerificationStatus);
/**
 * Data for v3 Fragments
 */
export var ValidDnsTxtVerificationStatusDataV3 = Record({
    identifier: String,
    value: String,
});
// by design runtypes will validate arrays when an object has only partial properties
// https://github.com/pelotom/runtypes/issues/32
export var InvalidDnsTxtVerificationStatusDataV3 = ValidDnsTxtVerificationStatusDataV3.asPartial().withConstraint(function (value) { return !Array.isArray(value) || "can't be an array"; });
export var DnsTxtVerificationStatusDataV3 = Union(ValidDnsTxtVerificationStatusDataV3, InvalidDnsTxtVerificationStatusDataV3);
