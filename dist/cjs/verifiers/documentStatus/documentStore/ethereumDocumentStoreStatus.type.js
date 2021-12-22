"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDocumentStoreDataV3 = exports.ValidDocumentStoreDataV3 = exports.InvalidDocumentStoreDataV2 = exports.DocumentStoreIssuanceStatusArray = exports.DocumentStoreIssuanceStatus = exports.InvalidDocumentStoreIssuanceStatus = exports.ValidDocumentStoreIssuanceStatusArray = exports.ValidDocumentStoreIssuanceStatus = void 0;
var runtypes_1 = require("runtypes");
var error_1 = require("../../../types/error");
var revocation_types_1 = require("../revocation.types");
/**
 * Document store issuance status
 */
exports.ValidDocumentStoreIssuanceStatus = runtypes_1.Record({
    issued: runtypes_1.Literal(true),
    address: runtypes_1.String,
});
exports.ValidDocumentStoreIssuanceStatusArray = runtypes_1.Array(exports.ValidDocumentStoreIssuanceStatus);
exports.InvalidDocumentStoreIssuanceStatus = runtypes_1.Record({
    issued: runtypes_1.Literal(false),
    address: runtypes_1.String,
    reason: error_1.Reason,
});
exports.DocumentStoreIssuanceStatus = runtypes_1.Union(exports.ValidDocumentStoreIssuanceStatus, exports.InvalidDocumentStoreIssuanceStatus);
exports.DocumentStoreIssuanceStatusArray = runtypes_1.Array(exports.DocumentStoreIssuanceStatus);
/**
 * Data for v2 Fragments
 */
var ValidDocumentStoreDataV2 = runtypes_1.Record({
    issuedOnAll: runtypes_1.Literal(true),
    revokedOnAny: runtypes_1.Literal(false),
    details: runtypes_1.Record({
        issuance: exports.ValidDocumentStoreIssuanceStatusArray,
        revocation: revocation_types_1.ValidRevocationStatusArray,
    }),
});
exports.InvalidDocumentStoreDataV2 = runtypes_1.Record({
    issuedOnAll: runtypes_1.Boolean,
    revokedOnAny: runtypes_1.Optional(runtypes_1.Boolean),
    details: runtypes_1.Record({
        issuance: exports.DocumentStoreIssuanceStatusArray,
        revocation: runtypes_1.Optional(revocation_types_1.RevocationStatusArray),
    }),
});
/**
 * Data for v3 Fragments
 */
exports.ValidDocumentStoreDataV3 = runtypes_1.Record({
    issuedOnAll: runtypes_1.Literal(true),
    revokedOnAny: runtypes_1.Literal(false),
    details: runtypes_1.Record({
        issuance: exports.ValidDocumentStoreIssuanceStatus,
        revocation: revocation_types_1.ValidRevocationStatus,
    }),
});
exports.InvalidDocumentStoreDataV3 = runtypes_1.Record({
    issuedOnAll: runtypes_1.Boolean,
    revokedOnAny: runtypes_1.Boolean,
    details: runtypes_1.Record({
        issuance: exports.DocumentStoreIssuanceStatus,
        revocation: revocation_types_1.RevocationStatus,
    }),
});
