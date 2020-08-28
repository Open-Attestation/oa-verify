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
import { utils, getData, v3 } from "@govtechsg/open-attestation";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { OpenAttestationEthereumDocumentStoreStatusCode } from "../../types/error";
import { contractNotIssued, getErrorReason, contractRevoked } from "./errors";
import { getIssuersDocumentStore, getProvider } from "../../common/utils";
var name = "OpenAttestationEthereumDocumentStoreStatus";
var type = "DOCUMENT_STATUS";
var getIntermediateHashes = function (targetHash, proofs) {
    if (proofs === void 0) { proofs = []; }
    var hashes = ["0x" + targetHash];
    proofs.reduce(function (prev, curr) {
        var next = utils.combineHashString(prev, curr);
        hashes.push("0x" + next);
        return next;
    }, targetHash);
    return hashes;
};
// Given a list of hashes, check against one smart contract if any of the hash has been revoked
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
export var openAttestationEthereumDocumentStoreStatus = {
    skip: function () {
        return Promise.resolve({
            status: "SKIPPED",
            type: type,
            name: name,
            reason: {
                code: OpenAttestationEthereumDocumentStoreStatusCode.SKIPPED,
                codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SKIPPED],
                message: "Document issuers doesn't have \"documentStore\" or \"certificateStore\" property or " + v3.Method.DocumentStore + " method",
            },
        });
    },
    test: function (document) {
        if (utils.isWrappedV3Document(document)) {
            var documentData_1 = getData(document);
            return documentData_1.proof.method === v3.Method.DocumentStore;
        }
        var documentData = getData(document);
        return documentData.issuers.some(function (issuer) { return "documentStore" in issuer || "certificateStore" in issuer; });
    },
    verify: function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
        var documentStores, merkleRoot_1, targetHash_1, proofs_1, issuanceStatuses, notIssued, revocationStatuses, revoked, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    documentStores = getIssuersDocumentStore(document);
                    merkleRoot_1 = "0x" + document.signature.merkleRoot;
                    targetHash_1 = document.signature.targetHash;
                    proofs_1 = document.signature.proof || [];
                    return [4 /*yield*/, Promise.all(documentStores.map(function (documentStore) { return __awaiter(void 0, void 0, void 0, function () {
                            var documentStoreContract, issued, status, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, DocumentStoreFactory.connect(documentStore, getProvider(options))];
                                    case 1:
                                        documentStoreContract = _a.sent();
                                        return [4 /*yield*/, documentStoreContract.isIssued(merkleRoot_1)];
                                    case 2:
                                        issued = _a.sent();
                                        status = {
                                            issued: issued,
                                            address: documentStore,
                                        };
                                        if (!issued) {
                                            status.reason = contractNotIssued(merkleRoot_1, documentStore);
                                        }
                                        return [2 /*return*/, status];
                                    case 3:
                                        e_2 = _a.sent();
                                        return [2 /*return*/, { issued: false, address: documentStore, reason: getErrorReason(e_2, documentStore) }];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    issuanceStatuses = _a.sent();
                    notIssued = issuanceStatuses.find(function (status) { return !status.issued; });
                    if (notIssued) {
                        return [2 /*return*/, {
                                name: name,
                                type: type,
                                data: {
                                    issuedOnAll: false,
                                    details: utils.isWrappedV3Document(document)
                                        ? { issuance: issuanceStatuses[0] }
                                        : { issuance: issuanceStatuses },
                                },
                                reason: notIssued.reason,
                                status: "INVALID",
                            }];
                    }
                    return [4 /*yield*/, Promise.all(documentStores.map(function (documentStore) { return __awaiter(void 0, void 0, void 0, function () {
                            var documentStoreContract, intermediateHashes, revokedHash, status, e_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, DocumentStoreFactory.connect(documentStore, getProvider(options))];
                                    case 1:
                                        documentStoreContract = _a.sent();
                                        intermediateHashes = getIntermediateHashes(targetHash_1, proofs_1);
                                        return [4 /*yield*/, isAnyHashRevoked(documentStoreContract, intermediateHashes)];
                                    case 2:
                                        revokedHash = _a.sent();
                                        status = {
                                            revoked: !!revokedHash,
                                            address: documentStore,
                                        };
                                        if (revokedHash) {
                                            status.reason = contractRevoked(merkleRoot_1, documentStore);
                                        }
                                        return [2 /*return*/, status];
                                    case 3:
                                        e_3 = _a.sent();
                                        return [2 /*return*/, { revoked: true, address: documentStore, reason: getErrorReason(e_3, documentStore) }];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    revocationStatuses = _a.sent();
                    revoked = revocationStatuses.find(function (status) { return status.revoked; });
                    return [2 /*return*/, __assign(__assign({ name: name,
                            type: type, data: {
                                issuedOnAll: true,
                                revokedOnAny: !!revoked,
                                details: utils.isWrappedV3Document(document)
                                    ? { issuance: issuanceStatuses[0], revocation: revocationStatuses[0] }
                                    : { issuance: issuanceStatuses, revocation: revocationStatuses },
                            } }, (revoked ? { reason: revoked.reason } : {})), { status: revoked ? "INVALID" : "VALID" })];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: e_1,
                            reason: {
                                message: e_1.message,
                                code: OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR,
                                codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR],
                            },
                            status: "ERROR",
                        }];
                case 4: return [2 /*return*/];
            }
        });
    }); },
};
