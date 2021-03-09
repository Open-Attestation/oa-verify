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

interface Obfuscated {
  isOfuscated: boolean;
  obfuscated?: string[];
}

export const getObfuscated = (
  document: WrappedDocument<v3.OpenAttestationDocument> | WrappedDocument<v2.OpenAttestationDocument>
): Obfuscated => {
  if (utils.isWrappedV3Document(document)) {
    return {
      isOfuscated: !!document.proof.privacy?.obfuscated?.length,
      obfuscated: document.proof.privacy?.obfuscated,
    };
  }

  if (utils.isWrappedV2Document(document)) {
    return {
      isOfuscated: !!document.privacy?.obfuscatedData?.length,
      obfuscated: document.privacy?.obfuscatedData,
    };
  }

  return { isOfuscated: false, obfuscated: undefined };
};
