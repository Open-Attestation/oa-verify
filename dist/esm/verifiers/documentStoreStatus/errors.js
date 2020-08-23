import { errors } from "ethers";
import { OpenAttestationEthereumDocumentStoreStatusCode } from "../..";
var contractNotFound = function (address) {
    return {
        code: OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_NOT_FOUND,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_NOT_FOUND],
        message: "Contract " + address + " was not found",
    };
};
var contractAddressInvalid = function (address) {
    return {
        code: OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_ADDRESS_INVALID,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_ADDRESS_INVALID],
        message: "Contract address " + address + " is invalid",
    };
};
export var contractNotIssued = function (merkleRoot, address) {
    return {
        code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED],
        message: "Document " + merkleRoot + " has not been issued under contract " + address,
    };
};
export var contractRevoked = function (merkleRoot, address) {
    return {
        code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED],
        message: "Document " + merkleRoot + " has been revoked under contract " + address,
    };
};
// This function handles Ethers "missing response" error, most likely caused by HTTP 4xx errors.
export var missingResponse = function () {
    return {
        code: OpenAttestationEthereumDocumentStoreStatusCode.MISSING_RESPONSE,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.MISSING_RESPONSE],
        message: "Unable to connect to the Ethereum network, please try again later",
    };
};
// This function handles Ethers "bad response" error, most likely caused by HTTP 5xx errors.
export var badResponse = function () {
    return {
        code: OpenAttestationEthereumDocumentStoreStatusCode.BAD_RESPONSE,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.BAD_RESPONSE],
        message: "Unable to connect to the Ethereum network, please try again later",
    };
};
export var getErrorReason = function (error, address) {
    var _a, _b, _c, _d;
    var reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : (_a = error.reason) !== null && _a !== void 0 ? _a : "";
    if (!error.reason &&
        (((_b = error.method) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "isRevoked(bytes32)".toLowerCase() ||
            ((_c = error.method) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === "isIssued(bytes32)".toLowerCase()) &&
        error.code === errors.CALL_EXCEPTION) {
        return contractNotFound(address);
    }
    else if ((reason.toLowerCase() === "ENS name not configured".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) ||
        (reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT) ||
        ((_d = error.message) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "name not found".toLowerCase() ||
        (reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT)) {
        return contractAddressInvalid(address);
    }
    else if (reason.toLowerCase() === "missing response".toLowerCase()) {
        return missingResponse();
    }
    else if (reason.toLowerCase() === "bad response".toLowerCase()) {
        return badResponse();
    }
    return {
        message: "Error with smart contract " + address + ": " + error.reason,
        code: OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR],
    };
};
