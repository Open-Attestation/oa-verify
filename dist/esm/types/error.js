// NEVER EVER REPLACE OR CHANGE A VALUE :)
// code for errors and invalid fragment
import { Number, Record, String } from "runtypes";
export var OpenAttestationEthereumDocumentStoreStatusCode;
(function (OpenAttestationEthereumDocumentStoreStatusCode) {
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["DOCUMENT_NOT_ISSUED"] = 1] = "DOCUMENT_NOT_ISSUED";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["CONTRACT_ADDRESS_INVALID"] = 2] = "CONTRACT_ADDRESS_INVALID";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["ETHERS_UNHANDLED_ERROR"] = 3] = "ETHERS_UNHANDLED_ERROR";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["SKIPPED"] = 4] = "SKIPPED";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["DOCUMENT_REVOKED"] = 5] = "DOCUMENT_REVOKED";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["INVALID_ARGUMENT"] = 6] = "INVALID_ARGUMENT";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["CONTRACT_NOT_FOUND"] = 404] = "CONTRACT_NOT_FOUND";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["INVALID_ISSUERS"] = 7] = "INVALID_ISSUERS";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["INVALID_VALIDATION_METHOD"] = 8] = "INVALID_VALIDATION_METHOD";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["UNRECOGNIZED_DOCUMENT"] = 9] = "UNRECOGNIZED_DOCUMENT";
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(OpenAttestationEthereumDocumentStoreStatusCode || (OpenAttestationEthereumDocumentStoreStatusCode = {}));
export var OpenAttestationDocumentSignedCode;
(function (OpenAttestationDocumentSignedCode) {
    OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode["DOCUMENT_PROOF_INVALID"] = 1] = "DOCUMENT_PROOF_INVALID";
    OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode["DOCUMENT_PROOF_ERROR"] = 2] = "DOCUMENT_PROOF_ERROR";
    OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode["SKIPPED"] = 4] = "SKIPPED";
})(OpenAttestationDocumentSignedCode || (OpenAttestationDocumentSignedCode = {}));
export var OpenAttestationEthereumTokenRegistryStatusCode;
(function (OpenAttestationEthereumTokenRegistryStatusCode) {
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["DOCUMENT_NOT_MINTED"] = 1] = "DOCUMENT_NOT_MINTED";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["CONTRACT_ADDRESS_INVALID"] = 2] = "CONTRACT_ADDRESS_INVALID";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["ETHERS_UNHANDLED_ERROR"] = 3] = "ETHERS_UNHANDLED_ERROR";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["SKIPPED"] = 4] = "SKIPPED";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["INVALID_ISSUERS"] = 5] = "INVALID_ISSUERS";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["INVALID_ARGUMENT"] = 6] = "INVALID_ARGUMENT";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["UNDEFINED_TOKEN_REGISTRY"] = 7] = "UNDEFINED_TOKEN_REGISTRY";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["INVALID_VALIDATION_METHOD"] = 8] = "INVALID_VALIDATION_METHOD";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["UNRECOGNIZED_DOCUMENT"] = 9] = "UNRECOGNIZED_DOCUMENT";
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(OpenAttestationEthereumTokenRegistryStatusCode || (OpenAttestationEthereumTokenRegistryStatusCode = {}));
export var OpenAttestationDnsTxtCode;
(function (OpenAttestationDnsTxtCode) {
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["INVALID_IDENTITY"] = 1] = "INVALID_IDENTITY";
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["SKIPPED"] = 2] = "SKIPPED";
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["INVALID_ISSUERS"] = 3] = "INVALID_ISSUERS";
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["MATCHING_RECORD_NOT_FOUND"] = 4] = "MATCHING_RECORD_NOT_FOUND";
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["UNRECOGNIZED_DOCUMENT"] = 5] = "UNRECOGNIZED_DOCUMENT";
    OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode["UNSUPPORTED"] = 6] = "UNSUPPORTED";
})(OpenAttestationDnsTxtCode || (OpenAttestationDnsTxtCode = {}));
export var OpenAttestationHashCode;
(function (OpenAttestationHashCode) {
    OpenAttestationHashCode[OpenAttestationHashCode["DOCUMENT_TAMPERED"] = 0] = "DOCUMENT_TAMPERED";
    OpenAttestationHashCode[OpenAttestationHashCode["UNEXPECTED_ERROR"] = 1] = "UNEXPECTED_ERROR";
    OpenAttestationHashCode[OpenAttestationHashCode["SKIPPED"] = 2] = "SKIPPED";
})(OpenAttestationHashCode || (OpenAttestationHashCode = {}));
export var OpenAttestationDidSignedDocumentStatusCode;
(function (OpenAttestationDidSignedDocumentStatusCode) {
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["SKIPPED"] = 0] = "SKIPPED";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["UNEXPECTED_ERROR"] = 1] = "UNEXPECTED_ERROR";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["MISSING_REVOCATION"] = 2] = "MISSING_REVOCATION";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["UNSIGNED"] = 3] = "UNSIGNED";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["INVALID_ISSUERS"] = 4] = "INVALID_ISSUERS";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["MALFORMED_IDENTITY_PROOF"] = 5] = "MALFORMED_IDENTITY_PROOF";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["CORRESPONDING_PROOF_MISSING"] = 6] = "CORRESPONDING_PROOF_MISSING";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["DID_MISSING"] = 7] = "DID_MISSING";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["UNRECOGNIZED_DOCUMENT"] = 8] = "UNRECOGNIZED_DOCUMENT";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["UNRECOGNIZED_REVOCATION_TYPE"] = 9] = "UNRECOGNIZED_REVOCATION_TYPE";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["REVOCATION_LOCATION_MISSING"] = 10] = "REVOCATION_LOCATION_MISSING";
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode["OCSP_RESPONSE_INVALID"] = 11] = "OCSP_RESPONSE_INVALID";
})(OpenAttestationDidSignedDocumentStatusCode || (OpenAttestationDidSignedDocumentStatusCode = {}));
export var OpenAttestationDidCode;
(function (OpenAttestationDidCode) {
    OpenAttestationDidCode[OpenAttestationDidCode["SKIPPED"] = 0] = "SKIPPED";
    OpenAttestationDidCode[OpenAttestationDidCode["UNEXPECTED_ERROR"] = 1] = "UNEXPECTED_ERROR";
    OpenAttestationDidCode[OpenAttestationDidCode["INVALID_ISSUERS"] = 2] = "INVALID_ISSUERS";
    OpenAttestationDidCode[OpenAttestationDidCode["MALFORMED_IDENTITY_PROOF"] = 3] = "MALFORMED_IDENTITY_PROOF";
    OpenAttestationDidCode[OpenAttestationDidCode["DID_MISSING"] = 4] = "DID_MISSING";
    OpenAttestationDidCode[OpenAttestationDidCode["UNSIGNED"] = 5] = "UNSIGNED";
    OpenAttestationDidCode[OpenAttestationDidCode["UNRECOGNIZED_DOCUMENT"] = 6] = "UNRECOGNIZED_DOCUMENT";
})(OpenAttestationDidCode || (OpenAttestationDidCode = {}));
export var OpenAttestationDnsDidCode;
(function (OpenAttestationDnsDidCode) {
    OpenAttestationDnsDidCode[OpenAttestationDnsDidCode["SKIPPED"] = 0] = "SKIPPED";
    OpenAttestationDnsDidCode[OpenAttestationDnsDidCode["UNEXPECTED_ERROR"] = 1] = "UNEXPECTED_ERROR";
    OpenAttestationDnsDidCode[OpenAttestationDnsDidCode["MALFORMED_IDENTITY_PROOF"] = 2] = "MALFORMED_IDENTITY_PROOF";
    OpenAttestationDnsDidCode[OpenAttestationDnsDidCode["INVALID_ISSUERS"] = 3] = "INVALID_ISSUERS";
    OpenAttestationDnsDidCode[OpenAttestationDnsDidCode["UNSIGNED"] = 4] = "UNSIGNED";
    OpenAttestationDnsDidCode[OpenAttestationDnsDidCode["UNRECOGNIZED_DOCUMENT"] = 5] = "UNRECOGNIZED_DOCUMENT";
    OpenAttestationDnsDidCode[OpenAttestationDnsDidCode["INVALID_IDENTITY"] = 6] = "INVALID_IDENTITY";
})(OpenAttestationDnsDidCode || (OpenAttestationDnsDidCode = {}));
export var OpenAttestationSignatureCode;
(function (OpenAttestationSignatureCode) {
    OpenAttestationSignatureCode[OpenAttestationSignatureCode["UNEXPECTED_ERROR"] = 0] = "UNEXPECTED_ERROR";
    OpenAttestationSignatureCode[OpenAttestationSignatureCode["KEY_MISSING"] = 1] = "KEY_MISSING";
    OpenAttestationSignatureCode[OpenAttestationSignatureCode["DID_MISSING"] = 3] = "DID_MISSING";
    OpenAttestationSignatureCode[OpenAttestationSignatureCode["KEY_NOT_IN_DID"] = 4] = "KEY_NOT_IN_DID";
    OpenAttestationSignatureCode[OpenAttestationSignatureCode["UNSUPPORTED_KEY_TYPE"] = 6] = "UNSUPPORTED_KEY_TYPE";
    OpenAttestationSignatureCode[OpenAttestationSignatureCode["WRONG_SIGNATURE"] = 7] = "WRONG_SIGNATURE";
})(OpenAttestationSignatureCode || (OpenAttestationSignatureCode = {}));
export var Reason = Record({
    code: Number,
    codeString: String,
    message: String,
});
