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
import * as ethers from "ethers";
import { utils } from "@govtechsg/open-attestation";
import { OpenAttestationDocumentSignedCode } from "../../types/error";
var name = "OpenAttestationSignedProof";
var type = "DOCUMENT_STATUS";
export var openAttestationSignedProof = {
    skip: function () {
        return Promise.resolve({
            status: "SKIPPED",
            type: type,
            name: name,
            reason: {
                code: OpenAttestationDocumentSignedCode.SKIPPED,
                codeString: OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode.SKIPPED],
                message: "Document does not have a proof block",
            },
        });
    },
    test: function (document) {
        return utils.isSignedWrappedV2Document(document);
    },
    verify: function (document) { return __awaiter(void 0, void 0, void 0, function () {
        var proof, signature, proofValid, msg, recoverAddress, status, status, message, reason, data, message, status, reason;
        return __generator(this, function (_a) {
            try {
                if (!utils.isSignedWrappedV2Document(document))
                    throw new Error("No proof was found in document."); // Optional param, silence undefined type error
                proof = document.proof, signature = document.signature;
                proofValid = false;
                if (proof.type === "EcdsaSecp256k1Signature2019") {
                    msg = signature.targetHash;
                    recoverAddress = ethers.utils.verifyMessage(msg, proof.signature);
                    proofValid = recoverAddress.toLowerCase() === proof.verificationMethod.toLowerCase();
                }
                else {
                    throw new Error("Proof type: " + proof.type + " is not supported.");
                }
                if (proofValid) {
                    status = "VALID";
                    return [2 /*return*/, { name: name, type: type, status: status }];
                }
                else {
                    status = "INVALID";
                    message = "Document proof is invalid";
                    reason = {
                        code: OpenAttestationDocumentSignedCode.DOCUMENT_PROOF_INVALID,
                        codeString: OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode.DOCUMENT_PROOF_INVALID],
                        message: message,
                    };
                    return [2 /*return*/, { name: name, type: type, status: status, reason: reason }];
                }
            }
            catch (e) {
                data = e;
                message = e.message;
                status = "ERROR";
                reason = {
                    code: OpenAttestationDocumentSignedCode.DOCUMENT_PROOF_ERROR,
                    codeString: OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode.DOCUMENT_PROOF_ERROR],
                    message: message,
                };
                return [2 /*return*/, { name: name, type: type, data: data, reason: reason, status: status }];
            }
            return [2 /*return*/];
        });
    }); },
};
