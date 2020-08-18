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
exports.openAttestationEthereumTokenRegistryStatus = void 0;
var open_attestation_1 = require("@govtechsg/open-attestation");
var token_registry_1 = require("@govtechsg/token-registry");
var ethers_1 = require("ethers");
var error_1 = require("../../types/error");
var errors_1 = require("./errors");
var utils_1 = require("../../common/utils");
var name = "OpenAttestationEthereumTokenRegistryStatus";
var type = "DOCUMENT_STATUS";
exports.openAttestationEthereumTokenRegistryStatus = {
    skip: function () {
        return Promise.resolve({
            status: "SKIPPED",
            type: type,
            name: name,
            reason: {
                code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.SKIPPED,
                codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.SKIPPED],
                message: "Document issuers doesn't have \"tokenRegistry\" property or " + open_attestation_1.v3.Method.TokenRegistry + " method",
            },
        });
    },
    test: function (document) {
        if (open_attestation_1.utils.isWrappedV3Document(document)) {
            var documentData_1 = open_attestation_1.getData(document);
            return documentData_1.proof.method === open_attestation_1.v3.Method.TokenRegistry;
        }
        var documentData = open_attestation_1.getData(document);
        return documentData.issuers.some(function (issuer) { return "tokenRegistry" in issuer; });
    },
    verify: function (document, options) { return __awaiter(void 0, void 0, void 0, function () {
        var tokenRegistries, merkleRoot_1, statuses, notMinted, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    tokenRegistries = utils_1.getIssuersTokenRegistry(document);
                    if (tokenRegistries.length > 1) {
                        throw new Error("Only one token registry is allowed. Found " + tokenRegistries.length);
                    }
                    merkleRoot_1 = "0x" + document.signature.merkleRoot;
                    return [4 /*yield*/, Promise.all(tokenRegistries.map(function (tokenRegistry) { return __awaiter(void 0, void 0, void 0, function () {
                            var tokenRegistryContract, minted, status, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, token_registry_1.TradeTrustErc721Factory.connect(tokenRegistry, utils_1.getProvider(options))];
                                    case 1:
                                        tokenRegistryContract = _a.sent();
                                        return [4 /*yield*/, tokenRegistryContract
                                                .ownerOf(merkleRoot_1)
                                                .then(function (owner) { return !(owner === ethers_1.constants.AddressZero); })];
                                    case 2:
                                        minted = _a.sent();
                                        status = {
                                            minted: minted,
                                            address: tokenRegistry,
                                        };
                                        if (!minted) {
                                            status.reason = errors_1.contractNotMinted(merkleRoot_1, tokenRegistry);
                                        }
                                        return [2 /*return*/, status];
                                    case 3:
                                        e_2 = _a.sent();
                                        return [2 /*return*/, { minted: false, address: tokenRegistry, reason: errors_1.getErrorReason(e_2, tokenRegistry, merkleRoot_1) }];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    statuses = _a.sent();
                    notMinted = statuses.find(function (status) { return !status.minted; });
                    if (notMinted) {
                        return [2 /*return*/, {
                                name: name,
                                type: type,
                                data: { mintedOnAll: false, details: open_attestation_1.utils.isWrappedV3Document(document) ? statuses[0] : statuses },
                                reason: notMinted.reason,
                                status: "INVALID",
                            }];
                    }
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: { mintedOnAll: true, details: open_attestation_1.utils.isWrappedV3Document(document) ? statuses[0] : statuses },
                            status: "VALID",
                        }];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, {
                            name: name,
                            type: type,
                            data: e_1,
                            reason: {
                                message: e_1.message,
                                code: error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNEXPECTED_ERROR,
                                codeString: error_1.OpenAttestationEthereumTokenRegistryStatusCode[error_1.OpenAttestationEthereumTokenRegistryStatusCode.UNEXPECTED_ERROR],
                            },
                            status: "ERROR",
                        }];
                case 3: return [2 /*return*/];
            }
        });
    }); },
};
