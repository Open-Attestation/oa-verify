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

export const documentRopstenValidWithToken: WrappedDocument<CustomDocument> = {
  version: "open-attestation/2.0",
  schema: "tradetrust/1.0",
  data: {
    id: "b8b9fca9-72f1-4791-864f-a5d3cfd1f404:string:SGCNM21566325",
    $template: {
      name: "9adcfa01-3527-4692-acbc-b1ab308130a6:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "61586ceb-37a9-4f0c-8761-06c4d0a02c9b:string:EMBEDDED_RENDERER",
      url: "335dc559-d6fc-4f2b-89c1-36755681bf11:string:https://demo-cnm.openattestation.com"
    },
    issuers: [
      {
        name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
        tokenRegistry: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
        identityProof: {
          type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
          location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io"
        }
      }
    ],
    recipient: {
      name: "ece7891f-4cfe-459f-a494-e83b75e524a8:string:SG FREIGHT",
      address: {
        street: "c6e0f32e-c476-4814-8fbd-4b7a2a0c5c6a:string:101 ORCHARD ROAD",
        country: "dff21713-d236-4102-89e8-1763203fee6f:string:SINGAPORE"
      }
    },
    consignment: {
      description: "308332ea-f9e9-43e8-8cb0-5cf792d44955:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "a87d60df-c38a-4767-9bdb-8d41dedb077e:number:5000",
        unit: "002482cb-d013-463e-bf2e-936c4dfff68f:string:LITRES"
      },
      countryOfOrigin: "4ebfc8ff-6101-4883-ac5c-76514aac797f:string:AUSTRALIA",
      outwardBillNo: "57df16c9-0236-453c-8bbb-066b8d98b63f:string:AQSIQ170923130",
      dateOfDischarge: "3eec5024-ccd8-44e3-a161-8f1f2dfb6c36:string:2018-01-26",
      dateOfDeparture: "650c0b23-7d72-4c4d-95d2-77900fc2c7c7:string:2018-01-30",
      countryOfFinalDestination: "eb58116d-a39e-4575-8bf2-95a1fce474b8:string:CHINA",
      outgoingVehicleNo: "9a812d15-dca8-44fd-ad6a-fe0a551ab11e:string:COSCO JAPAN 074E/30-JAN"
    },
    declaration: {
      name: "2531c7d6-b3df-4354-af94-f6dc262e8b1f:string:PETER LEE",
      designation: "839fb522-6e2d-4c59-bade-75d082f25174:string:SHIPPING MANAGER",
      date: "ea169e5f-33da-4422-b5c9-8e77cc5fed6e:string:2018-01-28"
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "1b2c07f3d77078b44e65eae4c7f5d17fefaf0f73fb3f338fdb410912a8c4c4b7",
    proof: [],
    merkleRoot: "1b2c07f3d77078b44e65eae4c7f5d17fefaf0f73fb3f338fdb410912a8c4c4b7"
  }
};
