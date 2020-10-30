import * as ethers from "ethers";
import { INFURA_API_KEY } from "../config";

export const getProvider = (options: { network: string }): ethers.providers.Provider =>
  process.env.ETHEREUM_PROVIDER === "cloudflare"
    ? new ethers.providers.CloudflareProvider()
    : new ethers.providers.InfuraProvider(options.network, INFURA_API_KEY);
