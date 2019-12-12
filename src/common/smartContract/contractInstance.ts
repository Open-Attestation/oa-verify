import * as ethers from "ethers";
import { INFURA_API_KEY } from "../../config";
import { Hash } from "../../types/core";

interface ContractInstance {
  abi: any; // type is any of json file in abi folder
  network: string;
  contractAddress: Hash;
}
export const contractInstance = (options: ContractInstance) => {
  return new ethers.Contract(
    options.contractAddress,
    options.abi,
    new ethers.providers.InfuraProvider(options.network, INFURA_API_KEY)
  );
};
