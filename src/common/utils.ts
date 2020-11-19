import { providers } from "ethers";
import { VerificationBuilderOptions, VerificationBuilderOptionsWithNetwork } from "../types/core";
import { INFURA_API_KEY } from "../config";

export const getDefaultProvider = (options: VerificationBuilderOptionsWithNetwork): providers.Provider => {
  return new providers.InfuraProvider(options.network, INFURA_API_KEY);
};

export const getProvider = (options: VerificationBuilderOptions): providers.Provider => {
  return "provider" in options ? options.provider : getDefaultProvider(options);
};
