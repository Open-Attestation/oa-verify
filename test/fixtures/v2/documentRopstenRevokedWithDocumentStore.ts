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

export const documentRopstenRevokedWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: "open-attestation/2.0",
  schema: "tradetrust/1.0",
  data: {
    id: "2d009858-5cbe-4a53-9238-78edfcaa22a3:string:SGCNM21566325",
    $template: {
      name: "df1b7a98-26d6-44dc-8f65-08e7d1de4100:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "4261059f-b9d4-4e79-8c84-334f47e0d070:string:EMBEDDED_RENDERER",
      url: "ceb47f0a-3d15-432e-bd66-5d4acd75baba:string:https://demo-cnm.openattestation.com"
    },
    issuers: [
      {
        name: "218e3c44-18f5-4909-9e06-e1eac05f273d:string:DEMO STORE",
        documentStore: "0c837c55-4948-4a5a-9ed3-801889db9ce3:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        identityProof: {
          type: "57a806ca-12e9-4d52-ab9f-7e9ff74bc872:string:DNS-TXT",
          location: "6a7095d4-f60a-41f0-8938-9cb396470c9d:string:tradetrust.io"
        }
      }
    ],
    recipient: {
      name: "4aa92c0f-820b-40a1-8cc0-93c1b8b1fb1f:string:SG FREIGHT",
      address: {
        street: "ba754f2a-6b62-4443-a664-1a83b1cc3f4c:string:101 ORCHARD ROAD",
        country: "062f5eec-3df3-42f7-88ea-e8ea19b4a66b:string:SINGAPORE"
      }
    },
    consignment: {
      description: "75d3a97a-f18a-4e44-8c64-e051c596c16f:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "71fe3d14-b0bd-4c92-9e51-1455da34d229:number:5000",
        unit: "fddb014d-0a16-4b85-afd8-b22b19738d94:string:LITRES"
      },
      countryOfOrigin: "c0be92ee-2c08-4913-9d85-8f5df7aa4883:string:AUSTRALIA",
      outwardBillNo: "fbe1cc50-6fb4-47cf-9e32-e4eb7eaa0a93:string:AQSIQ170923130",
      dateOfDischarge: "f3f50a8d-ed6f-47d9-9998-564831972b85:string:2018-01-26",
      dateOfDeparture: "1379698f-bba4-4347-93cc-e89a15bb457d:string:2018-01-30",
      countryOfFinalDestination: "e0efc67f-248f-4b7b-8468-85ba2ff5110a:string:CHINA",
      outgoingVehicleNo: "ef4a9c1c-6226-4b7b-9608-e18871b39c73:string:COSCO JAPAN 074E/30-JAN"
    },
    declaration: {
      name: "d53b7b92-40b4-4690-afbe-46834acf55c6:string:PETER LEE",
      designation: "1e4dd60e-5d6d-465b-aaac-7d4391acb852:string:SHIPPING MANAGER",
      date: "09ef644f-840a-4466-b962-05ad2db9bfbb:string:2018-01-28"
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "6ea1365618a53e0b68206ecc56ffe3e069ab93a45a73649aba8654fe730c3beb",
    proof: ["0ba68e33cd0e0c051a510e129cd922d2cca3378939c3fe17ec1e25fba7a9b154"],
    merkleRoot: "3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e452"
  }
};
