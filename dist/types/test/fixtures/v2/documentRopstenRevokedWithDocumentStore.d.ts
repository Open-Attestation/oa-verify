import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    recipient: {
        name: string;
        address: {
            street: string;
            country: string;
        };
    };
    consignment: any;
    declaration: any;
}
export declare const documentRopstenRevokedWithDocumentStore: WrappedDocument<CustomDocument>;
export {};
