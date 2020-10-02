import { errors } from "ethers";
import { Hash } from "../../../types/core";
import { EthersError, OpenAttestationEthereumTokenRegistryStatusCode, Reason } from "../../../types/error";

const contractNotFound = (address: Hash): Reason => {
  return {
    code: OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_NOT_FOUND,
    codeString:
      OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_NOT_FOUND],
    message: `Contract ${address} was not found`,
  };
};

const contractAddressInvalid = (address: Hash): Reason => {
  return {
    code: OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_ADDRESS_INVALID,
    codeString:
      OpenAttestationEthereumTokenRegistryStatusCode[
        OpenAttestationEthereumTokenRegistryStatusCode.CONTRACT_ADDRESS_INVALID
      ],
    message: `Contract address ${address} is invalid`,
  };
};

export const contractNotMinted = (merkleRoot: Hash, address: string): Reason => {
  return {
    code: OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
    codeString:
      OpenAttestationEthereumTokenRegistryStatusCode[
        OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED
      ],
    message: `Document ${merkleRoot} has not been issued under contract ${address}`,
  };
};

// This function handles ALL of Ethers SERVER_ERRORs, most likely caused by HTTP 4xx or 5xx errors.
export const serverError = (): Reason => {
  return {
    code: OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR,
    codeString:
      OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR],
    message: `Unable to connect to the Ethereum network, please try again later`,
  };
};

// This function handles all INVALID_ARGUMENT errors likely due to invalid hex string,
// hex data is odd-length or incorrect data length
export const invalidArgument = (error: EthersError, address: string): Reason => {
  return {
    code: OpenAttestationEthereumTokenRegistryStatusCode.INVALID_ARGUMENT,
    codeString:
      OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.INVALID_ARGUMENT],
    message: `Error with smart contract ${address}: ${error.reason}`,
  };
};

export const getErrorReason = (error: EthersError, address: string, hash: Hash): Reason => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  if (
    reason.toLowerCase() === "ERC721: owner query for nonexistent token".toLowerCase() &&
    error.code === errors.CALL_EXCEPTION
  ) {
    return contractNotMinted(hash, address);
  } else if (
    !error.reason &&
    error.method?.toLowerCase() === "ownerOf(uint256)".toLowerCase() &&
    error.code === errors.CALL_EXCEPTION
  ) {
    return contractNotFound(address);
  } else if (
    (reason.toLowerCase() === "ENS name not configured".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) ||
    (reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT) ||
    (reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT)
  ) {
    return contractAddressInvalid(address);
  } else if (error.code === errors.SERVER_ERROR) {
    return serverError();
  } else if (error.code === errors.INVALID_ARGUMENT) {
    return invalidArgument(error, address);
  }

  return {
    message: `Error with smart contract ${address}: ${error.reason}`,
    code: OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR,
    codeString:
      OpenAttestationEthereumTokenRegistryStatusCode[
        OpenAttestationEthereumTokenRegistryStatusCode.ETHERS_UNHANDLED_ERROR
      ],
  };
};
