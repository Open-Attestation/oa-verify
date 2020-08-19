import { v2, WrappedDocument } from "@govtechsg/open-attestation";
interface CustomDocument extends v2.OpenAttestationDocument {
    recipient: {
        name: string;
        address: {
            street: string;
            country: string;
        };
    };
    consignment: {
        description: string;
        quantity: {
            value: string;
            unit: string;
        };
        countryOfOrigin: string;
        outwardBillNo: string;
        dateOfDischarge: string;
        dateOfDeparture: string;
        countryOfFinalDestination: string;
        outgoingVehicleNo: "string";
    };
    declaration: {
        name: string;
        designation: string;
        date: string;
    };
}
export declare const documentRopstenRevokedWithToken: WrappedDocument<CustomDocument>;
export {};
