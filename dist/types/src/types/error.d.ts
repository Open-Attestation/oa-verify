export declare enum OpenAttestationEthereumDocumentStoreStatusCode {
    UNEXPECTED_ERROR = 0,
    DOCUMENT_NOT_ISSUED = 1,
    CONTRACT_ADDRESS_INVALID = 2,
    ETHERS_UNHANDLED_ERROR = 3,
    SKIPPED = 4,
    DOCUMENT_REVOKED = 5,
    CONTRACT_NOT_FOUND = 404,
    BAD_RESPONSE = 500
}
export declare enum OpenAttestationDocumentSignedCode {
    UNEXPECTED_ERROR = 0,
    DOCUMENT_PROOF_INVALID = 1,
    DOCUMENT_PROOF_ERROR = 2,
    SKIPPED = 4
}
export declare enum OpenAttestationEthereumTokenRegistryStatusCode {
    UNEXPECTED_ERROR = 0,
    DOCUMENT_NOT_MINTED = 1,
    CONTRACT_ADDRESS_INVALID = 2,
    ETHERS_UNHANDLED_ERROR = 3,
    SKIPPED = 4,
    CONTRACT_NOT_FOUND = 404,
    BAD_RESPONSE = 500
}
export declare enum OpenAttestationDnsTxtCode {
    UNEXPECTED_ERROR = 0,
    INVALID_IDENTITY = 1,
    SKIPPED = 2
}
export declare enum OpenAttestationHashCode {
    DOCUMENT_TAMPERED = 0
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
