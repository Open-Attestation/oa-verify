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
import { getData, utils, v3 } from "@govtechsg/open-attestation";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { OpenAttestationEthereumDocumentStoreStatusCode } from "../../../types/error";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { decodeError, isRevokedOnDocumentStore } from "../utils";
import { InvalidRevocationStatus, ValidRevocationStatusArray } from "../revocation.types";
import { InvalidDocumentStoreIssuanceStatus, ValidDocumentStoreDataV3, ValidDocumentStoreIssuanceStatusArray, } from "./ethereumDocumentStoreStatus.type";
var name = "OpenAttestationEthereumDocumentStoreStatus";
var type = "DOCUMENT_STATUS";
// Returns list of all document stores, throws when not all issuers are using document store
export var getIssuersDocumentStores = function (document) {
    var data = getData(document);
    return data.issuers.map(function (issuer) {
        var documentStoreAddress = issuer.documentStore || issuer.certificateStore;
        if (!documentStoreAddress)
            throw new CodedError("Document store address not found in issuer " + issuer.name, OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ISSUERS, OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ISSUERS]);
        return documentStoreAddress;
    });
};
export var isIssuedOnDocumentStore = function (_a) {
    var documentStore = _a.documentStore, merkleRoot = _a.merkleRoot, provider = _a.provider;
    return __awaiter(void 0, void 0, void 0, function () {
        var documentStoreContract, issued, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, DocumentStoreFactory.connect(documentStore, provider)];
                case 1:
                    documentStoreContract = _b.sent();
                    return [4 /*yield*/, documentStoreContract.isIssued(merkleRoot)];
                case 2:
                    issued = _b.sent();
                    return [2 /*return*/, issued
                            ? {
                                issued: true,
                                address: documentStore,
                            }
                            : {
                                issued: false,
                                address: documentStore,
                                reason: {
                                    message: "Document " + merkleRoot + " has not been issued under contract " + documentStore,
                                    code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED,
                                    codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED],
                                },
                            }];
                case 3:
                    error_1 = _b.sent();
                    // If error can be decoded and it's because of document is not issued, we return false
                    // Else allow error to continue to bubble up
                    return [2 /*return*/, {
                            issued: false,
                            address: documentStore,
                            reason: {
                                message: decodeError(error_1),
                                code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED,
                                codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED],
                            },
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var skip = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                status: "SKIPPED",
                type: type,
                name: name,
                reason: {
                    code: OpenAttestationEthereumDocumentStoreStatusCode.SKIPPED,
                    codeString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SKIPPED],
                    message: "Document issuers doesn't have \"documentStore\" or \"certificateStore\" property or " + v3.Method.DocumentStore + " method",
                },
            }];
    });
}); };
var test = function (document) {
    if (utils.isWrappedV2Document(document)) {
        var documentData = getData(document);
        return documentData.issuers.some(function (issuer) { return "documentStore" in issuer || "certificateStore" in issuer; });
    }
    else if (utils.isWrappedV3Document(document)) {
        return document.openAttestationMetadata.proof.method === v3.Method.DocumentStore;
    }
    return false;
};
var verifyV2 = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var documentStores, merkleRoot, targetHash, proofs, issuanceStatuses, notIssued, revocationStatuses, revoked;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                documentStores = getIssuersDocumentStores(document);
                merkleRoot = "0x" + document.signature.merkleRoot;
                targetHash = document.signature.targetHash;
                proofs = document.signature.proof || [];
                return [4 /*yield*/, Promise.all(documentStores.map(function (documentStore) {
                        return isIssuedOnDocumentStore({ documentStore: documentStore, merkleRoot: merkleRoot, provider: options.provider });
                    }))];
            case 1:
                issuanceStatuses = _a.sent();
                notIssued = issuanceStatuses.find(InvalidDocumentStoreIssuanceStatus.guard);
                if (InvalidDocumentStoreIssuanceStatus.guard(notIssued)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: {
                                issuedOnAll: false,
                                details: { issuance: issuanceStatuses },
                            },
                            reason: notIssued.reason,
                            status: "INVALID",
                        }];
                }
                return [4 /*yield*/, Promise.all(documentStores.map(function (documentStore) {
                        return isRevokedOnDocumentStore({
                            documentStore: documentStore,
                            merkleRoot: merkleRoot,
                            targetHash: targetHash,
                            proofs: proofs,
                            provider: options.provider,
                        });
                    }))];
            case 2:
                revocationStatuses = _a.sent();
                revoked = revocationStatuses.find(InvalidRevocationStatus.guard);
                if (InvalidRevocationStatus.guard(revoked)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: {
                                issuedOnAll: true,
                                revokedOnAny: true,
                                details: { issuance: issuanceStatuses, revocation: revocationStatuses },
                            },
                            reason: revoked.reason,
                            status: "INVALID",
                        }];
                }
                if (ValidDocumentStoreIssuanceStatusArray.guard(issuanceStatuses) &&
                    ValidRevocationStatusArray.guard(revocationStatuses)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: {
                                issuedOnAll: true,
                                revokedOnAny: false,
                                details: { issuance: issuanceStatuses, revocation: revocationStatuses },
                            },
                            status: "VALID",
                        }];
                }
                throw new CodedError("Reached an unexpected state when verifying v2 document", OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR, "UNEXPECTED_ERROR");
        }
    });
}); };
var verifyV3 = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, merkleRootRaw, targetHash, proofs, merkleRoot, documentStore, issuance, revocation, data, reason;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = document.proof, merkleRootRaw = _a.merkleRoot, targetHash = _a.targetHash, proofs = _a.proofs;
                merkleRoot = "0x" + merkleRootRaw;
                documentStore = document.openAttestationMetadata.proof.value;
                return [4 /*yield*/, isIssuedOnDocumentStore({ documentStore: documentStore, merkleRoot: merkleRoot, provider: options.provider })];
            case 1:
                issuance = _b.sent();
                return [4 /*yield*/, isRevokedOnDocumentStore({
                        documentStore: documentStore,
                        merkleRoot: merkleRoot,
                        targetHash: targetHash,
                        proofs: proofs,
                        provider: options.provider,
                    })];
            case 2:
                revocation = _b.sent();
                data = {
                    issuedOnAll: issuance.issued,
                    revokedOnAny: revocation.revoked,
                    details: {
                        issuance: issuance,
                        revocation: revocation,
                    },
                };
                if (ValidDocumentStoreDataV3.guard(data)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: data,
                            status: "VALID",
                        }];
                }
                if (InvalidRevocationStatus.guard(revocation)) {
                    reason = revocation.reason;
                }
                else if (InvalidDocumentStoreIssuanceStatus.guard(issuance)) {
                    reason = issuance.reason;
                }
                if (!reason) {
                    throw new CodedError("Unable to retrieve the reason of the failure", OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR, "UNEXPECTED_ERROR");
                }
                return [2 /*return*/, {
                        name: name,
                        type: type,
                        data: data,
                        status: "INVALID",
                        reason: reason,
                    }];
        }
    });
}); };
var verify = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (utils.isWrappedV2Document(document))
            return [2 /*return*/, verifyV2(document, options)];
        else if (utils.isWrappedV3Document(document))
            return [2 /*return*/, verifyV3(document, options)];
        throw new CodedError("Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.", OpenAttestationEthereumDocumentStoreStatusCode.UNRECOGNIZED_DOCUMENT, OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.UNRECOGNIZED_DOCUMENT]);
    });
}); };
export var openAttestationEthereumDocumentStoreStatus = {
    skip: skip,
    test: test,
    verify: withCodedErrorHandler(verify, {
        name: name,
        type: type,
        unexpectedErrorCode: OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR,
        unexpectedErrorString: OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR],
    }),
};
