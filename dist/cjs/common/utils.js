"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.unhandledError = exports.serverError = exports.invalidArgument = exports.certificateRevoked = exports.certificateNotIssued = exports.contractNotFound = exports.isDocumentStoreAddressOrTokenRegistryAddressInvalid = exports.isErrorFragment = exports.isSkippedFragment = exports.isInvalidFragment = exports.isValidFragment = exports.getIssuerIdentityFragments = exports.getDocumentStatusFragments = exports.getDocumentIntegrityFragments = exports.getOpenAttestationDnsTxtIdentityProofFragment = exports.getOpenAttestationDnsDidIdentityProofFragment = exports.getOpenAttestationDidIdentityProofFragment = exports.getOpenAttestationEthereumTokenRegistryStatusFragment = exports.getOpenAttestationEthereumDocumentStoreStatusFragment = exports.getOpenAttestationDidSignedDocumentStatusFragment = exports.getOpenAttestationHashFragment = exports.getFragmentByName = exports.generateProvider = exports.getProvider = exports.getDefaultProvider = void 0;
var ethers_1 = require("ethers");
var config_1 = require("../config");
var error_1 = require("../types/error");
var messages_1 = require("../common/messages");
var getDefaultProvider = function (options) {
    var network = options.network || process.env.PROVIDER_NETWORK || "homestead";
    var providerType = process.env.PROVIDER_ENDPOINT_TYPE || "infura";
    var apiKey = process.env.PROVIDER_API_KEY || (providerType === "infura" && config_1.INFURA_API_KEY) || "";
    // create infura provider to get connection information
    // we then use StaticJsonRpcProvider so that we can set our own custom limit
    var uselessProvider = exports.generateProvider({
        providerType: providerType,
        network: network,
        apiKey: apiKey,
    });
    var connection = __assign(__assign({}, uselessProvider.connection), { throttleLimit: 3 });
    return new ethers_1.providers.StaticJsonRpcProvider(connection, network);
};
exports.getDefaultProvider = getDefaultProvider;
// getProvider is a function to get an existing provider or to get a Default provider, when given the options
var getProvider = function (options) {
    var _a;
    return (_a = options.provider) !== null && _a !== void 0 ? _a : exports.getDefaultProvider(options);
};
exports.getProvider = getProvider;
/**
 * Generate Provider generates a provider based on the defined options or your env var, if no options or env var was detected, it will generate a provider based on the default values.
 * Generate Provider using the following options: (if no option is specified it will use the default values)
 * @param {Object} ProviderDetails - Details to use for the function to successfully generate a provider.
 * @param {string} ProviderDetails.network - The network in which the provider is connected to, i.e. "homestead", "mainnet", "ropsten", "rinkeby"
 * @param {string} ProviderDetails.providerType - Specify which provider to use: "infura", "alchemy" or "jsonrpc"
 * @param {string} ProviderDetails.url - Specify which url for JsonRPC to connect to, if not specified will connect to localhost:8545
 * @param {string} ProviderDetails.apiKey - If no apiKey is provided, a default shared API key will be used, which may result in reduced performance and throttled requests.
 */
var generateProvider = function (options) {
    if (!!options && Object.keys(options).length === 1 && options.apiKey) {
        throw new Error("We could not link the apiKey provided to a provider, please state the provider to use in the parameter.");
    }
    var network = (options === null || options === void 0 ? void 0 : options.network) || process.env.PROVIDER_NETWORK || "homestead";
    var provider = (options === null || options === void 0 ? void 0 : options.providerType) || process.env.PROVIDER_ENDPOINT_TYPE || "infura";
    var url = (options === null || options === void 0 ? void 0 : options.url) || process.env.PROVIDER_ENDPOINT_URL || "";
    var apiKey = (options === null || options === void 0 ? void 0 : options.apiKey) || (provider === "infura" && process.env.INFURA_API_KEY) || process.env.PROVIDER_API_KEY || "";
    !apiKey && console.warn(messages_1.warnProvider);
    if (!!options && Object.keys(options).length === 1 && url) {
        return new ethers_1.providers.JsonRpcProvider(url);
    }
    switch (provider) {
        case "infura":
            return apiKey ? new ethers_1.providers.InfuraProvider(network, apiKey) : new ethers_1.providers.InfuraProvider(network);
        case "alchemy":
            return apiKey ? new ethers_1.providers.AlchemyProvider(network, apiKey) : new ethers_1.providers.AlchemyProvider(network);
        case "jsonrpc":
            return new ethers_1.providers.JsonRpcProvider(url);
        default:
            throw new Error("The provider provided is not on the list of providers. Please use one of the following: infura, alchemy or jsonrpc.");
    }
};
exports.generateProvider = generateProvider;
/**
 * Simple typed utility to return a fragment depending on the name
 * @param name
 */
var getFragmentByName = function (name) { return function (fragments) { return fragments.find(function (fragment) { return fragment.name === name; }); }; };
exports.getFragmentByName = getFragmentByName;
exports.getOpenAttestationHashFragment = exports.getFragmentByName("OpenAttestationHash");
exports.getOpenAttestationDidSignedDocumentStatusFragment = exports.getFragmentByName("OpenAttestationDidSignedDocumentStatus");
exports.getOpenAttestationEthereumDocumentStoreStatusFragment = exports.getFragmentByName("OpenAttestationEthereumDocumentStoreStatus");
exports.getOpenAttestationEthereumTokenRegistryStatusFragment = exports.getFragmentByName("OpenAttestationEthereumTokenRegistryStatus");
exports.getOpenAttestationDidIdentityProofFragment = exports.getFragmentByName("OpenAttestationDidIdentityProof");
exports.getOpenAttestationDnsDidIdentityProofFragment = exports.getFragmentByName("OpenAttestationDnsDidIdentityProof");
exports.getOpenAttestationDnsTxtIdentityProofFragment = exports.getFragmentByName("OpenAttestationDnsTxtIdentityProof");
/**
 * Simple typed utility to return fragments depending on the type
 */
var getFragmentByType = function (type) { return function (fragments) { return fragments.filter(function (fragment) { return fragment.type === type; }); }; };
exports.getDocumentIntegrityFragments = getFragmentByType("DOCUMENT_INTEGRITY");
exports.getDocumentStatusFragments = getFragmentByType("DOCUMENT_STATUS");
exports.getIssuerIdentityFragments = getFragmentByType("ISSUER_IDENTITY");
var isValidFragment = function (fragment) {
    return (fragment === null || fragment === void 0 ? void 0 : fragment.status) === "VALID";
};
exports.isValidFragment = isValidFragment;
var isInvalidFragment = function (fragment) {
    return (fragment === null || fragment === void 0 ? void 0 : fragment.status) === "INVALID";
};
exports.isInvalidFragment = isInvalidFragment;
var isSkippedFragment = function (fragment) {
    return (fragment === null || fragment === void 0 ? void 0 : fragment.status) === "SKIPPED";
};
exports.isSkippedFragment = isSkippedFragment;
var isErrorFragment = function (fragment) {
    return (fragment === null || fragment === void 0 ? void 0 : fragment.status) === "ERROR";
};
exports.isErrorFragment = isErrorFragment;
// this function check if the reason of the error is that the document store or token registry is invalid
var isDocumentStoreAddressOrTokenRegistryAddressInvalid = function (fragments) {
    var _a, _b, _c, _d;
    var documentStoreIssuedFragment = exports.getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
    var tokenRegistryMintedFragment = exports.getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
    // 2 is the error code used by oa-verify in case of invalid address
    return ((((_a = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _a === void 0 ? void 0 : _a.code) === error_1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED &&
        ((_b = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _b === void 0 ? void 0 : _b.message.toLowerCase()) === "Invalid document store address".toLowerCase()) ||
        (((_c = tokenRegistryMintedFragment === null || tokenRegistryMintedFragment === void 0 ? void 0 : tokenRegistryMintedFragment.reason) === null || _c === void 0 ? void 0 : _c.code) === error_1.OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED &&
            ((_d = tokenRegistryMintedFragment === null || tokenRegistryMintedFragment === void 0 ? void 0 : tokenRegistryMintedFragment.reason) === null || _d === void 0 ? void 0 : _d.message.toLowerCase()) === "Invalid token registry address".toLowerCase()));
};
exports.isDocumentStoreAddressOrTokenRegistryAddressInvalid = isDocumentStoreAddressOrTokenRegistryAddressInvalid;
// this function check if the reason of the error is contract not found in document store
var contractNotFound = function (fragments) {
    var _a, _b;
    var documentStoreIssuedFragment = exports.getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
    // 404 is the error code used by oa-verify in case of contract not found
    return (((_a = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _a === void 0 ? void 0 : _a.code) === error_1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED &&
        ((_b = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _b === void 0 ? void 0 : _b.message.toLowerCase()) === "Contract is not found".toLowerCase());
};
exports.contractNotFound = contractNotFound;
// this function check if the reason of the error is that the document is not issued in document store or token registry
var certificateNotIssued = function (fragments) {
    var _a, _b;
    var documentStoreIssuedFragment = exports.getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
    var tokenRegistryMintedFragment = exports.getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
    // 1 is the error code used by oa-verify in case of document / token not issued / minted
    return (((_a = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _a === void 0 ? void 0 : _a.code) === error_1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED ||
        ((_b = tokenRegistryMintedFragment === null || tokenRegistryMintedFragment === void 0 ? void 0 : tokenRegistryMintedFragment.reason) === null || _b === void 0 ? void 0 : _b.code) === error_1.OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED);
};
exports.certificateNotIssued = certificateNotIssued;
// this function check if the reason of the error is that the document is revoked in document store
var certificateRevoked = function (fragments) {
    var _a;
    var documentStoreIssuedFragment = exports.getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
    // 1 is the error code used by oa-verify in case of document / token not issued / minted
    return ((_a = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _a === void 0 ? void 0 : _a.code) === error_1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED;
};
exports.certificateRevoked = certificateRevoked;
// this function check if the error is caused by an invalid merkle root (incorrect length/odd length/invalid characters)
var invalidArgument = function (fragments) {
    var _a, _b, _c, _d;
    var documentStoreIssuedFragment = exports.getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
    var tokenRegistryMintedFragment = exports.getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
    // why INVALID_ARGUMENT is because we follow the error codes returned by Ethers (https://docs.ethers.io/v5/api/utils/logger/#errors)
    return ((((_a = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _a === void 0 ? void 0 : _a.code) === error_1.OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED &&
        ((_b = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _b === void 0 ? void 0 : _b.message.toLowerCase()) === "Invalid call arguments".toLowerCase()) ||
        (((_c = tokenRegistryMintedFragment === null || tokenRegistryMintedFragment === void 0 ? void 0 : tokenRegistryMintedFragment.reason) === null || _c === void 0 ? void 0 : _c.code) === error_1.OpenAttestationEthereumTokenRegistryStatusCode.INVALID_ARGUMENT &&
            ((_d = tokenRegistryMintedFragment === null || tokenRegistryMintedFragment === void 0 ? void 0 : tokenRegistryMintedFragment.reason) === null || _d === void 0 ? void 0 : _d.message.toLowerCase()) === "Invalid contract arguments".toLowerCase()));
};
exports.invalidArgument = invalidArgument;
// this function check if the reason of the error is that we can't connect to Ethereum (due to any HTTP 4xx or 5xx errors)
var serverError = function (fragments) {
    var _a, _b;
    var documentStoreIssuedFragment = exports.getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
    var tokenRegistryMintedFragment = exports.getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
    // 429 is the error code used by oa-verify in case of Ethers returning a missing response error
    return (((_a = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _a === void 0 ? void 0 : _a.code) === error_1.OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR ||
        ((_b = tokenRegistryMintedFragment === null || tokenRegistryMintedFragment === void 0 ? void 0 : tokenRegistryMintedFragment.reason) === null || _b === void 0 ? void 0 : _b.code) === error_1.OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR);
};
exports.serverError = serverError;
// this function catches all other unhandled errors
var unhandledError = function (fragments) {
    var _a, _b;
    var documentStoreIssuedFragment = exports.getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
    var tokenRegistryMintedFragment = exports.getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
    // 3 is the error code used by oa-verify in case of weird errors that we didn't foresee to handle
    return (((_a = documentStoreIssuedFragment === null || documentStoreIssuedFragment === void 0 ? void 0 : documentStoreIssuedFragment.reason) === null || _a === void 0 ? void 0 : _a.code) ===
        error_1.OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR ||
        ((_b = tokenRegistryMintedFragment === null || tokenRegistryMintedFragment === void 0 ? void 0 : tokenRegistryMintedFragment.reason) === null || _b === void 0 ? void 0 : _b.code) === error_1.OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR);
};
exports.unhandledError = unhandledError;
