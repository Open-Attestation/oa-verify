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

// This function handles ALL of Ethers SERVER_ERRORs, most likely caused by HTTP 4xx or 5xx errors.
export const serverError = (): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR,
    codeString:
      OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR],
    message: `Unable to connect to the Ethereum network, please try again later`,
  };
};

// This function handles all INVALID_ARGUMENT errors likely due to invalid hex string,
// hex data is odd-length or incorrect data length
export const invalidArgument = (): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ARGUMENT,
    codeString:
      OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ARGUMENT],
    message: `Document has been tampered with`,
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
  } else if (error.code === errors.SERVER_ERROR) {
    return serverError();
  } else if (error.code === errors.INVALID_ARGUMENT) {
    return invalidArgument();
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
