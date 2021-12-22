"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.getIdentifier = exports.createResolver = exports.openAttestationDidIdentityProof = exports.openAttestationDnsDidIdentityProof = exports.openAttestationDnsTxtIdentityProof = exports.openAttestationDidSignedDocumentStatus = exports.openAttestationEthereumTokenRegistryStatus = exports.openAttestationEthereumDocumentStoreStatus = exports.openAttestationHash = exports.verify = exports.isValid = exports.openAttestationVerifiers = exports.verificationBuilder = void 0;
var verificationBuilder_1 = require("./verifiers/verificationBuilder");
Object.defineProperty(exports, "verificationBuilder", { enumerable: true, get: function () { return verificationBuilder_1.verificationBuilder; } });
var openAttestationHash_1 = require("./verifiers/documentIntegrity/hash/openAttestationHash");
Object.defineProperty(exports, "openAttestationHash", { enumerable: true, get: function () { return openAttestationHash_1.openAttestationHash; } });
var validator_1 = require("./validator");
Object.defineProperty(exports, "isValid", { enumerable: true, get: function () { return validator_1.isValid; } });
var tokenRegistry_1 = require("./verifiers/documentStatus/tokenRegistry");
Object.defineProperty(exports, "openAttestationEthereumTokenRegistryStatus", { enumerable: true, get: function () { return tokenRegistry_1.openAttestationEthereumTokenRegistryStatus; } });
var documentStore_1 = require("./verifiers/documentStatus/documentStore");
Object.defineProperty(exports, "openAttestationEthereumDocumentStoreStatus", { enumerable: true, get: function () { return documentStore_1.openAttestationEthereumDocumentStoreStatus; } });
var didSigned_1 = require("./verifiers/documentStatus/didSigned");
Object.defineProperty(exports, "openAttestationDidSignedDocumentStatus", { enumerable: true, get: function () { return didSigned_1.openAttestationDidSignedDocumentStatus; } });
var dnsTxt_1 = require("./verifiers/issuerIdentity/dnsTxt");
Object.defineProperty(exports, "openAttestationDnsTxtIdentityProof", { enumerable: true, get: function () { return dnsTxt_1.openAttestationDnsTxtIdentityProof; } });
var did_1 = require("./verifiers/issuerIdentity/did");
Object.defineProperty(exports, "openAttestationDidIdentityProof", { enumerable: true, get: function () { return did_1.openAttestationDidIdentityProof; } });
var dnsDid_1 = require("./verifiers/issuerIdentity/dnsDid");
Object.defineProperty(exports, "openAttestationDnsDidIdentityProof", { enumerable: true, get: function () { return dnsDid_1.openAttestationDnsDidIdentityProof; } });
var resolver_1 = require("./did/resolver");
Object.defineProperty(exports, "createResolver", { enumerable: true, get: function () { return resolver_1.createResolver; } });
var getIdentifier_1 = require("./getIdentifier");
Object.defineProperty(exports, "getIdentifier", { enumerable: true, get: function () { return getIdentifier_1.getIdentifier; } });
var utils = __importStar(require("./common/utils"));
exports.utils = utils;
var util_1 = __importDefault(require("util"));
// eslint-disable-next-line @typescript-eslint/no-empty-function
util_1.default.deprecate(function infuraApiKey() { }, "'INFURA_API_KEY' has been deprecated, please use 'PROVIDER_API_KEY'.");
var openAttestationVerifiers = [
    openAttestationHash_1.openAttestationHash,
    tokenRegistry_1.openAttestationEthereumTokenRegistryStatus,
    documentStore_1.openAttestationEthereumDocumentStoreStatus,
    didSigned_1.openAttestationDidSignedDocumentStatus,
    dnsTxt_1.openAttestationDnsTxtIdentityProof,
    dnsDid_1.openAttestationDnsDidIdentityProof,
];
exports.openAttestationVerifiers = openAttestationVerifiers;
var defaultBuilderOption = {
    network: process.env.PROVIDER_NETWORK || "homestead",
};
var verify = verificationBuilder_1.verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
exports.verify = verify;
__exportStar(require("./types/core"), exports);
__exportStar(require("./verifiers/documentIntegrity/hash/openAttestationHash.type"), exports);
__exportStar(require("./verifiers/documentStatus/didSigned/didSignedDocumentStatus.type"), exports);
__exportStar(require("./verifiers/documentStatus/documentStore/ethereumDocumentStoreStatus.type"), exports);
__exportStar(require("./verifiers/documentStatus/tokenRegistry/ethereumTokenRegistryStatus.type"), exports);
__exportStar(require("./verifiers/issuerIdentity/did/didIdentityProof.type"), exports);
__exportStar(require("./verifiers/issuerIdentity/dnsDid/dnsDidProof.type"), exports);
__exportStar(require("./verifiers/issuerIdentity/dnsTxt/openAttestationDnsTxt.type"), exports);
__exportStar(require("./types/error"), exports);
__exportStar(require("./common/error"), exports);
