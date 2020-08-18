import { errors } from "ethers";
import { EthersError, Hash, OpenAttestationEthereumDocumentStoreStatusCode, Reason } from "../..";

const contractNotFound = (address: Hash): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_NOT_FOUND,
    codeString:
      OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_NOT_FOUND],
    message: `Contract ${address} was not found`,
  };
};
const contractAddressInvalid = (address: Hash): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_ADDRESS_INVALID,
    codeString:
      OpenAttestationEthereumDocumentStoreStatusCode[
        OpenAttestationEthereumDocumentStoreStatusCode.CONTRACT_ADDRESS_INVALID
      ],
    message: `Contract address ${address} is invalid`,
  };
};
export const contractNotIssued = (merkleRoot: Hash, address: string): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED,
    codeString:
      OpenAttestationEthereumDocumentStoreStatusCode[
        OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED
      ],
    message: `Document ${merkleRoot} has not been issued under contract ${address}`,
  };
};

export const contractRevoked = (merkleRoot: string, address: string): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED,
    codeString:
      OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED],
    message: `Document ${merkleRoot} has been revoked under contract ${address}`,
  };
};

/**
 * This function handles all non-200 HTTP response codes (e.g. Infura/Cloudflare rate limits, Cloudflare's random 502)
 * @param address the document store address
 * TODO: Add the same for tokenStore
 */
export const badResponse = (): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreStatusCode.BAD_RESPONSE,
    codeString:
      OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.BAD_RESPONSE],
    message: `Unable to connect to Ethereum, please try again later`,
  };
};

export const getErrorReason = (error: EthersError, address: string): Reason | null => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  if (
    !error.reason &&
    (error.method?.toLowerCase() === "isRevoked(bytes32)".toLowerCase() ||
      error.method?.toLowerCase() === "isIssued(bytes32)".toLowerCase()) &&
    error.code === errors.CALL_EXCEPTION
  ) {
    return contractNotFound(address);
  } else if (
    (reason.toLowerCase() === "ENS name not configured".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) ||
    (reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT) ||
    error.message?.toLowerCase() === "name not found".toLowerCase() ||
    (reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT)
  ) {
    return contractAddressInvalid(address);
  } else if (reason.toLowerCase() === "bad response".toLowerCase()) {
    return badResponse();
  }

  return {
    message: `Error with smart contract ${address}: ${error.reason}`,
    code: OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR,
    codeString:
      OpenAttestationEthereumDocumentStoreStatusCode[
        OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR
      ],
  };
};
