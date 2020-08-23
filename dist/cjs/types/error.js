"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAttestationHashCode = exports.OpenAttestationDnsTxtCode = exports.OpenAttestationEthereumTokenRegistryStatusCode = exports.OpenAttestationDocumentSignedCode = exports.OpenAttestationEthereumDocumentStoreStatusCode = void 0;
// NEVER EVER REPLACE OR CHANGE A VALUE :)
// code for errors and invalid fragment
var OpenAttestationEthereumDocumentStoreStatusCode;
(function (OpenAttestationEthereumDocumentStoreStatusCode) {
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["DOCUMENT_NOT_ISSUED"] = 1] = "DOCUMENT_NOT_ISSUED";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["CONTRACT_ADDRESS_INVALID"] = 2] = "CONTRACT_ADDRESS_INVALID";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["ETHERS_UNHANDLED_ERROR"] = 3] = "ETHERS_UNHANDLED_ERROR";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["SKIPPED"] = 4] = "SKIPPED";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["DOCUMENT_REVOKED"] = 5] = "DOCUMENT_REVOKED";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["CONTRACT_NOT_FOUND"] = 404] = "CONTRACT_NOT_FOUND";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["MISSING_RESPONSE"] = 429] = "MISSING_RESPONSE";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["BAD_RESPONSE"] = 502] = "BAD_RESPONSE";
})(OpenAttestationEthereumDocumentStoreStatusCode = exports.OpenAttestationEthereumDocumentStoreStatusCode || (exports.OpenAttestationEthereumDocumentStoreStatusCode = {}));
var OpenAttestationDocumentSignedCode;
(function (OpenAttestationDocumentSignedCode) {
    OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode["DOCUMENT_PROOF_INVALID"] = 1] = "DOCUMENT_PROOF_INVALID";
    OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode["DOCUMENT_PROOF_ERROR"] = 2] = "DOCUMENT_PROOF_ERROR";
    OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode["SKIPPED"] = 4] = "SKIPPED";
})(OpenAttestationDocumentSignedCode = exports.OpenAttestationDocumentSignedCode || (exports.OpenAttestationDocumentSignedCode = {}));
var OpenAttestationEthereumTokenRegistryStatusCode;
(function (OpenAttestationEthereumTokenRegistryStatusCode) {
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["DOCUMENT_NOT_MINTED"] = 1] = "DOCUMENT_NOT_MINTED";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["CONTRACT_ADDRESS_INVALID"] = 2] = "CONTRACT_ADDRESS_INVALID";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["ETHERS_UNHANDLED_ERROR"] = 3] = "ETHERS_UNHANDLED_ERROR";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["SKIPPED"] = 4] = "SKIPPED";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["CONTRACT_NOT_FOUND"] = 404] = "CONTRACT_NOT_FOUND";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["MISSING_RESPONSE"] = 429] = "MISSING_RESPONSE";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["BAD_RESPONSE"] = 502] = "BAD_RESPONSE";
})(OpenAttestationEthereumTokenRegistryStatusCode = exports.OpenAttestationEthereumTokenRegistryStatusCode || (exports.OpenAttestationEthereumTokenRegistryStatusCode = {}));
var OpenAttestationDnsTxtCode;
(function (OpenAttestationDnsTxtCode) {
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["INVALID_IDENTITY"] = 1] = "INVALID_IDENTITY";
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["SKIPPED"] = 2] = "SKIPPED";
})(OpenAttestationDnsTxtCode = exports.OpenAttestationDnsTxtCode || (exports.OpenAttestationDnsTxtCode = {}));
var OpenAttestationHashCode;
(function (OpenAttestationHashCode) {
    OpenAttestationHashCode[OpenAttestationHashCode["DOCUMENT_TAMPERED"] = 0] = "DOCUMENT_TAMPERED";
})(OpenAttestationHashCode = exports.OpenAttestationHashCode || (exports.OpenAttestationHashCode = {}));
