import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    name: string;
}
export declare const documentRinkebyValidWithDocumentStore: WrappedDocument<CustomDocument>;
export declare const documentRinkebyRevokedWithDocumentStore: WrappedDocument<CustomDocument>;
export {};
