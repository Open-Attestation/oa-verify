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
// This function handles ALL of Ethers SERVER_ERRORs, most likely caused by HTTP 4xx or 5xx errors.
export var serverError = function () {
    return {
        code: OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR],
        message: "Unable to connect to the Ethereum network, please try again later",
    };
};
// This function handles all INVALID_ARGUMENT errors likely due to invalid hex string,
// hex data is odd-length or incorrect data length
export var invalidArgument = function (error, address) {
    return {
        code: OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ARGUMENT,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ARGUMENT],
        message: "Error with smart contract " + address + ": " + error.reason,
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
    else if (error.code === errors.SERVER_ERROR) {
        return serverError();
    }
    else if (error.code === errors.INVALID_ARGUMENT) {
        return invalidArgument(error, address);
    }
    return {
        message: "Error with smart contract " + address + ": " + error.reason,
        code: OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR,
        codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR],
    };
};
