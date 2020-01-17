import * as ethers from "ethers";
import { INFURA_API_KEY } from "../../config";
import { Hash } from "../../types/core";
import { getLogger } from "../logger";

const logger = getLogger("contractInstance");
interface ContractInstance {
  abi: any; // type is any of json file in abi folder
  network: string;
  contractAddress: Hash;
}

export const getProvider = (options: { network: string }): ethers.providers.Provider =>
  new ethers.providers.InfuraProvider(options.network, INFURA_API_KEY);

export const contractInstance = (options: ContractInstance) => {
  const contract = new ethers.Contract(options.contractAddress, options.abi, getProvider(options));

  // this is done to prevent uncaught exception to raise because an address is invalid
  contract.addressPromise.catch(() => {
    logger.trace(
      `oa-verify caught an error from ethers when trying to resolve the address of the provided address ${options.contractAddress}`
    );
  });
  return contract;
};
