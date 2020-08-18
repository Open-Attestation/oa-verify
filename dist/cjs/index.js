"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAttestationEthereumTokenRegistryStatus = exports.openAttestationEthereumDocumentStoreStatus = exports.openAttestationDnsTxt = exports.openAttestationSignedProof = exports.openAttestationHash = exports.verify = exports.isValid = exports.openAttestationVerifiers = exports.verificationBuilder = void 0;
var verificationBuilder_1 = require("./verifiers/verificationBuilder");
Object.defineProperty(exports, "verificationBuilder", { enumerable: true, get: function () { return verificationBuilder_1.verificationBuilder; } });
var openAttestationHash_1 = require("./verifiers/hash/openAttestationHash");
Object.defineProperty(exports, "openAttestationHash", { enumerable: true, get: function () { return openAttestationHash_1.openAttestationHash; } });
var openAttestationDnsTxt_1 = require("./verifiers/dnsText/openAttestationDnsTxt");
Object.defineProperty(exports, "openAttestationDnsTxt", { enumerable: true, get: function () { return openAttestationDnsTxt_1.openAttestationDnsTxt; } });
var openAttestationSignedProof_1 = require("./verifiers/signedProof/openAttestationSignedProof");
Object.defineProperty(exports, "openAttestationSignedProof", { enumerable: true, get: function () { return openAttestationSignedProof_1.openAttestationSignedProof; } });
var validator_1 = require("./validator");
Object.defineProperty(exports, "isValid", { enumerable: true, get: function () { return validator_1.isValid; } });
var openAttestationEthereumTokenRegistryStatus_1 = require("./verifiers/tokenRegistryStatus/openAttestationEthereumTokenRegistryStatus");
Object.defineProperty(exports, "openAttestationEthereumTokenRegistryStatus", { enumerable: true, get: function () { return openAttestationEthereumTokenRegistryStatus_1.openAttestationEthereumTokenRegistryStatus; } });
var openAttestationEthereumDocumentStoreStatus_1 = require("./verifiers/documentStoreStatus/openAttestationEthereumDocumentStoreStatus");
Object.defineProperty(exports, "openAttestationEthereumDocumentStoreStatus", { enumerable: true, get: function () { return openAttestationEthereumDocumentStoreStatus_1.openAttestationEthereumDocumentStoreStatus; } });
var openAttestationVerifiers = [
    openAttestationHash_1.openAttestationHash,
    openAttestationSignedProof_1.openAttestationSignedProof,
    openAttestationEthereumTokenRegistryStatus_1.openAttestationEthereumTokenRegistryStatus,
    openAttestationEthereumDocumentStoreStatus_1.openAttestationEthereumDocumentStoreStatus,
    openAttestationDnsTxt_1.openAttestationDnsTxt,
];
exports.openAttestationVerifiers = openAttestationVerifiers;
var verify = verificationBuilder_1.verificationBuilder(openAttestationVerifiers);
exports.verify = verify;
__exportStar(require("./types/core"), exports);
__exportStar(require("./types/error"), exports);
