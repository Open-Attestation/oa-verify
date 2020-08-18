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
    return {
        message: "Error with smart contract " + address + ": " + error.reason,
        code: OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR,
        codeString: OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR],
    };
};
