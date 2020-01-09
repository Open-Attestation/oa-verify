import { Contract } from "ethers";

// Cleaning up the error message if the document has not been issued.
export const getIssuedBlock = async (contract: Contract, documentHash: string) => {
  try {
    return (await contract.getIssuedBlock(documentHash)).toNumber();
  } catch (e) {
    throw new Error(`Document has not been issued... ${documentHash}`);
  }
};
