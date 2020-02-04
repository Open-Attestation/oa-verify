import { errors } from "ethers";
import {
  EthersError,
  Hash,
  OpenAttestationEthereumDocumentStoreIssuedCode,
  OpenAttestationEthereumDocumentStoreRevokedCode,
  Reason
} from "../..";

const contractNotFound = (address: Hash): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreIssuedCode.CONTRACT_NOT_FOUND,
    codeString:
      OpenAttestationEthereumDocumentStoreIssuedCode[OpenAttestationEthereumDocumentStoreIssuedCode.CONTRACT_NOT_FOUND],
    message: `Contract ${address} was not found`
  };
};
const contractAddressInvalid = (address: Hash): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreIssuedCode.CONTRACT_ADDRESS_INVALID,
    codeString:
      OpenAttestationEthereumDocumentStoreIssuedCode[
        OpenAttestationEthereumDocumentStoreIssuedCode.CONTRACT_ADDRESS_INVALID
      ],
    message: `Contract address ${address} is invalid`
  };
};
export const contractNotIssued = (merkleRoot: Hash, address: string): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreIssuedCode.DOCUMENT_NOT_ISSUED,
    codeString:
      OpenAttestationEthereumDocumentStoreIssuedCode[
        OpenAttestationEthereumDocumentStoreIssuedCode.DOCUMENT_NOT_ISSUED
      ],
    message: `Certificate ${merkleRoot} has not been issued under contract ${address}`
  };
};

export const contractRevoked = (merkleRoot: string, address: string): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreRevokedCode.DOCUMENT_REVOKED,
    codeString:
      OpenAttestationEthereumDocumentStoreRevokedCode[OpenAttestationEthereumDocumentStoreRevokedCode.DOCUMENT_REVOKED],
    message: `Certificate ${merkleRoot} has been revoked under contract ${address}`
  };
};

export const getErrorReason = (error: EthersError, address: string): Reason | null => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  if (reason.toLowerCase() === "contract not deployed".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) {
    return contractNotFound(address);
  } else if (
    (reason.toLowerCase() === "ENS name not configured".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) ||
    (reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT) ||
    (reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT)
  ) {
    return contractAddressInvalid(address);
  }
  return {
    message: `Error with smart contract ${address}: ${error.reason}`,
    code: OpenAttestationEthereumDocumentStoreIssuedCode.ETHERS_UNHANDLED_ERROR,
    codeString:
      OpenAttestationEthereumDocumentStoreIssuedCode[
        OpenAttestationEthereumDocumentStoreIssuedCode.ETHERS_UNHANDLED_ERROR
      ]
  };
};
