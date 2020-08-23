"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorReason = exports.badResponse = exports.missingResponse = exports.contractNotMinted = void 0;
var ethers_1 = require("ethers");
var error_1 = require("../../types/error");
var contractNotFound = function (address) {
    return {
        code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_NOT_FOUND,
        codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_NOT_FOUND],
        message: "Contract " + address + " was not found",
    };
};
var contractAddressInvalid = function (address) {
    return {
        code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_ADDRESS_INVALID,
        codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_ADDRESS_INVALID],
        message: "Contract address " + address + " is invalid",
    };
};
exports.contractNotMinted = function (merkleRoot, address) {
    return {
        code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
        codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED],
        message: "Document " + merkleRoot + " has not been issued under contract " + address,
    };
};
// This function handles Ethers "missing response" error, most likely caused by HTTP 4xx errors.
exports.missingResponse = function () {
    return {
        code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.MISSING_RESPONSE,
        codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.MISSING_RESPONSE],
        message: "Unable to connect to the Ethereum network, please try again later",
    };
};
// This function handles Ethers "bad response" error, most likely caused by HTTP 5xx errors.
exports.badResponse = function () {
    return {
        code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.BAD_RESPONSE,
        codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.BAD_RESPONSE],
        message: "Unable to connect to the Ethereum network, please try again later",
    };
};
exports.getErrorReason = function (error, address, hash) {
    var _a, _b;
    var reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : (_a = error.reason) !== null && _a !== void 0 ? _a : "";
    if (reason.toLowerCase() === "ERC721: owner query for nonexistent token".toLowerCase() &&
        error.code === ethers_1.errors.CALL_EXCEPTION) {
        return exports.contractNotMinted(hash, address);
    }
    else if (!error.reason &&
        ((_b = error.method) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "ownerOf(uint256)".toLowerCase() &&
        error.code === ethers_1.errors.CALL_EXCEPTION) {
        return contractNotFound(address);
    }
    else if ((reason.toLowerCase() === "ENS name not configured".toLowerCase() && error.code === ethers_1.errors.UNSUPPORTED_OPERATION) ||
        (reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === ethers_1.errors.INVALID_ARGUMENT) ||
        (reason.toLowerCase() === "invalid address".toLowerCase() && error.code === ethers_1.errors.INVALID_ARGUMENT)) {
        return contractAddressInvalid(address);
    }
    else if (reason.toLowerCase() === "missing response".toLowerCase()) {
        return exports.missingResponse();
    }
    else if (reason.toLowerCase() === "bad response".toLowerCase()) {
        return exports.badResponse();
    }
    return {
        message: "Error with smart contract " + address + ": " + error.reason,
        code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR,
        codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR],
    };
};
