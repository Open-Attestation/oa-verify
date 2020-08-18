import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    name: string;
    issuedOn: string;
    description: string;
    admissionDate: string;
    graduationDate: string;
    transcript: any;
    cumulativeScore: string;
    additionalData: any;
    issuers: {
        url: string;
        name: string;
        certificateStore: string;
        uen: string;
        email: string;
    }[];
    recipient: {
        name: string;
        nric: string;
    };
}
export declare const documentRopstenNotIssuedWithCertificateStore: WrappedDocument<CustomDocument>;
export {};
