"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsTxtVerificationStatusDataV3 = exports.InvalidDnsTxtVerificationStatusDataV3 = exports.ValidDnsTxtVerificationStatusDataV3 = exports.DnsTxtVerificationStatusArray = exports.DnsTxtVerificationStatus = exports.InvalidDnsTxtVerificationStatus = exports.ValidDnsTxtVerificationStatusArray = exports.ValidDnsTxtVerificationStatus = void 0;
var runtypes_1 = require("runtypes");
var error_1 = require("../../../types/error");
/**
 * DNS-TXT verification status
 */
exports.ValidDnsTxtVerificationStatus = runtypes_1.Record({
    status: runtypes_1.Literal("VALID"),
    location: runtypes_1.String,
    value: runtypes_1.String,
});
exports.ValidDnsTxtVerificationStatusArray = runtypes_1.Array(exports.ValidDnsTxtVerificationStatus).withConstraint(function (elements) { return elements.length > 0 || "Expect at least one valid element"; });
exports.InvalidDnsTxtVerificationStatus = runtypes_1.Record({
    status: runtypes_1.Literal("INVALID"),
    location: runtypes_1.Optional(runtypes_1.String),
    value: runtypes_1.Optional(runtypes_1.String),
    reason: error_1.Reason,
});
exports.DnsTxtVerificationStatus = runtypes_1.Union(exports.ValidDnsTxtVerificationStatus, exports.InvalidDnsTxtVerificationStatus);
exports.DnsTxtVerificationStatusArray = runtypes_1.Array(exports.DnsTxtVerificationStatus);
/**
 * Data for v3 Fragments
 */
exports.ValidDnsTxtVerificationStatusDataV3 = runtypes_1.Record({
    identifier: runtypes_1.String,
    value: runtypes_1.String,
});
// by design runtypes will validate arrays when an object has only partial properties
// https://github.com/pelotom/runtypes/issues/32
exports.InvalidDnsTxtVerificationStatusDataV3 = exports.ValidDnsTxtVerificationStatusDataV3.asPartial().withConstraint(function (value) { return !Array.isArray(value) || "can't be an array"; });
exports.DnsTxtVerificationStatusDataV3 = runtypes_1.Union(exports.ValidDnsTxtVerificationStatusDataV3, exports.InvalidDnsTxtVerificationStatusDataV3);
