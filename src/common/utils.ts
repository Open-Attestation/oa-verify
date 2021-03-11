import { v2, v3, WrappedDocument, utils } from "@govtechsg/open-attestation";
import { providers } from "ethers";
import { VerificationBuilderOptions, VerificationBuilderOptionsWithNetwork } from "../types/core";
import { INFURA_API_KEY } from "../config";

export const getDefaultProvider = (options: VerificationBuilderOptionsWithNetwork): providers.Provider => {
  return new providers.InfuraProvider(options.network, INFURA_API_KEY);
};

export const getProvider = (options: VerificationBuilderOptions): providers.Provider => {
  return "provider" in options ? options.provider : getDefaultProvider(options);
};

export const isObfuscated = (
  document: WrappedDocument<v3.OpenAttestationDocument> | WrappedDocument<v2.OpenAttestationDocument>
): boolean => {
  if (utils.isWrappedV3Document(document)) {
    return !!document.proof.privacy?.obfuscated?.length;
  }

  if (utils.isWrappedV2Document(document)) {
    return !!document.privacy?.obfuscatedData?.length;
  }

  throw new Error(
    "Unsupported document type: Only can retrieve isObfuscated from wrapped OpenAttestation v2 & v3 documents."
  );
};

export const getObfuscatedData = (
  document: WrappedDocument<v3.OpenAttestationDocument> | WrappedDocument<v2.OpenAttestationDocument>
): string[] | undefined => {
  if (utils.isWrappedV3Document(document)) {
    return document.proof.privacy?.obfuscated;
  }

  if (utils.isWrappedV2Document(document)) {
    return document.privacy?.obfuscatedData;
  }

  throw new Error(
    "Unsupported document type: Only can retrieve obfuscated data from wrapped OpenAttestation v2 & v3 documents."
  );
};
