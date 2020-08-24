"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorReason = exports.invalidArgument = exports.serverError = exports.contractRevoked = exports.contractNotIssued = void 0;
var ethers_1 = require("ethers");
var __1 = require("../..");
var contractNotFound = function (address) {
    return {
        code: __1.OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_NOT_FOUND,
        codeString: __1.OpenAttestationEthereumDocumentStoreStatusCode[__1.OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_NOT_FOUND],
        message: "Contract " + address + " was not found",
    };
};
var contractAddressInvalid = function (address) {
    return {
        code: __1.OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_ADDRESS_INVALID,
        codeString: __1.OpenAttestationEthereumDocumentStoreStatusCode[__1.OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_ADDRESS_INVALID],
        message: "Contract address " + address + " is invalid",
    };
};
exports.contractNotIssued = function (merkleRoot, address) {
    return {
        code: __1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED,
        codeString: __1.OpenAttestationEthereumDocumentStoreStatusCode[__1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED],
        message: "Document " + merkleRoot + " has not been issued under contract " + address,
    };
};
exports.contractRevoked = function (merkleRoot, address) {
    return {
        code: __1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED,
        codeString: __1.OpenAttestationEthereumDocumentStoreStatusCode[__1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED],
        message: "Document " + merkleRoot + " has been revoked under contract " + address,
    };
};
// This function handles ALL of Ethers SERVER_ERRORs, most likely caused by HTTP 4xx or 5xx errors.
exports.serverError = function () {
    return {
        code: __1.OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR,
        codeString: __1.OpenAttestationEthereumDocumentStoreStatusCode[__1.OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR],
        message: "Unable to connect to the Ethereum network, please try again later",
    };
};
// This function handles all INVALID_ARGUMENT errors likely due to invalid hex string,
// hex data is odd-length or incorrect data length
exports.invalidArgument = function () {
    return {
        code: __1.OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ARGUMENT,
        codeString: __1.OpenAttestationEthereumDocumentStoreStatusCode[__1.OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ARGUMENT],
        message: "Document has been tampered with",
    };
};
exports.getErrorReason = function (error, address) {
    var _a, _b, _c, _d;
    var reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : (_a = error.reason) !== null && _a !== void 0 ? _a : "";
    if (!error.reason &&
        (((_b = error.method) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "isRevoked(bytes32)".toLowerCase() ||
            ((_c = error.method) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === "isIssued(bytes32)".toLowerCase()) &&
        error.code === ethers_1.errors.CALL_EXCEPTION) {
        return contractNotFound(address);
    }
    else if ((reason.toLowerCase() === "ENS name not configured".toLowerCase() && error.code === ethers_1.errors.UNSUPPORTED_OPERATION) ||
        (reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === ethers_1.errors.INVALID_ARGUMENT) ||
        ((_d = error.message) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "name not found".toLowerCase() ||
        (reason.toLowerCase() === "invalid address".toLowerCase() && error.code === ethers_1.errors.INVALID_ARGUMENT)) {
        return contractAddressInvalid(address);
    }
    else if (error.code === ethers_1.errors.SERVER_ERROR) {
        return exports.serverError();
    }
    else if (error.code === ethers_1.errors.INVALID_ARGUMENT) {
        return exports.invalidArgument();
    }
    return {
        message: "Error with smart contract " + address + ": " + error.reason,
        code: __1.OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR,
        codeString: __1.OpenAttestationEthereumDocumentStoreStatusCode[__1.OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR],
    };
};
