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
import { OpenAttestationDidCode } from "../../../types/error";
import { InvalidDidVerificationStatus, ValidDidVerificationStatus, ValidDidVerificationStatusArray, verifySignature, } from "../../../did/verifier";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";
var name = "OpenAttestationDidIdentityProof";
var type = "ISSUER_IDENTITY";
var skip = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                status: "SKIPPED",
                type: type,
                name: name,
                reason: {
                    code: OpenAttestationDidCode.SKIPPED,
                    codeString: OpenAttestationDidCode[OpenAttestationDidCode.SKIPPED],
                    message: "Document is not using DID as top level identifier or has not been wrapped",
                },
            }];
    });
}); };
var test = function (document) {
    if (utils.isWrappedV2Document(document)) {
        var issuers = getData(document).issuers;
        return issuers.some(function (issuer) { var _a; return ((_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) === v2.IdentityProofType.Did; });
    }
    else if (utils.isWrappedV3Document(document)) {
        return document.openAttestationMetadata.identityProof.type === v3.IdentityProofType.Did;
    }
    return false;
};
var verifyV2 = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var data, merkleRoot, signatureVerificationDeferred, signatureVerifications, invalidSignature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!utils.isSignedWrappedV2Document(document))
                    throw new CodedError("Document is not signed", OpenAttestationDidCode.UNSIGNED, "UNSIGNED");
                data = getData(document);
                merkleRoot = "0x" + document.signature.merkleRoot;
                signatureVerificationDeferred = data.issuers.map(function (issuer) { return __awaiter(void 0, void 0, void 0, function () {
                    var did, key_1, correspondingProof;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        if (((_a = issuer.identityProof) === null || _a === void 0 ? void 0 : _a.type) === "DID") {
                            did = issuer.id;
                            if (!did)
                                throw new CodedError("id is missing in issuer", OpenAttestationDidCode.DID_MISSING, "DID_MISSING");
                            key_1 = (_b = issuer.identityProof) === null || _b === void 0 ? void 0 : _b.key;
                            if (!key_1)
                                throw new CodedError("Key is not present", OpenAttestationDidCode.MALFORMED_IDENTITY_PROOF, "MALFORMED_IDENTITY_PROOF");
                            correspondingProof = document.proof.find(function (p) { return p.verificationMethod.toLowerCase() === key_1.toLowerCase(); });
                            if (!correspondingProof)
                                throw new CodedError("No proof for " + key_1, OpenAttestationDidCode.MALFORMED_IDENTITY_PROOF, "MALFORMED_IDENTITY_PROOF");
                            return [2 /*return*/, verifySignature({
                                    merkleRoot: merkleRoot,
                                    key: key_1,
                                    signature: correspondingProof.signature,
                                    did: did,
                                    resolver: options.resolver,
                                })];
                        }
                        throw new CodedError("Issuer is not using DID identityProof type", OpenAttestationDidCode.INVALID_ISSUERS, OpenAttestationDidCode[OpenAttestationDidCode.INVALID_ISSUERS]);
                    });
                }); });
                return [4 /*yield*/, Promise.all(signatureVerificationDeferred)];
            case 1:
                signatureVerifications = _a.sent();
                if (ValidDidVerificationStatusArray.guard(signatureVerifications)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: signatureVerifications,
                            status: "VALID",
                        }];
                }
                invalidSignature = signatureVerifications.find(InvalidDidVerificationStatus.guard);
                if (InvalidDidVerificationStatus.guard(invalidSignature)) {
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: signatureVerifications,
                            reason: invalidSignature.reason,
                            status: "INVALID",
                        }];
                }
                throw new CodedError("Unable to retrieve the reason of the failure", OpenAttestationDidCode.UNEXPECTED_ERROR, "UNEXPECTED_ERROR");
        }
    });
}); };
var verifyV3 = function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
    var merkleRoot, _a, key, signature, did, verificationStatus;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!utils.isSignedWrappedV3Document(document))
                    throw new CodedError("Document is not signed", OpenAttestationDidCode.UNSIGNED, "UNSIGNED");
                merkleRoot = "0x" + document.proof.merkleRoot;
                _a = document.proof, key = _a.key, signature = _a.signature;
                did = document.openAttestationMetadata.identityProof.identifier;
                return [4 /*yield*/, verifySignature({
                        did: did,
                        merkleRoot: merkleRoot,
                        key: key,
                        signature: signature,
                        resolver: options.resolver,
                    })];
            case 1:
                verificationStatus = _b.sent();
                if (ValidDidVerificationStatus.guard(verificationStatus)) {
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
                        reason: verificationStatus.reason,
                        status: "INVALID",
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
        throw new CodedError("Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.", OpenAttestationDidCode.UNRECOGNIZED_DOCUMENT, OpenAttestationDidCode[OpenAttestationDidCode.UNRECOGNIZED_DOCUMENT]);
    });
}); };
export var openAttestationDidIdentityProof = {
    skip: skip,
    test: test,
    verify: withCodedErrorHandler(verify, {
        name: name,
        type: type,
        unexpectedErrorCode: OpenAttestationDidCode.UNEXPECTED_ERROR,
        unexpectedErrorString: OpenAttestationDidCode[OpenAttestationDidCode.UNEXPECTED_ERROR],
    }),
};
