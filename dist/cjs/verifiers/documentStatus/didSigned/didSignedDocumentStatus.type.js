"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDidSignedDataV3 = exports.ValidDidSignedDataV3 = exports.InvalidDidSignedDataV2 = exports.ValidDidSignedDataV2 = exports.ValidOcspResponseRevoked = exports.ValidOcspResponse = exports.ValidOcspReasonCode = exports.DidSignedIssuanceStatusArray = exports.DidSignedIssuanceStatus = exports.InvalidDidSignedIssuanceStatus = exports.ValidDidSignedIssuanceStatusArray = exports.ValidDidSignedIssuanceStatus = void 0;
var runtypes_1 = require("runtypes");
var error_1 = require("../../../types/error");
var revocation_types_1 = require("../revocation.types");
/**
 * DID signed issuance status
 */
exports.ValidDidSignedIssuanceStatus = runtypes_1.Record({
    did: runtypes_1.String,
    issued: runtypes_1.Literal(true),
});
exports.ValidDidSignedIssuanceStatusArray = runtypes_1.Array(exports.ValidDidSignedIssuanceStatus);
exports.InvalidDidSignedIssuanceStatus = runtypes_1.Record({
    did: runtypes_1.String,
    issued: runtypes_1.Literal(false),
    reason: error_1.Reason,
});
exports.DidSignedIssuanceStatus = runtypes_1.Union(exports.ValidDidSignedIssuanceStatus, exports.InvalidDidSignedIssuanceStatus);
exports.DidSignedIssuanceStatusArray = runtypes_1.Array(exports.DidSignedIssuanceStatus);
/**
 * OCSP response
 */
exports.ValidOcspReasonCode = runtypes_1.Number.withConstraint(function (n) { return n >= 0 && n <= 10 && n != 7; });
exports.ValidOcspResponse = runtypes_1.Record({
    certificateStatus: revocation_types_1.OcspResponderRevocationStatus,
});
exports.ValidOcspResponseRevoked = runtypes_1.Record({
    reasonCode: exports.ValidOcspReasonCode,
    certificateStatus: revocation_types_1.OcspResponderRevocationStatus,
});
/**
 * Data for v2 Fragments
 */
exports.ValidDidSignedDataV2 = runtypes_1.Record({
    issuedOnAll: runtypes_1.Literal(true),
    revokedOnAny: runtypes_1.Literal(false),
    details: runtypes_1.Record({
        issuance: exports.ValidDidSignedIssuanceStatusArray,
        revocation: revocation_types_1.ValidRevocationStatusArray,
    }),
});
exports.InvalidDidSignedDataV2 = runtypes_1.Record({
    issuedOnAll: runtypes_1.Boolean,
    revokedOnAny: runtypes_1.Boolean,
    details: runtypes_1.Record({
        issuance: exports.DidSignedIssuanceStatusArray,
        revocation: revocation_types_1.RevocationStatusArray,
    }),
});
/**
 * Data for v3 Fragments
 */
exports.ValidDidSignedDataV3 = runtypes_1.Record({
    issuedOnAll: runtypes_1.Literal(true),
    revokedOnAny: runtypes_1.Literal(false),
    details: runtypes_1.Record({
        issuance: exports.ValidDidSignedIssuanceStatus,
        revocation: revocation_types_1.ValidRevocationStatus,
    }),
});
exports.InvalidDidSignedDataV3 = runtypes_1.Record({
    issuedOnAll: runtypes_1.Boolean,
    revokedOnAny: runtypes_1.Boolean,
    details: runtypes_1.Record({
        issuance: exports.DidSignedIssuanceStatus,
        revocation: revocation_types_1.RevocationStatus,
    }),
});
