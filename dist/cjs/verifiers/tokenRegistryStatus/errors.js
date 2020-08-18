"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorReason = exports.contractNotMinted = void 0;
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
    return {
        message: "Error with smart contract " + address + ": " + error.reason,
        code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR,
        codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR],
    };
};
