import * as ethers from "ethers";
import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
export declare const getProvider: (options: {
    network: string;
}) => ethers.providers.Provider;
export declare const getIssuersDocumentStore: (document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>) => string[];
export declare const getIssuersTokenRegistry: (document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>) => string[];
