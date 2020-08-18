import * as ethers from "ethers";
import { getData, utils } from "@govtechsg/open-attestation";
import { INFURA_API_KEY } from "../config";
export var getProvider = function (options) {
    return process.env.ETHEREUM_PROVIDER === "cloudflare"
        ? new ethers.providers.CloudflareProvider()
        : new ethers.providers.InfuraProvider(options.network, process.env.INFURA_API_KEY || INFURA_API_KEY);
};
export var getIssuersDocumentStore = function (document) {
    if (utils.isWrappedV2Document(document)) {
        var data = getData(document);
        return data.issuers.map(function (issuer) { return issuer.documentStore || issuer.certificateStore || ""; });
    }
    return [getData(document).proof.value];
};
export var getIssuersTokenRegistry = function (document) {
    if (utils.isWrappedV2Document(document)) {
        var data = getData(document);
        return data.issuers.map(function (issuer) { return issuer.tokenRegistry || ""; });
    }
    return [getData(document).proof.value];
};
