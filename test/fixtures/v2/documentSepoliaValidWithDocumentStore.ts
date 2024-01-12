import { SchemaId, v2, WrappedDocument } from "@govtechsg/open-attestation";

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
export const documentSepoliaValidWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "6a9a0e45-7b09-4c8c-933e-409f55acb145:string:SGCNM21566325",
    $template: {
      name: "2085aace-ba19-431b-b4bc-ca2bec489563:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "52b5e2ab-da61-4599-88a7-c0ab066b0b07:string:EMBEDDED_RENDERER",
      url: "337fe730-80eb-4080-9b5b-7e35b07f54d8:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "d12889fd-2d24-4dba-89bc-6de0a6df675a:string:DEMO STORE",
        documentStore: "f1282337-7568-45a8-9bf6-c29801791142:string:0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
        identityProof: {
          type: "16633ebc-4b3e-435c-9e26-438078f0fa78:string:DNS-TXT",
          location: "21786152-ca4f-4b4a-b804-67f9c8783b9c:string:example.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "19b7cb01-f9ec-425f-9992-90074f41815f:string:SG FREIGHT",
      address: {
        street: "c4c51a20-e52b-4784-940b-a91add9f20f5:string:101 ORCHARD ROAD",
        country: "858481a0-3276-433e-9eda-a8b9ad7c4aa2:string:SINGAPORE",
      },
    },
    consignment: {
      description: "ab5405b4-0534-4f26-afea-d96a5b709522:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "941d6c0f-05f1-41ef-886f-99b5953939d1:string:5000",
        unit: "21dc4836-5c06-4b1f-a248-f6a31e03f725:string:LITRES",
      },
      countryOfOrigin: "2e51461c-1069-4f12-80a3-63db382a6258:string:AUSTRALIA",
      outwardBillNo: "a95e464f-1c2b-4a01-9d36-e9570be82370:string:AQSIQ170923130",
      dateOfDischarge: "d9f82d1e-983e-4cc3-b37e-70c9a13d27ce:string:2018-01-26",
      dateOfDeparture: "1606016d-fff0-4c28-9062-b39b66d6f458:string:2018-01-30",
      countryOfFinalDestination: "8758072c-9d2b-4e32-890b-0322cfe2e96f:string:CHINA",
      outgoingVehicleNo: "9caa9ea6-03d6-4194-ba1a-8512a9adabf4:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "b5715e69-616b-431c-963f-96a04f43e4ee:string:PETER LEE",
      designation: "5e1990dc-bf38-4d0c-bc9c-da80ff49f487:string:SHIPPING MANAGER",
      date: "94300ada-aa3c-49c7-bdf7-a65a36691136:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "105d3543d5f7575081a231e822d9e24284656d5d8894b52478edf8f0b3ab3435",
    proof: [],
    merkleRoot: "105d3543d5f7575081a231e822d9e24284656d5d8894b52478edf8f0b3ab3435",
  },
};
