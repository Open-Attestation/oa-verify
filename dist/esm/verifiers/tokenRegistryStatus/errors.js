import { errors } from "ethers";
import { OpenAttestationEthereumTokenRegistryStatusCode } from "../../types/error";
var contractNotFound = function (address) {
    return {
        code: OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_NOT_FOUND,
        codeString: OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_NOT_FOUND],
        message: "Contract " + address + " was not found",
    };
};
var contractAddressInvalid = function (address) {
    return {
        code: OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_ADDRESS_INVALID,
        codeString: OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_ADDRESS_INVALID],
        message: "Contract address " + address + " is invalid",
    };
};
export var contractNotMinted = function (merkleRoot, address) {
    return {
        code: OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
        codeString: OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED],
        message: "Document " + merkleRoot + " has not been issued under contract " + address,
    };
};
// This function handles Ethers "missing response" error, most likely caused by HTTP 4xx errors.
export var missingResponse = function () {
    return {
        code: OpenAttestationEthereumTokenRegistryStatusCode.MISSING_RESPONSE,
        codeString: OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.MISSING_RESPONSE],
        message: "Unable to connect to the Ethereum network, please try again later",
    };
};
// This function handles Ethers "bad response" error, most likely caused by HTTP 5xx errors.
export var badResponse = function () {
    return {
        code: OpenAttestationEthereumTokenRegistryStatusCode.BAD_RESPONSE,
        codeString: OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.BAD_RESPONSE],
        message: "Unable to connect to the Ethereum network, please try again later",
    };
};
export var getErrorReason = function (error, address, hash) {
    var _a, _b;
    var reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : (_a = error.reason) !== null && _a !== void 0 ? _a : "";
    if (reason.toLowerCase() === "ERC721: owner query for nonexistent token".toLowerCase() &&
        error.code === errors.CALL_EXCEPTION) {
        return contractNotMinted(hash, address);
    }
    else if (!error.reason &&
        ((_b = error.method) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "ownerOf(uint256)".toLowerCase() &&
        error.code === errors.CALL_EXCEPTION) {
        return contractNotFound(address);
    }
    else if ((reason.toLowerCase() === "ENS name not configured".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) ||
        (reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT) ||
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
        code: OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR,
        codeString: OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR],
    };
};
