import * as ethers from "ethers";
import { v3, WrappedDocument } from "@govtechsg/open-attestation";
import { INFURA_API_KEY } from "../../config";
import { getIssuedBlock } from "./getIssuedBlock";

/**
 * Retrieve the account that sent the transaction to issue this document.
 * This is the address that will be used to authenticate the didDoc against.
 * Get the event log and then pull the tx.origin from the transaction receipt.
 */
export const getDocumentIssuer = async (
  contract: ethers.Contract,
  documentStoreAddress: string,
  document: WrappedDocument<v3.OpenAttestationDocument>,
  network: string
): Promise<string> => {
  const provider = new ethers.providers.InfuraProvider(network, INFURA_API_KEY);
  const documentHash = `0x${document.signature.merkleRoot}`;
  const { topics } = contract.filters.DocumentIssued(documentHash);
  const fromBlock = await getIssuedBlock(contract, documentHash);
  const toBlock = fromBlock;
  const address = documentStoreAddress;

  return new Promise((resolve, reject) => {
    provider.getLogs({ fromBlock, toBlock, address, topics }).then(async (result: any) => {
      if (result.length === 1) {
        const tx = await provider.getTransactionReceipt(result[0].transactionHash);
        resolve(tx?.from?.toLowerCase());
        // Sanity checks... should NOT be possible to hit these... issued twice or no event emitted
      } else if (result.length > 1) {
        reject(new Error(`There is more than one event for the issuance of this document: ${documentHash}`));
      } else {
        reject(new Error("No logs found for the issuance of this document..."));
      }
    });
  });
};
