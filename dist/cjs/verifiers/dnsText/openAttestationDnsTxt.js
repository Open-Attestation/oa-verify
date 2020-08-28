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
exports.openAttestationDnsTxt = void 0;
var open_attestation_1 = require("@govtechsg/open-attestation");
var dnsprove_1 = require("@govtechsg/dnsprove");
var ethers_1 = require("ethers");
var error_1 = require("../../types/error");
// Resolve identity of an issuer, currently supporting only DNS-TXT
// DNS-TXT is explained => https://github.com/Open-Attestation/adr/blob/master/decentralized_identity_proof_DNS-TXT.md
var resolveIssuerIdentity = function (issuer, smartContractAddress, options) { return __awaiter(void 0, void 0, void 0, function () {
    var type, location, network, records, matchingRecord;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                type = (_b = (_a = issuer === null || issuer === void 0 ? void 0 : issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : "";
                location = (_d = (_c = issuer === null || issuer === void 0 ? void 0 : issuer.identityProof) === null || _c === void 0 ? void 0 : _c.location) !== null && _d !== void 0 ? _d : "";
                if (type !== "DNS-TXT")
                    throw new Error("Identity type not supported");
                if (!location)
                    throw new Error("Location is missing");
                return [4 /*yield*/, ethers_1.getDefaultProvider(options.network).getNetwork()];
            case 1:
                network = _e.sent();
                return [4 /*yield*/, dnsprove_1.getDocumentStoreRecords(location)];
            case 2:
                records = _e.sent();
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
                        }];
        }
    });
}); };
var name = "OpenAttestationDnsTxt";
var type = "ISSUER_IDENTITY";
exports.openAttestationDnsTxt = {
    skip: function () {
        return Promise.resolve({
            status: "SKIPPED",
            type: type,
            name: name,
            reason: {
                code: error_1.OpenAttestationDnsTxtCode.SKIPPED,
                codeString: error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.SKIPPED],
                message: "Document issuers doesn't have \"documentStore\" / \"tokenRegistry\" property or doesn't use " + open_attestation_1.v3.IdentityProofType.DNSTxt + " type",
            },
        });
    },
    test: function (document) {
        if (open_attestation_1.utils.isWrappedV2Document(document)) {
            var documentData_1 = open_attestation_1.getData(document);
            // at least one issuer uses DNS-TXT
            return documentData_1.issuers.some(function (issuer) {
                var _a;
                return ((issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore) &&
                    ((_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) === open_attestation_1.v2.IdentityProofType.DNSTxt);
            });
        }
        var documentData = open_attestation_1.getData(document);
        return documentData.issuer.identityProof.type === open_attestation_1.v3.IdentityProofType.DNSTxt;
    },
    verify: function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
        var documentData, identities, invalidIdentity, smartContractAddress, documentData, identity, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!open_attestation_1.utils.isWrappedV2Document(document)) return [3 /*break*/, 2];
                    documentData = open_attestation_1.getData(document);
                    return [4 /*yield*/, Promise.all(documentData.issuers.map(function (issuer) {
                            var _a;
                            if (((_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) === open_attestation_1.v2.IdentityProofType.DNSTxt) {
                                return resolveIssuerIdentity(issuer, 
                                // we expect the test function to prevent this issue => smart contract address MUST be populated
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore), options);
                            }
                            var skippedResponse = {
                                status: "SKIPPED",
                            };
                            return skippedResponse; // eslint is happy, so am I (https://github.com/bradzacher/eslint-plugin-typescript/blob/master/docs/rules/no-object-literal-type-assertion.md)
                        }))];
                case 1:
                    identities = _a.sent();
                    invalidIdentity = identities.findIndex(function (identity) { return identity.status === "INVALID"; });
                    if (invalidIdentity !== -1) {
                        smartContractAddress = documentData.issuers[invalidIdentity].documentStore ||
                            documentData.issuers[invalidIdentity].tokenRegistry ||
                            documentData.issuers[invalidIdentity].certificateStore;
                        return [2 /*return*/, {
                                name: name,
                                type: type,
                                data: identities,
                                reason: {
                                    code: error_1.OpenAttestationDnsTxtCode.INVALID_IDENTITY,
                                    codeString: error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.INVALID_IDENTITY],
                                    message: "Document issuer identity for " + smartContractAddress + " is invalid",
                                },
                                status: "INVALID",
                            }];
                    }
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: identities,
                            status: "VALID",
                        }];
                case 2:
                    documentData = open_attestation_1.getData(document);
                    return [4 /*yield*/, resolveIssuerIdentity(documentData.issuer, documentData.proof.value, options)];
                case 3:
                    identity = _a.sent();
                    if (identity.status === "INVALID") {
                        return [2 /*return*/, {
                                name: name,
                                type: type,
                                data: identity,
                                reason: {
                                    code: error_1.OpenAttestationDnsTxtCode.INVALID_IDENTITY,
                                    codeString: error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.INVALID_IDENTITY],
                                    message: "Document issuer identity is invalid",
                                },
                                status: "INVALID",
                            }];
                    }
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: identity,
                            status: "VALID",
                        }];
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: e_1,
                            reason: {
                                code: error_1.OpenAttestationDnsTxtCode.UNEXPECTED_ERROR,
                                codeString: error_1.OpenAttestationDnsTxtCode[error_1.OpenAttestationDnsTxtCode.UNEXPECTED_ERROR],
                                message: e_1.message,
                            },
                            status: "ERROR",
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); },
};
