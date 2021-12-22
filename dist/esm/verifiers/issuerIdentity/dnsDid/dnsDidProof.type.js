import { Array as RunTypesArray, Literal, Record, String, Union } from "runtypes";
/**
 * DNS-DID verification status
 */
export var ValidDnsDidVerificationStatus = Record({
    status: Literal("VALID"),
    location: String,
    key: String,
});
export var ValidDnsDidVerificationStatusArray = RunTypesArray(ValidDnsDidVerificationStatus).withConstraint(function (elements) { return elements.length > 0 || "Expect at least one valid element"; });
export var InvalidDnsDidVerificationStatus = Record({
    status: Literal("INVALID"),
    location: String,
    key: String,
});
export var DnsDidVerificationStatus = Union(ValidDnsDidVerificationStatus, InvalidDnsDidVerificationStatus);
export var DnsDidVerificationStatusArray = RunTypesArray(DnsDidVerificationStatus);
