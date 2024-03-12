import { Contract, providers } from "ethers";

export const getDocumentStore = (address: string, provider: providers.Provider) => {
  return new Contract(
    address,
    [
      "function isIssued(bytes32) view returns(bool)",
      "function isIssued(bytes32,bytes32,bytes32[]) view returns(bool)",
      "function isRevoked(bytes32) view returns(bool)",
      "function isRevoked(bytes32,bytes32,bytes32[]) view returns(bool)",
      "function supportsInterface(bytes4) view returns(bool)",
    ],
    provider
  );
};

export const getTransferableDocumentStore = (address: string, provider: providers.Provider) => {
  return new Contract(address, ["function ownerOf(uint256) view returns(address)"], provider);
};
