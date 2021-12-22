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
exports.openAttestationDnsTxtIdentityProof = void 0;
var open_attestation_1 = require("@govtechsg/open-attestation");
var dnsprove_1 = require("@govtechsg/dnsprove");
var error_1 = require("../../../types/error");
var errorHandler_1 = require("../../../common/errorHandler");
var error_2 = require("../../../common/error");
var openAttestationDnsTxt_type_1 = require("./openAttestationDnsTxt.type");
var name = "OpenAttestationDnsTxtIdentityProof";
var type = "ISSUER_IDENTITY";
// Resolve identity of an issuer, currently supporting only DNS-TXT
// DNS-TXT is explained => https://github.com/Open-Attestation/adr/blob/master/decentralized_identity_proof_DNS-TXT.md
var resolveIssuerIdentity = function (location, smartContractAddress, options) { return __awaiter(void 0, void 0, void 0, function () {
    var network, records, matchingRecord;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, options.provider.getNetwork()];
            case 1:
                network = _a.sent();
                return [4 /*yield*/, dnsprove_1.getDocumentStoreRecords(location)];
            case 2:
                records = _a.sent();
                matchingRecord = records.find(function (record) {
                    return record.addr.toLowerCase() === smartContractAddress.toLowerCase() &&
                        record.netId === network.chainId.toString(10) &&
                        record.type === "openatts" &&
                        record.net === "ethereum";
                });
                return [2 /*return*/, matchingRecord
                        ? {
                            status: "VALID",
                            location: location,
                            value: smartContractAddress,
                        }
                        : {
                            status: "INVALID",
                            location: location,
                            value: smartContractAddress,
                            reason: {
                                message: "Matching DNS record not found for " + smartContractAddress,
                                code: error_1.OpenAttestationDnsTxtCode.MATCHING_RECORD_NOT_FOUND,
                                codeString: error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.MATCHING_RECORD_NOT_FOUND],
                            },
                        }];
        }
    });
}); };
var skip = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                status: "SKIPPED",
                type: type,
                name: name,
                reason: {
                    code: error_1.OpenAttestationDnsTxtCode.SKIPPED,
                    codeString: error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.SKIPPED],
                    message: "Document issuers doesn't have \"documentStore\" / \"tokenRegistry\" property or doesn't use " + open_attestation_1.v3.IdentityProofType.DNSTxt + " type",
                },
            }];
    });
}); };
var test = function (document) {
    if (open_attestation_1.utils.isWrappedV2Document(document)) {
        var documentData = open_attestation_1.getData(document);
        // at least one issuer uses DNS-TXT
        return documentData.issuers.some(function (issuer) {
            var _a;
            return ((issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore) &&
                ((_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) === open_attestation_1.v2.IdentityProofType.DNSTxt);
        });
    }
    else if (open_attestation_1.utils.isWrappedV3Document(document)) {
        return document.openAttestationMetadata.identityProof.type === open_attestation_1.v3.IdentityProofType.DNSTxt;
    }
    return false;
};
var verifyV2 = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var documentData, identities, invalidIdentity;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                documentData = open_attestation_1.getData(document);
                return [4 /*yield*/, Promise.all(documentData.issuers.map(function (issuer) {
                        var _a;
                        if (((_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) === open_attestation_1.v2.IdentityProofType.DNSTxt) {
                            var location = issuer.identityProof.location;
                            var smartContractAddress = issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore;
                            if (!location)
                                throw new error_2.CodedError("Location not found in identity proof", error_1.OpenAttestationDnsTxtCode.INVALID_ISSUERS, error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.INVALID_ISSUERS]);
                            if (!smartContractAddress)
                                throw new error_2.CodedError("Smart contract address not found in identity proof", error_1.OpenAttestationDnsTxtCode.INVALID_ISSUERS, error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.INVALID_ISSUERS]);
                            return resolveIssuerIdentity(location, smartContractAddress, options);
                        }
                        var invalidResponse = {
                            status: "INVALID",
                            reason: {
                                message: "Issuer is not using DNS-TXT identityProof type",
                                code: error_1.OpenAttestationDnsTxtCode.INVALID_ISSUERS,
                                codeString: error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.INVALID_ISSUERS],
                            },
                        };
                        return invalidResponse; // eslint is happy, so am I (https://github.com/bradzacher/eslint-plugin-typescript/blob/master/docs/rules/no-object-literal-type-assertion.md)
                    }))];
            case 1:
                identities = _a.sent();
                if (openAttestationDnsTxt_type_1.ValidDnsTxtVerificationStatusArray.guard(identities)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: identities,
                            status: "VALID",
                        }];
                }
                invalidIdentity = identities.find(openAttestationDnsTxt_type_1.InvalidDnsTxtVerificationStatus.guard);
                if (openAttestationDnsTxt_type_1.InvalidDnsTxtVerificationStatus.guard(invalidIdentity)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: identities,
                            reason: invalidIdentity.reason,
                            status: "INVALID",
                        }];
                }
                throw new error_2.CodedError("Unable to retrieve the reason of the failure", error_1.OpenAttestationDnsTxtCode.UNEXPECTED_ERROR, "UNEXPECTED_ERROR");
        }
    });
}); };
var verifyV3 = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var smartContractAddress, identifier, issuerIdentity;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (document.openAttestationMetadata.proof.method !== open_attestation_1.v3.Method.DocumentStore &&
                    document.openAttestationMetadata.proof.method !== open_attestation_1.v3.Method.TokenRegistry)
                    throw new error_2.CodedError("DNS-TXT is only supported with documents issued using document store or token registry", error_1.OpenAttestationDnsTxtCode.UNSUPPORTED, error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.UNSUPPORTED]);
                smartContractAddress = document.openAttestationMetadata.proof.value;
                identifier = document.openAttestationMetadata.identityProof.identifier;
                return [4 /*yield*/, resolveIssuerIdentity(identifier, smartContractAddress, options)];
            case 1:
                issuerIdentity = _a.sent();
                if (openAttestationDnsTxt_type_1.ValidDnsTxtVerificationStatus.guard(issuerIdentity)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: {
                                identifier: issuerIdentity.location,
                                value: issuerIdentity.value,
                            },
                            status: "VALID",
                        }];
                }
                return [2 /*return*/, {
                        name: name,
                        type: type,
                        data: {
                            identifier: issuerIdentity.location,
                            value: issuerIdentity.value,
                        },
                        reason: issuerIdentity.reason,
                        status: "INVALID",
                    }];
        }
    });
}); };
exports.openAttestationDnsTxtIdentityProof = {
    skip: skip,
    test: test,
    verify: errorHandler_1.withCodedErrorHandler(function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (open_attestation_1.utils.isWrappedV2Document(document))
                return [2 /*return*/, verifyV2(document, options)];
            else if (open_attestation_1.utils.isWrappedV3Document(document))
                return [2 /*return*/, verifyV3(document, options)];
            // this code is actually unreachable because of the test function
            throw new error_2.CodedError("Document does not match either v2 or v3 formats", error_1.OpenAttestationDnsTxtCode.UNRECOGNIZED_DOCUMENT, error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.UNRECOGNIZED_DOCUMENT]);
        });
    }); }, {
        name: name,
        type: type,
        unexpectedErrorCode: error_1.OpenAttestationDnsTxtCode.UNEXPECTED_ERROR,
        unexpectedErrorString: error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.UNEXPECTED_ERROR],
    }),
};
