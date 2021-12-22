"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsDidVerificationStatusArray = exports.DnsDidVerificationStatus = exports.InvalidDnsDidVerificationStatus = exports.ValidDnsDidVerificationStatusArray = exports.ValidDnsDidVerificationStatus = void 0;
var runtypes_1 = require("runtypes");
/**
 * DNS-DID verification status
 */
exports.ValidDnsDidVerificationStatus = runtypes_1.Record({
    status: runtypes_1.Literal("VALID"),
    location: runtypes_1.String,
    key: runtypes_1.String,
});
exports.ValidDnsDidVerificationStatusArray = runtypes_1.Array(exports.ValidDnsDidVerificationStatus).withConstraint(function (elements) { return elements.length > 0 || "Expect at least one valid element"; });
exports.InvalidDnsDidVerificationStatus = runtypes_1.Record({
    status: runtypes_1.Literal("INVALID"),
    location: runtypes_1.String,
    key: runtypes_1.String,
});
exports.DnsDidVerificationStatus = runtypes_1.Union(exports.ValidDnsDidVerificationStatus, exports.InvalidDnsDidVerificationStatus);
exports.DnsDidVerificationStatusArray = runtypes_1.Array(exports.DnsDidVerificationStatus);
