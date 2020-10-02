import * as ethers from "ethers";
import { getData, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { INFURA_API_KEY } from "../config";

export const getProvider = (options: { network: string }): ethers.providers.Provider =>
  process.env.ETHEREUM_PROVIDER === "cloudflare"
    ? new ethers.providers.CloudflareProvider()
    : new ethers.providers.InfuraProvider(options.network, INFURA_API_KEY);

export const getIssuersDocumentStore = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string[] => {
  if (utils.isWrappedV2Document(document)) {
    const data = getData(document);
    return data.issuers.map((issuer) => issuer.documentStore || issuer.certificateStore || "");
  }
  return [getData(document).proof.value];
};

export const getIssuersTokenRegistry = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string[] => {
  if (utils.isWrappedV2Document(document)) {
    const data = getData(document);
    return data.issuers.map((issuer) => issuer.tokenRegistry || "");
  }
  return [getData(document).proof.value];
};
