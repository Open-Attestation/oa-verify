import { v2, WrappedDocument } from "@govtechsg/open-attestation";
import { providers } from "ethers";
import { Verifier } from "../../../types/core";
import { DocumentStoreIssuanceStatus, OpenAttestationEthereumDocumentStoreStatusFragment } from "./ethereumDocumentStoreStatus.type";
declare type VerifierType = Verifier<OpenAttestationEthereumDocumentStoreStatusFragment>;
export declare const getIssuersDocumentStores: (document: WrappedDocument<v2.OpenAttestationDocument>) => string[];
export declare const isIssuedOnDocumentStore: ({ documentStore, merkleRoot, provider, }: {
    documentStore: string;
    merkleRoot: string;
    provider: providers.Provider;
}) => Promise<DocumentStoreIssuanceStatus>;
export declare const openAttestationEthereumDocumentStoreStatus: VerifierType;
export {};
