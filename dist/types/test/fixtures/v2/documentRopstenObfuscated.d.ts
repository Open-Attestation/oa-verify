import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    name: string;
    description: string;
    issuedOn: string;
    admissionDate: string;
    graduationDate: string;
    transcript: any;
    additionalData: any;
    issuers: [
        {
            name: string;
            url: string;
            documentStore: string;
            identityProof: any;
        }
    ];
}
export declare const documentRopstenObfuscated: WrappedDocument<CustomDocument>;
export {};
