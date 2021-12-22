"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenRegistryDataV3 = exports.ValidTokenRegistryDataV3 = exports.InvalidTokenRegistryDataV2 = exports.ValidTokenRegistryDataV2 = exports.InvalidTokenRegistryStatus = exports.ValidTokenRegistryStatus = void 0;
var runtypes_1 = require("runtypes");
var error_1 = require("../../../types/error");
/**
 * Token registry mint status
 */
exports.ValidTokenRegistryStatus = runtypes_1.Record({
    minted: runtypes_1.Literal(true),
    address: runtypes_1.String,
});
exports.InvalidTokenRegistryStatus = runtypes_1.Record({
    minted: runtypes_1.Literal(false),
    address: runtypes_1.String,
    reason: error_1.Reason,
});
/**
 * Data for v2 Fragments
 */
exports.ValidTokenRegistryDataV2 = runtypes_1.Record({
    mintedOnAll: runtypes_1.Literal(true),
    details: runtypes_1.Array(exports.ValidTokenRegistryStatus),
});
exports.InvalidTokenRegistryDataV2 = runtypes_1.Record({
    mintedOnAll: runtypes_1.Literal(false),
    details: runtypes_1.Array(runtypes_1.Union(exports.ValidTokenRegistryStatus, exports.InvalidTokenRegistryStatus)),
});
/**
 * Data for v3 Fragments
 */
exports.ValidTokenRegistryDataV3 = runtypes_1.Record({
    mintedOnAll: runtypes_1.Literal(true),
    details: exports.ValidTokenRegistryStatus,
});
exports.InvalidTokenRegistryDataV3 = runtypes_1.Record({
    mintedOnAll: runtypes_1.Literal(false),
    details: exports.InvalidTokenRegistryStatus,
});
