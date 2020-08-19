import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";
import { Hash, Verifier } from "../../types/core";
interface IssuanceStatus {
    issued: boolean;
    address: string;
    reason?: any;
}
interface RevocationStatus {
    revoked: boolean;
    address: string;
    reason?: any;
}
export interface DocumentStoreStatusFragment {
    issuedOnAll: boolean;
    revokedOnAny?: boolean;
    details: {
        issuance: IssuanceStatus | IssuanceStatus[];
        revocation?: RevocationStatus | RevocationStatus[];
    };
}
export declare const isAnyHashRevoked: (smartContract: DocumentStore, intermediateHashes: Hash[]) => Promise<string | undefined>;
export declare const openAttestationEthereumDocumentStoreStatus: Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;
export {};
