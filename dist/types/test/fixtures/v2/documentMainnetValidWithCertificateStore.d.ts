import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    name: string;
    issuedOn: string;
    $template: string;
    recipient: {
        name: string;
    };
}
export declare const documentMainnetValidWithCertificateStore: WrappedDocument<CustomDocument>;
export {};
