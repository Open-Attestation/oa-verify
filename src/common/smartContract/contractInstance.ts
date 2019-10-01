import * as ethers from "ethers";
import { INFURA_API_KEY } from "../../config";
import { Hash } from "../../types";

interface ContractInstance {
  abi: any; // type is any of json file in abi folder
  network: string;
  contractAddress: Hash;
}
export const contractInstance = ({
  abi,
  network,
  contractAddress
}: ContractInstance) => {
  const provider = new ethers.providers.InfuraProvider(network, INFURA_API_KEY);
  return new ethers.Contract(contractAddress, abi, provider);
};
