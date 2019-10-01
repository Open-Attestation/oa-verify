import * as ethers from "ethers";
import * as abi from "./smartContract/abi/documentStore.json";
import { INFURA_API_KEY } from "../config";
import { Hash } from "../types";

interface DocumentStore {
  network: string;
  storeAddress: Hash;
  method: string;
  args: any;
}
export const documentStore = async ({
  network,
  storeAddress,
  method,
  args
}: DocumentStore) => {
  const provider = new ethers.providers.InfuraProvider(network, INFURA_API_KEY);
  const contract = new ethers.Contract(storeAddress, abi, provider);
  return contract.functions[method](...args);
};
