// NEVER EVER REPLACE OR CHANGE A VALUE :)
// code for errors and invalid fragment
export enum OpenAttestationEthereumDocumentStoreStatusCode {
  UNEXPECTED_ERROR = 0,
  DOCUMENT_NOT_ISSUED = 1,
  CONTRACT_ADDRESS_INVALID = 2,
  ETHERS_UNHANDLED_ERROR = 3,
  SKIPPED = 4,
  DOCUMENT_REVOKED = 5,
  INVALID_ARGUMENT = 6,
  CONTRACT_NOT_FOUND = 404,
  INVALID_ISSUERS = 7,
  INVALID_VALIDATION_METHOD = 8,
  UNRECOGNIZED_DOCUMENT = 9,
  SERVER_ERROR = 500,
}
export enum OpenAttestationDocumentSignedCode {
  UNEXPECTED_ERROR = 0,
  DOCUMENT_PROOF_INVALID = 1,
  DOCUMENT_PROOF_ERROR = 2,
  SKIPPED = 4,
}
export enum OpenAttestationEthereumTokenRegistryStatusCode {
  UNEXPECTED_ERROR = 0,
  DOCUMENT_NOT_MINTED = 1,
  CONTRACT_ADDRESS_INVALID = 2,
  ETHERS_UNHANDLED_ERROR = 3,
  SKIPPED = 4,
  INVALID_ISSUERS = 5,
  INVALID_ARGUMENT = 6,
  UNDEFINED_TOKEN_REGISTRY = 7,
  INVALID_VALIDATION_METHOD = 8,
  UNRECOGNIZED_DOCUMENT = 9,
  SERVER_ERROR = 500,
}
export enum OpenAttestationDnsTxtCode {
  UNEXPECTED_ERROR = 0,
  INVALID_IDENTITY = 1,
  SKIPPED = 2,
  INVALID_ISSUERS = 3,
  MATCHING_RECORD_NOT_FOUND = 4,
  UNRECOGNIZED_DOCUMENT = 5,
  UNSUPPORTED = 6,
}
export enum OpenAttestationHashCode {
  DOCUMENT_TAMPERED = 0,
  UNEXPECTED_ERROR = 1,
  SKIPPED = 2,
}
export enum OpenAttestationDidSignedDocumentStatusCode {
  SKIPPED = 0,
  UNEXPECTED_ERROR = 1,
  MISSING_REVOCATION = 2,
  UNSIGNED = 3,
  INVALID_ISSUERS = 4,
  MALFORMED_IDENTITY_PROOF = 5,
  CORRESPONDING_PROOF_MISSING = 6,
  DID_MISSING = 7,
  UNRECOGNIZED_DOCUMENT = 8,
  UNRECOGNIZED_REVOCATION_TYPE = 9,
  REVOCATION_LOCATION_MISSING = 10,
}
export enum OpenAttestationDidCode {
  SKIPPED = 0,
  UNEXPECTED_ERROR = 1,
  INVALID_ISSUERS = 2,
  MALFORMED_IDENTITY_PROOF = 3,
  DID_MISSING = 4,
  UNSIGNED = 5,
  UNRECOGNIZED_DOCUMENT = 6,
}
export enum OpenAttestationDnsDidCode {
  SKIPPED = 0,
  UNEXPECTED_ERROR = 1,
  MALFORMED_IDENTITY_PROOF = 2,
  INVALID_ISSUERS = 3,
  UNSIGNED = 4,
  UNRECOGNIZED_DOCUMENT = 5,
}
export enum OpenAttestationSignatureCode {
  UNEXPECTED_ERROR = 0,
  KEY_MISSING = 1,
  DID_MISSING = 3,
  KEY_NOT_IN_DID = 4,
  UNSUPPORTED_KEY_TYPE = 6,
  WRONG_SIGNATURE = 7,
}

export interface EthersError extends Error {
  reason?: string | string[];
  code?: string;
  method?: string;
}

export interface Reason {
  code: number;
  codeString: string;
  message: string;
}
