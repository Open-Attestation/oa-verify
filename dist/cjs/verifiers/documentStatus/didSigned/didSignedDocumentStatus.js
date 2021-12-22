"use strict";
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
exports.openAttestationDidSignedDocumentStatus = void 0;
var open_attestation_1 = require("@govtechsg/open-attestation");
var error_1 = require("../../../types/error");
var verifier_1 = require("../../../did/verifier");
var error_2 = require("../../../common/error");
var errorHandler_1 = require("../../../common/errorHandler");
var utils_1 = require("../utils");
var revocation_types_1 = require("../revocation.types");
var didSignedDocumentStatus_type_1 = require("./didSignedDocumentStatus.type");
var name = "OpenAttestationDidSignedDocumentStatus";
var type = "DOCUMENT_STATUS";
var skip = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                status: "SKIPPED",
                type: type,
                name: name,
                reason: {
                    code: error_1.OpenAttestationDidSignedDocumentStatusCode.SKIPPED,
                    codeString: error_1.OpenAttestationDidSignedDocumentStatusCode[error_1.OpenAttestationDidSignedDocumentStatusCode.SKIPPED],
                    message: "Document was not signed by DID directly",
                },
            }];
    });
}); };
var test = function (document) {
    if (open_attestation_1.utils.isSignedWrappedV2Document(document)) {
        return document.proof.some(function (proof) { return proof.type === "OpenAttestationSignature2018"; });
    }
    else if (open_attestation_1.utils.isSignedWrappedV3Document(document)) {
        return document.proof.type === "OpenAttestationMerkleProofSignature2018";
    }
    return false;
};
var transformToDidSignedIssuanceStatus = function (status) {
    return verifier_1.ValidDidVerificationStatus.guard(status)
        ? {
            issued: true,
            did: status.did,
        }
        : {
            issued: false,
            did: status.did,
            reason: status.reason,
        };
};
var verifyV2 = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var documentData, merkleRoot, _a, targetHash, proofs, issuers, revocation, revocationStatusCallback, revocationStatuses, signatureVerificationDeferred, issuance, notIssued, revoked, data, reason;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                documentData = open_attestation_1.getData(document);
                merkleRoot = "0x" + document.signature.merkleRoot;
                _a = document.signature, targetHash = _a.targetHash, proofs = _a.proof;
                documentData.issuers.forEach(function (issuer) {
                    var _a, _b;
                    if (!(((_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) === "DID" || ((_b = issuer.identityProof) === null || _b === void 0 ? void 0 : _b.type) === "DNS-DID"))
                        throw new error_2.CodedError("All issuers must use DID or DNS-DID identityProof type.", error_1.OpenAttestationDidSignedDocumentStatusCode.INVALID_ISSUERS, error_1.OpenAttestationDidSignedDocumentStatusCode[error_1.OpenAttestationDidSignedDocumentStatusCode.INVALID_ISSUERS]);
                });
                issuers = documentData.issuers;
                revocation = issuers.map(function (issuer) { return issuer.revocation; });
                if (revocation.some(function (r) { return typeof (r === null || r === void 0 ? void 0 : r.type) === "undefined"; }))
                    throw new error_2.CodedError("revocation block not found for an issuer", error_1.OpenAttestationDidSignedDocumentStatusCode.MISSING_REVOCATION, "MISSING_REVOCATION");
                revocationStatusCallback = function (revocationItem) {
                    switch (revocationItem.type) {
                        case open_attestation_1.v2.RevocationType.RevocationStore:
                            if (typeof revocationItem.location === "string") {
                                return utils_1.isRevokedOnDocumentStore({
                                    documentStore: revocationItem.location,
                                    merkleRoot: merkleRoot,
                                    provider: options.provider,
                                    targetHash: targetHash,
                                    proofs: proofs,
                                });
                            }
                            throw new error_2.CodedError("missing revocation location for an issuer", error_1.OpenAttestationDidSignedDocumentStatusCode.REVOCATION_LOCATION_MISSING, "REVOCATION_LOCATION_MISSING");
                        case open_attestation_1.v2.RevocationType.OcspResponder:
                            if (typeof revocationItem.location === "string") {
                                return utils_1.isRevokedByOcspResponder({
                                    certificateId: documentData.id,
                                    location: revocationItem.location,
                                });
                            }
                            throw new error_2.CodedError("missing revocation location for an issuer", error_1.OpenAttestationDidSignedDocumentStatusCode.REVOCATION_LOCATION_MISSING, "REVOCATION_LOCATION_MISSING");
                        case open_attestation_1.v2.RevocationType.None:
                            return Promise.resolve({ revoked: false });
                        default:
                            throw new error_2.CodedError("unrecognized revocation type for an issuer", error_1.OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_REVOCATION_TYPE, "UNRECOGNIZED_REVOCATION_TYPE");
                    }
                };
                return [4 /*yield*/, Promise.all(revocation.map(revocationStatusCallback))];
            case 1:
                revocationStatuses = _b.sent();
                // Check that all the issuers have signed on the document
                if (!document.proof)
                    throw new error_2.CodedError("Document is not signed. Proofs are missing.", error_1.OpenAttestationDidSignedDocumentStatusCode.UNSIGNED, "UNSIGNED");
                signatureVerificationDeferred = issuers.map(function (issuer) { return __awaiter(void 0, void 0, void 0, function () {
                    var key, did, correspondingProof;
                    var _a;
                    return __generator(this, function (_b) {
                        key = (_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.key;
                        did = issuer.id;
                        if (!did)
                            throw new error_2.CodedError("id is missing in issuer", error_1.OpenAttestationDidSignedDocumentStatusCode.DID_MISSING, "DID_MISSING");
                        if (!key)
                            throw new error_2.CodedError("Key is not present", error_1.OpenAttestationDidSignedDocumentStatusCode.MALFORMED_IDENTITY_PROOF, "MALFORMED_IDENTITY_PROOF");
                        correspondingProof = document.proof.find(function (p) { return p.verificationMethod.toLowerCase() === key.toLowerCase(); });
                        if (!correspondingProof)
                            throw new error_2.CodedError("Proof not found for " + key, error_1.OpenAttestationDidSignedDocumentStatusCode.CORRESPONDING_PROOF_MISSING, "CORRESPONDING_PROOF_MISSING");
                        return [2 /*return*/, verifier_1.verifySignature({
                                merkleRoot: merkleRoot,
                                key: key,
                                signature: correspondingProof.signature,
                                did: did,
                                resolver: options.resolver,
                            })];
                    });
                }); });
                return [4 /*yield*/, Promise.all(signatureVerificationDeferred)];
            case 2: return [4 /*yield*/, (_b.sent()).map(transformToDidSignedIssuanceStatus)];
            case 3:
                issuance = _b.sent();
                notIssued = issuance.find(didSignedDocumentStatus_type_1.InvalidDidSignedIssuanceStatus.guard);
                revoked = revocationStatuses.find(revocation_types_1.InvalidRevocationStatus.guard);
                data = {
                    issuedOnAll: !notIssued,
                    revokedOnAny: !!revoked,
                    details: {
                        issuance: issuance,
                        revocation: revocationStatuses,
                    },
                };
                if (didSignedDocumentStatus_type_1.ValidDidSignedDataV2.guard(data)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: data,
                            status: "VALID",
                        }];
                }
                if (didSignedDocumentStatus_type_1.InvalidDidSignedIssuanceStatus.guard(notIssued)) {
                    reason = notIssued.reason;
                }
                else if (revocation_types_1.InvalidRevocationStatus.guard(revoked)) {
                    reason = revoked.reason;
                }
                if (!reason) {
                    throw new error_2.CodedError("Unable to retrieve the reason of the failure", error_1.OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR, "UNEXPECTED_ERROR");
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
var verifyV3 = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, merkleRootRaw, targetHash, proofs, merkleRoot, metaData, verificationResult, _b, issuedOnAll, getRevocationStatus, revocationStatus, revokedOnAny, reason;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = document.proof, merkleRootRaw = _a.merkleRoot, targetHash = _a.targetHash, proofs = _a.proofs;
                merkleRoot = "0x" + merkleRootRaw;
                metaData = document.openAttestationMetadata;
                _b = transformToDidSignedIssuanceStatus;
                return [4 /*yield*/, verifier_1.verifySignature({
                        key: document.proof.key,
                        did: metaData.proof.value,
                        merkleRoot: merkleRoot,
                        signature: document.proof.signature,
                        resolver: options.resolver,
                    })];
            case 1:
                verificationResult = _b.apply(void 0, [_d.sent()]);
                if (!((_c = metaData.proof.revocation) === null || _c === void 0 ? void 0 : _c.type)) {
                    throw new error_2.CodedError("revocation block not found for an issuer", error_1.OpenAttestationDidSignedDocumentStatusCode.MISSING_REVOCATION, "MISSING_REVOCATION");
                }
                issuedOnAll = verificationResult.issued;
                getRevocationStatus = function (docType, location) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (docType) {
                            case open_attestation_1.v3.RevocationType.RevocationStore:
                                if (typeof location === "string") {
                                    return [2 /*return*/, utils_1.isRevokedOnDocumentStore({
                                            documentStore: location,
                                            merkleRoot: merkleRoot,
                                            targetHash: targetHash,
                                            proofs: proofs,
                                            provider: options.provider,
                                        })];
                                }
                                throw new error_2.CodedError("missing revocation location for an issuer", error_1.OpenAttestationDidSignedDocumentStatusCode.REVOCATION_LOCATION_MISSING, "REVOCATION_LOCATION_MISSING");
                            case open_attestation_1.v3.RevocationType.OcspResponder:
                                throw new Error("Ocsp revocation type not yet supported for v3");
                            case open_attestation_1.v3.RevocationType.None:
                                return [2 /*return*/, { revoked: false }];
                            default:
                                throw new error_2.CodedError("revocation type not found for an issuer", error_1.OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_REVOCATION_TYPE, "UNRECOGNIZED_REVOCATION_TYPE");
                        }
                        return [2 /*return*/];
                    });
                }); };
                return [4 /*yield*/, getRevocationStatus(metaData.proof.revocation.type, metaData.proof.revocation.location)];
            case 2:
                revocationStatus = _d.sent();
                revokedOnAny = revocationStatus.revoked;
                if (didSignedDocumentStatus_type_1.ValidDidSignedIssuanceStatus.guard(verificationResult) && revocation_types_1.ValidRevocationStatus.guard(revocationStatus)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: {
                                issuedOnAll: true,
                                revokedOnAny: false,
                                details: {
                                    issuance: verificationResult,
                                    revocation: revocationStatus,
                                },
                            },
                            status: "VALID",
                        }];
                }
                reason = didSignedDocumentStatus_type_1.InvalidDidSignedIssuanceStatus.guard(verificationResult)
                    ? verificationResult.reason
                    : revocation_types_1.InvalidRevocationStatus.guard(revocationStatus)
                        ? revocationStatus.reason
                        : undefined;
                if (!reason) {
                    throw new error_2.CodedError("Unable to retrieve the reason of the failure", error_1.OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR, "UNEXPECTED_ERROR");
                }
                return [2 /*return*/, {
                        name: name,
                        type: type,
                        data: {
                            issuedOnAll: issuedOnAll,
                            revokedOnAny: revokedOnAny,
                            details: {
                                issuance: verificationResult,
                                revocation: revocationStatus,
                            },
                        },
                        status: "INVALID",
                        reason: reason,
                    }];
        }
    });
}); };
var verify = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (open_attestation_1.utils.isSignedWrappedV2Document(document)) {
            return [2 /*return*/, verifyV2(document, options)];
        }
        else if (open_attestation_1.utils.isSignedWrappedV3Document(document)) {
            return [2 /*return*/, verifyV3(document, options)];
        }
        throw new error_2.CodedError("Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.", error_1.OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_DOCUMENT, error_1.OpenAttestationDidSignedDocumentStatusCode[error_1.OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_DOCUMENT]);
    });
}); };
exports.openAttestationDidSignedDocumentStatus = {
    skip: skip,
    test: test,
    verify: errorHandler_1.withCodedErrorHandler(verify, {
        name: name,
        type: type,
        unexpectedErrorCode: error_1.OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR,
        unexpectedErrorString: error_1.OpenAttestationDidSignedDocumentStatusCode[error_1.OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR],
    }),
};
