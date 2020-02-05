// NEVER EVER REPLACE OR CHANGE A VALUE :)
// code for errors and invalid fragment
export enum OpenAttestationEthereumDocumentStoreIssuedCode {
  UNEXPECTED_ERROR = 0,
  DOCUMENT_NOT_ISSUED = 1,
  CONTRACT_ADDRESS_INVALID = 2,
  ETHERS_UNHANDLED_ERROR = 3,
  SKIPPED = 4,
  CONTRACT_NOT_FOUND = 404
}
export enum OpenAttestationEthereumDocumentStoreRevokedCode {
  UNEXPECTED_ERROR = 0,
  DOCUMENT_REVOKED = 1,
  CONTRACT_ADDRESS_INVALID = 2,
  ETHERS_UNHANDLED_ERROR = 3,
  SKIPPED = 4,
  CONTRACT_NOT_FOUND = 404
}
export enum OpenAttestationEthereumTokenRegistryMintedCode {
  UNEXPECTED_ERROR = 0,
  DOCUMENT_NOT_MINTED = 1,
  CONTRACT_ADDRESS_INVALID = 2,
  ETHERS_UNHANDLED_ERROR = 3,
  SKIPPED = 4,
  CONTRACT_NOT_FOUND = 404
}
export enum OpenAttestationDnsTxtCode {
  UNEXPECTED_ERROR = 0,
  INVALID_IDENTITY = 1,
  SKIPPED = 2
}
export enum OpenAttestationHashCode {
  DOCUMENT_TAMPERED = 0
}

export interface EthersError extends Error {
  reason?: string | string[];
  code?: string;
}

export interface Reason {
  code: number;
  codeString: string;
  message: string;
}
