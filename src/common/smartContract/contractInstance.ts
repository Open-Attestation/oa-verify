import * as ethers from "ethers";
import { INFURA_API_KEY } from "../../config";
import { Hash } from "../../types/core";

interface ContractInstance {
  abi: any; // type is any of json file in abi folder
  network: string;
  contractAddress: Hash;
}

export const getProvider = (options: { network: string }): ethers.providers.Provider =>
  process.env.ETHEREUM_PROVIDER === "cloudflare"
    ? new ethers.providers.CloudflareProvider()
    : new ethers.providers.InfuraProvider(options.network, process.env.INFURA_API_KEY || INFURA_API_KEY);

export const contractInstance = (options: ContractInstance) => {
  return new ethers.Contract(options.contractAddress, options.abi, getProvider(options));
};
