import { errors } from "ethers";
import {
  OpenAttestationEthereumDocumentStoreIssuedCode,
  EthersError,
  OpenAttestationContract,
  Reason,
  Hash
} from "../../types/core";

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
const contractNotIssued = (merkleRoot: Hash, address: string): Reason => {
  return {
    code: OpenAttestationEthereumDocumentStoreIssuedCode.DOCUMENT_NOT_ISSUED,
    codeString:
      OpenAttestationEthereumDocumentStoreIssuedCode[
        OpenAttestationEthereumDocumentStoreIssuedCode.DOCUMENT_NOT_ISSUED
      ],
    message: `Certificate ${merkleRoot} has not been issued under contract ${address}`
  };
};

const getErrorReason = (error: EthersError, address: string): Reason => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  if (reason.toLowerCase() === "contract not deployed".toLowerCase() && error.code === errors.UNSUPPORTED_OPERATION) {
    return contractNotFound(address);
  } else if (
    reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
    error.code === errors.UNSUPPORTED_OPERATION
  ) {
    return contractAddressInvalid(address);
  }
  return {
    message: `Erreur with smart contract ${address}: ${error.reason}`,
    code: OpenAttestationEthereumDocumentStoreIssuedCode.ETHERS_UNHANDLED_ERROR,
    codeString:
      OpenAttestationEthereumDocumentStoreIssuedCode[
        OpenAttestationEthereumDocumentStoreIssuedCode.ETHERS_UNHANDLED_ERROR
      ]
  };
};

export const isIssuedOnDocumentStore = async (smartContract: OpenAttestationContract, hash: Hash) => {
  return smartContract.instance.functions
    .isIssued(hash)
    .then((issued: boolean) => {
      const reason = !issued ? { reason: contractNotIssued(hash, smartContract.address) } : {};
      return {
        address: smartContract.address,
        issued,
        ...reason
      };
    })
    .catch(e => ({
      address: smartContract.address,
      issued: false,
      reason: getErrorReason(e, smartContract.address)
    }));
};
