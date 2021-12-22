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
import { utils } from "@govtechsg/open-attestation";
import { errors } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { OpenAttestationEthereumDocumentStoreStatusCode, OpenAttestationDidSignedDocumentStatusCode, } from "../../types/error";
import { CodedError } from "../../common/error";
import { OcspResponderRevocationReason } from "./revocation.types";
import axios from "axios";
import { ValidOcspResponse, ValidOcspResponseRevoked } from "./didSigned/didSignedDocumentStatus.type";
export var getIntermediateHashes = function (targetHash, proofs) {
    if (proofs === void 0) { proofs = []; }
    var hashes = ["0x" + targetHash];
    proofs.reduce(function (prev, curr) {
        var next = utils.combineHashString(prev, curr);
        hashes.push("0x" + next);
        return next;
    }, targetHash);
    return hashes;
};
/**
 * Try to decode the error to see if we can deterministically tell if the document has NOT been issued or revoked.
 *
 * In case where we cannot tell, we throw an error
 * */
export var decodeError = function (error) {
    var _a, _b, _c, _d;
    var reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : (_a = error.reason) !== null && _a !== void 0 ? _a : "";
    switch (true) {
        case !error.reason &&
            (((_b = error.method) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "isRevoked(bytes32)".toLowerCase() ||
                ((_c = error.method) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === "isIssued(bytes32)".toLowerCase()) &&
            error.code === errors.CALL_EXCEPTION:
            return "Contract is not found";
        case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
            error.code === errors.UNSUPPORTED_OPERATION:
            return "ENS name is not configured";
        case reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
            return "Bad document store address checksum";
        case ((_d = error.message) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "name not found".toLowerCase():
            return "ENS name is not found";
        case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
            return "Invalid document store address";
        case error.code === errors.INVALID_ARGUMENT:
            return "Invalid call arguments";
        case error.code === errors.SERVER_ERROR:
            throw new CodedError("Unable to connect to the Ethereum network, please try again later", OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR, OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR]);
        default:
            throw error;
    }
};
/**
 * Given a list of hashes, check against one smart contract if any of the hash has been revoked
 * */
export var isAnyHashRevoked = function (smartContract, intermediateHashes) { return __awaiter(void 0, void 0, void 0, function () {
    var revokedStatusDeferred, revokedStatuses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                revokedStatusDeferred = intermediateHashes.map(function (hash) {
                    return smartContract.isRevoked(hash).then(function (status) { return (status ? hash : undefined); });
                });
                return [4 /*yield*/, Promise.all(revokedStatusDeferred)];
            case 1:
                revokedStatuses = _a.sent();
                return [2 /*return*/, revokedStatuses.find(function (hash) { return hash; })];
        }
    });
}); };
export var isRevokedByOcspResponder = function (_a) {
    var certificateId = _a.certificateId, location = _a.location;
    return __awaiter(void 0, void 0, void 0, function () {
        var data, reasonCode;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, axios.get(location + "/" + certificateId)];
                case 1:
                    data = (_b.sent()).data;
                    if (ValidOcspResponseRevoked.guard(data) && data.certificateStatus === "revoked") {
                        reasonCode = data.reasonCode;
                        return [2 /*return*/, {
                                revoked: true,
                                address: location,
                                reason: {
                                    message: OcspResponderRevocationReason[reasonCode],
                                    code: reasonCode,
                                    codeString: OcspResponderRevocationReason[reasonCode],
                                },
                            }];
                    }
                    else if (ValidOcspResponse.guard(data) && data.certificateStatus !== "revoked") {
                        return [2 /*return*/, {
                                revoked: false,
                                address: location,
                            }];
                    }
                    throw new CodedError("oscp response invalid", OpenAttestationDidSignedDocumentStatusCode.OCSP_RESPONSE_INVALID, "OCSP_RESPONSE_INVALID");
            }
        });
    });
};
export var isRevokedOnDocumentStore = function (_a) {
    var documentStore = _a.documentStore, merkleRoot = _a.merkleRoot, provider = _a.provider, targetHash = _a.targetHash, proofs = _a.proofs;
    return __awaiter(void 0, void 0, void 0, function () {
        var documentStoreContract, intermediateHashes, revokedHash, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, DocumentStoreFactory.connect(documentStore, provider)];
                case 1:
                    documentStoreContract = _b.sent();
                    intermediateHashes = getIntermediateHashes(targetHash, proofs);
                    return [4 /*yield*/, isAnyHashRevoked(documentStoreContract, intermediateHashes)];
                case 2:
                    revokedHash = _b.sent();
                    return [2 /*return*/, revokedHash
                            ? {
                                revoked: true,
                                address: documentStore,
                                reason: {
                                    message: "Document " + merkleRoot + " has been revoked under contract " + documentStore,
                                    code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED,
                                    codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED],
                                },
                            }
                            : {
                                revoked: false,
                                address: documentStore,
                            }];
                case 3:
                    error_1 = _b.sent();
                    // If error can be decoded and it's because of document is not revoked, we return false
                    // Else allow error to continue to bubble up
                    return [2 /*return*/, {
                            revoked: true,
                            address: documentStore,
                            reason: {
                                message: decodeError(error_1),
                                code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED,
                                codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED],
                            },
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
};
