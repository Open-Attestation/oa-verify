import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

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
  certification: any;
}
export const documentHederaValidWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    $template: {
      name: "6bc6b7da-bf1d-4d54-a445-58c8534f622e:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "ea285365-edda-458e-a5d9-581f8534b8a2:string:EMBEDDED_RENDERER",
      url: "9fd7ef5f-24ee-44cb-b9ee-f1f0e5c558fb:string:https://demo-cnm.openattestation.com",
    },
    recipient: {
      name: "3af83dd0-b2b3-474f-b951-2e22b31d7aad:string:XYZ",
      address: {
        street: "f1ca022a-3f6b-4024-8d59-88816c5d7c87:string:42 BRIGADE ROAD",
        country: "28b0ecca-e376-467a-b828-1b78627cd7d8:string:INDIA",
      },
    },
    issuers: [
      {
        name: "f233558c-e011-446a-84bb-701b16010257:string:Demo Issuer",
        documentStore: "d478a47d-d9d3-4879-82b8-3643b332c82d:string:0x222B69788e2e9B7FB93a3a0fE258D4604Dc7df21",
        identityProof: {
          type: "c0624592-af6c-436d-87a2-f4d02c277a60:string:DNS-TXT",
          location: "5da286bd-6c42-4054-859e-e5661e78f306:string:trustlv.org",
        },
      },
    ],
    consignment: {
      description: "a371ecb9-e01f-4a57-bf00-b5704fba6fbc:string:16667 RED WINE",
      quantity: {
        value: "b45e8a3e-df98-4f5a-a2e0-5c780e57d648:string:1000",
        unit: "21e2659e-a9a3-4d5f-95a9-32073c6e2d1d:string:LITRES",
      },
      countryOfOrigin: "0a58ba84-e35f-498d-b6e5-45d3ee48b519:string:INDIA",
      outwardBillNo: "d78a523f-0819-4faa-8816-836427b20905:string:AQSIQ170923130",
      dateOfDischarge: "0c6b0ef9-9418-43fb-944d-f5060c6557f4:string:2024-03-01",
      dateOfDeparture: "ecb4655f-2c38-4965-8816-bce9d657f69f:string:2024-03-20",
      countryOfFinalDestination: "32c8a550-bc72-488b-adfe-2df38b821671:string:SINGAPORE",
      outgoingVehicleNo: "66dfd2c9-0052-4cd3-9962-6f35c9600ec1:string:COSCO SING 074E/01-MAR",
    },
    declaration: {
      name: "0df36d67-fe76-436a-8cfd-3338a96e3b74:string:JOHN",
      designation: "165d2b71-cca9-46f3-9d9e-dede1bbd6e42:string:SHIPPING MANAGER",
      date: "1efca0d5-9792-4134-8e74-ec3e0c0ff292:string:2024-03-01",
    },
    certification: {
      name: "3a1d00f0-b519-4d16-a4ce-e101cf66f667:string:DEMO JOHN TAN",
      designation: "cc543b1d-9a7d-4366-ad21-b4f31a9ce173:string:DEMO",
      date: "48b90f5c-37d2-4ff1-800d-45b8160eddd7:string:2024-03-01",
      signature:
        "57069b0b-7261-484e-af49-d0daeeaeee5e:string:data:image/png;base64,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",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "f3488cf45a2d0cee14d28a115787daf1521fafadbf5617a1f04183ab90c8be71",
    proof: ["c6d865ac5803a8d7cbaba58136d14c0b832de06af2e899829b1a73913e4dd9f3"],
    merkleRoot: "139576d4803d4220368446c0f6f2803a702ccf8a93dd529596f17b96a647a524",
  },
};
