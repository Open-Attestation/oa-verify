import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    name: string;
    issuedOn: string;
    transcript: any;
    issuers: {
        url: string;
        name: string;
        certificateStore: string;
    }[];
    recipient: {
        name: string;
        email: string;
        phone: string;
    };
}
export declare const document: WrappedDocument<CustomDocument>;
export {};
