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
import { getData, utils, v2, v3 } from "@govtechsg/open-attestation";
import { getDnsDidRecords } from "@govtechsg/dnsprove";
import { OpenAttestationDnsDidCode } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";
import { ValidDnsDidVerificationStatus, ValidDnsDidVerificationStatusArray, } from "./dnsDidProof.type";
var name = "OpenAttestationDnsDidIdentityProof";
var type = "ISSUER_IDENTITY";
var skip = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                status: "SKIPPED",
                type: type,
                name: name,
                reason: {
                    code: OpenAttestationDnsDidCode.SKIPPED,
                    codeString: OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.SKIPPED],
                    message: "Document was not issued using DNS-DID",
                },
            }];
    });
}); };
var test = function (document) {
    if (utils.isSignedWrappedV2Document(document)) {
        var data = getData(document);
        return data.issuers.some(function (issuer) { var _a; return ((_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) === "DNS-DID"; });
    }
    else if (utils.isSignedWrappedV3Document(document)) {
        return document.openAttestationMetadata.identityProof.type === v3.IdentityProofType.DNSDid;
    }
    return false;
};
var verifyIssuerDnsDid = function (_a) {
    var key = _a.key, location = _a.location;
    return __awaiter(void 0, void 0, void 0, function () {
        var records;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getDnsDidRecords(location)];
                case 1:
                    records = _b.sent();
                    return [2 /*return*/, {
                            location: location,
                            key: key,
                            status: records.some(function (record) { return record.publicKey.toLowerCase() === key.toLowerCase(); }) ? "VALID" : "INVALID",
                        }];
            }
        });
    });
};
var verifyV2 = function (document) { return __awaiter(void 0, void 0, void 0, function () {
    var documentData, deferredVerificationStatus, verificationStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                documentData = getData(document);
                deferredVerificationStatus = documentData.issuers.map(function (issuer) {
                    var identityProof = issuer.identityProof;
                    if (!identityProof)
                        throw new CodedError("Identity proof missing", OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF, OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF]);
                    var key = identityProof.key, location = identityProof.location, identityProofType = identityProof.type;
                    if (identityProofType !== v2.IdentityProofType.DNSDid)
                        throw new CodedError("Issuer is not using DID-DNS identityProof type", OpenAttestationDnsDidCode.INVALID_ISSUERS, OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.INVALID_ISSUERS]);
                    if (!location)
                        throw new CodedError("location is not present in identity proof", OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF, OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF]);
                    if (!key)
                        throw new CodedError("key is not present in identity proof", OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF, OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF]);
                    return verifyIssuerDnsDid({ key: key, location: location });
                });
                return [4 /*yield*/, Promise.all(deferredVerificationStatus)];
            case 1:
                verificationStatus = _a.sent();
                if (ValidDnsDidVerificationStatusArray.guard(verificationStatus)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: verificationStatus,
                            status: "VALID",
                        }];
                }
                return [2 /*return*/, {
                        name: name,
                        type: type,
                        data: verificationStatus,
                        reason: {
                            message: "Could not find identity at location",
                            code: OpenAttestationDnsDidCode.INVALID_IDENTITY,
                            codeString: "INVALID_IDENTITY",
                        },
                        status: "INVALID",
                    }];
        }
    });
}); };
var verifyV3 = function (document) { return __awaiter(void 0, void 0, void 0, function () {
    var location, key, verificationStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!utils.isSignedWrappedV3Document(document))
                    throw new CodedError("document is not signed", OpenAttestationDnsDidCode.UNSIGNED, OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNSIGNED]);
                location = document.openAttestationMetadata.identityProof.identifier;
                key = document.proof.key;
                return [4 /*yield*/, verifyIssuerDnsDid({ key: key, location: location })];
            case 1:
                verificationStatus = _a.sent();
                if (ValidDnsDidVerificationStatus.guard(verificationStatus)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: verificationStatus,
                            status: "VALID",
                        }];
                }
                return [2 /*return*/, {
                        name: name,
                        type: type,
                        data: verificationStatus,
                        status: "INVALID",
                        reason: {
                            message: "Could not find identity at location",
                            code: OpenAttestationDnsDidCode.INVALID_IDENTITY,
                            codeString: "INVALID_IDENTITY",
                        },
                    }];
        }
    });
}); };
var verify = function (document) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (utils.isSignedWrappedV2Document(document))
            return [2 /*return*/, verifyV2(document)];
        else if (utils.isSignedWrappedV3Document(document))
            return [2 /*return*/, verifyV3(document)];
        throw new CodedError("Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.", OpenAttestationDnsDidCode.UNRECOGNIZED_DOCUMENT, OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNRECOGNIZED_DOCUMENT]);
    });
}); };
export var openAttestationDnsDidIdentityProof = {
    skip: skip,
    test: test,
    verify: withCodedErrorHandler(verify, {
        name: name,
        type: type,
        unexpectedErrorCode: OpenAttestationDnsDidCode.UNEXPECTED_ERROR,
        unexpectedErrorString: OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNEXPECTED_ERROR],
    }),
};
