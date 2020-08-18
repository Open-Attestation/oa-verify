"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssuersTokenRegistry = exports.getIssuersDocumentStore = exports.getProvider = void 0;
var ethers = __importStar(require("ethers"));
var open_attestation_1 = require("@govtechsg/open-attestation");
var config_1 = require("../config");
exports.getProvider = function (options) {
    return process.env.ETHEREUM_PROVIDER === "cloudflare"
        ? new ethers.providers.CloudflareProvider()
        : new ethers.providers.InfuraProvider(options.network, process.env.INFURA_API_KEY || config_1.INFURA_API_KEY);
};
exports.getIssuersDocumentStore = function (document) {
    if (open_attestation_1.utils.isWrappedV2Document(document)) {
        var data = open_attestation_1.getData(document);
        return data.issuers.map(function (issuer) { return issuer.documentStore || issuer.certificateStore || ""; });
    }
    return [open_attestation_1.getData(document).proof.value];
};
exports.getIssuersTokenRegistry = function (document) {
    if (open_attestation_1.utils.isWrappedV2Document(document)) {
        var data = open_attestation_1.getData(document);
        return data.issuers.map(function (issuer) { return issuer.tokenRegistry || ""; });
    }
    return [open_attestation_1.getData(document).proof.value];
};
