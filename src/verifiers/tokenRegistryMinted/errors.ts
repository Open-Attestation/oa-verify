import { errors } from "ethers";
import { Hash } from "../../types/core";
import { EthersError, OpenAttestationEthereumTokenRegistryMintedCode, Reason } from "../../types/error";

const contractNotFound = (address: Hash): Reason => {
  return {
    code: OpenAttestationEthereumTokenRegistryMintedCode.CONTRACT_NOT_FOUND,
    codeString:
      OpenAttestationEthereumTokenRegistryMintedCode[OpenAttestationEthereumTokenRegistryMintedCode.CONTRACT_NOT_FOUND],
    message: `Contract ${address} was not found`
  };
};
const contractAddressInvalid = (address: Hash): Reason => {
  return {
    code: OpenAttestationEthereumTokenRegistryMintedCode.CONTRACT_ADDRESS_INVALID,
    codeString:
      OpenAttestationEthereumTokenRegistryMintedCode[
        OpenAttestationEthereumTokenRegistryMintedCode.CONTRACT_ADDRESS_INVALID
      ],
    message: `Contract address ${address} is invalid`
  };
};
export const contractNotMinted = (merkleRoot: Hash, address: string): Reason => {
  return {
    code: OpenAttestationEthereumTokenRegistryMintedCode.DOCUMENT_NOT_MINTED,
    codeString:
      OpenAttestationEthereumTokenRegistryMintedCode[
        OpenAttestationEthereumTokenRegistryMintedCode.DOCUMENT_NOT_MINTED
      ],
    message: `Certificate ${merkleRoot} has not been issued under contract ${address}`
  };
};

export const getErrorReason = (error: EthersError, address: string, hash: Hash): Reason => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  if (reason.toLowerCase() === "contract not deployed".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) {
    return contractNotFound(address);
  } else if (
    (reason.toLowerCase() === "ENS name not configured".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) ||
    (reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT) ||
    (reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT)
  ) {
    return contractAddressInvalid(address);
  } else if (
    reason.toLowerCase() === "ERC721: owner query for nonexistent token".toLowerCase() &&
    error.code === errors.CALL_EXCEPTION
  ) {
    return contractNotMinted(hash, address);
  }
  return {
    message: `Error with smart contract ${address}: ${error.reason}`,
    code: OpenAttestationEthereumTokenRegistryMintedCode.ETHERS_UNHANDLED_ERROR,
    codeString:
      OpenAttestationEthereumTokenRegistryMintedCode[
        OpenAttestationEthereumTokenRegistryMintedCode.ETHERS_UNHANDLED_ERROR
      ]
  };
};
