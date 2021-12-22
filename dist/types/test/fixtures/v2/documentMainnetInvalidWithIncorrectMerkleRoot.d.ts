import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    recipient: {
        name: string;
        address: {
            street: string;
            country: string;
        };
    };
    certification: any;
    consignment: any;
    declaration: any;
}
export declare const documentMainnetInvalidWithIncorrectMerkleRoot: WrappedDocument<CustomDocument>;
export {};
