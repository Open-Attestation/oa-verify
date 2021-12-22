"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAttestationEthereumTokenRegistryStatus = exports.isTokenMintedOnRegistry = exports.getTokenRegistry = void 0;
var open_attestation_1 = require("@govtechsg/open-attestation");
var token_registry_1 = require("@govtechsg/token-registry");
var ethers_1 = require("ethers");
var error_1 = require("../../../types/error");
var error_2 = require("../../../common/error");
var errorHandler_1 = require("../../../common/errorHandler");
var ethereumTokenRegistryStatus_type_1 = require("./ethereumTokenRegistryStatus.type");
var name = "OpenAttestationEthereumTokenRegistryStatus";
var type = "DOCUMENT_STATUS";
var getTokenRegistry = function (document) {
    if (open_attestation_1.utils.isWrappedV2Document(document)) {
        var issuers = open_attestation_1.getData(document).issuers;
        if (issuers.length !== 1)
            throw new error_2.CodedError("Only one issuer is allowed for tokens", error_1.OpenAttestationEthereumTokenRegistryStatusCode.INVALID_ISSUERS, error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.INVALID_ISSUERS]);
        if (!issuers[0].tokenRegistry)
            throw new error_2.CodedError("Token registry is undefined", error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY, error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY]);
        return issuers[0].tokenRegistry;
    }
    if (open_attestation_1.utils.isWrappedV3Document(document)) {
        if (!document.openAttestationMetadata.proof.value)
            throw new error_2.CodedError("Token registry is undefined", error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY, error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY]);
        return document.openAttestationMetadata.proof.value;
    }
    throw new error_2.CodedError("Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.", error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT, error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT]);
};
exports.getTokenRegistry = getTokenRegistry;
var getMerkleRoot = function (document) {
    if (open_attestation_1.utils.isWrappedV2Document(document))
        return "0x" + document.signature.merkleRoot;
    else if (open_attestation_1.utils.isWrappedV3Document(document))
        return "0x" + document.proof.merkleRoot;
    throw new error_2.CodedError("Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.", error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT, error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT]);
};
var isNonExistentToken = function (error) {
    var message = error.message;
    if (!message)
        return false;
    return message.includes("owner query for nonexistent token");
};
var isMissingTokenRegistry = function (error) {
    var _a;
    return (!error.reason &&
        ((_a = error.method) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "ownerOf(uint256)".toLowerCase() &&
        error.code === ethers_1.errors.CALL_EXCEPTION);
};
var decodeError = function (error) {
    var _a;
    var reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : (_a = error.reason) !== null && _a !== void 0 ? _a : "";
    switch (true) {
        case isNonExistentToken(error):
            return "Document has not been issued under token registry";
        case isMissingTokenRegistry(error):
            return "Token registry is not found";
        case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
            error.code === ethers_1.errors.UNSUPPORTED_OPERATION:
            return "ENS name is not configured";
        case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === ethers_1.errors.INVALID_ARGUMENT:
            return "Invalid token registry address";
        case error.code === ethers_1.errors.INVALID_ARGUMENT:
            return "Invalid contract arguments";
        case error.code === ethers_1.errors.SERVER_ERROR:
            throw new error_2.CodedError("Unable to connect to the Ethereum network, please try again later", error_1.OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR, error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR]);
        default:
            throw error;
    }
};
var isTokenMintedOnRegistry = function (_a) {
    var tokenRegistry = _a.tokenRegistry, merkleRoot = _a.merkleRoot, provider = _a.provider;
    return __awaiter(void 0, void 0, void 0, function () {
        var tokenRegistryContract, minted, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, token_registry_1.TradeTrustErc721Factory.connect(tokenRegistry, provider)];
                case 1:
                    tokenRegistryContract = _b.sent();
                    return [4 /*yield*/, tokenRegistryContract.ownerOf(merkleRoot).then(function (owner) { return !(owner === ethers_1.constants.AddressZero); })];
                case 2:
                    minted = _b.sent();
                    return [2 /*return*/, minted
                            ? { minted: minted, address: tokenRegistry }
                            : {
                                minted: minted,
                                address: tokenRegistry,
                                reason: {
                                    code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
                                    codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED],
                                    message: "Document " + merkleRoot + " has not been issued under contract " + tokenRegistry,
                                },
                            }];
                case 3:
                    error_3 = _b.sent();
                    return [2 /*return*/, {
                            minted: false,
                            address: tokenRegistry,
                            reason: {
                                message: decodeError(error_3),
                                code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
                                codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED],
                            },
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.isTokenMintedOnRegistry = isTokenMintedOnRegistry;
var skip = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                status: "SKIPPED",
                type: type,
                name: name,
                reason: {
                    code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.SKIPPED,
                    codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.SKIPPED],
                    message: "Document issuers doesn't have \"tokenRegistry\" property or " + open_attestation_1.v3.Method.TokenRegistry + " method",
                },
            }];
    });
}); };
var test = function (document) {
    if (open_attestation_1.utils.isWrappedV2Document(document)) {
        var documentData = open_attestation_1.getData(document);
        return documentData.issuers.some(function (issuer) { return "tokenRegistry" in issuer; });
    }
    else if (open_attestation_1.utils.isWrappedV3Document(document)) {
        return document.openAttestationMetadata.proof.method === open_attestation_1.v3.Method.TokenRegistry;
    }
    return false;
};
// TODO split
var verify = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenRegistry, merkleRoot, mintStatus, fragment, fragment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!open_attestation_1.utils.isWrappedV3Document(document) && !open_attestation_1.utils.isWrappedV2Document(document))
                    throw new error_2.CodedError("Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.", error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT, error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT]);
                tokenRegistry = exports.getTokenRegistry(document);
                merkleRoot = getMerkleRoot(document);
                return [4 /*yield*/, exports.isTokenMintedOnRegistry({ tokenRegistry: tokenRegistry, merkleRoot: merkleRoot, provider: options.provider })];
            case 1:
                mintStatus = _a.sent();
                if (ethereumTokenRegistryStatus_type_1.ValidTokenRegistryStatus.guard(mintStatus)) {
                    fragment = {
                        name: name,
                        type: type,
                        status: "VALID",
                    };
                    if (open_attestation_1.utils.isWrappedV3Document(document)) {
                        return [2 /*return*/, __assign(__assign({}, fragment), { data: { mintedOnAll: true, details: mintStatus } })];
                    }
                    else {
                        return [2 /*return*/, __assign(__assign({}, fragment), { data: { mintedOnAll: true, details: [mintStatus] } })];
                    }
                }
                else {
                    fragment = {
                        name: name,
                        type: type,
                        reason: mintStatus.reason,
                        status: "INVALID",
                    };
                    if (open_attestation_1.utils.isWrappedV3Document(document)) {
                        return [2 /*return*/, __assign(__assign({}, fragment), { data: { mintedOnAll: false, details: mintStatus } })];
                    }
                    else {
                        return [2 /*return*/, __assign(__assign({}, fragment), { data: { mintedOnAll: false, details: [mintStatus] } })];
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.openAttestationEthereumTokenRegistryStatus = {
    skip: skip,
    test: test,
    verify: errorHandler_1.withCodedErrorHandler(verify, {
        name: name,
        type: type,
        unexpectedErrorCode: error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNEXPECTED_ERROR,
        unexpectedErrorString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNEXPECTED_ERROR],
    }),
};
