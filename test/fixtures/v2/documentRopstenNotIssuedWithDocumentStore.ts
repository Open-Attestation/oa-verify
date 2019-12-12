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
export const documentRopstenNotIssuedWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: "open-attestation/2.0",
  schema: "tradetrust/1.0",
  data: {
    id: "9a76d74a-eac9-4c59-a72a-5c186b4267c1:string:SGCNM21566325",
    $template: {
      name: "ec893f79-3032-4911-9edb-49295aa482d4:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "33a3c4df-7bf0-47d6-8d7c-cecf3cc03dd1:string:EMBEDDED_RENDERER",
      url: "b85c08fd-7d99-4cf2-896b-d9d1ad227560:string:https://demo-cnm.openattestation.com"
    },
    issuers: [
      {
        name: "4dbbc572-639d-4030-921f-42dd827c5013:string:DEMO STORE",
        documentStore: "409e4698-7dad-4171-823b-cd226a9749c2:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        identityProof: {
          type: "ed9ad37c-17ad-4ce7-a900-8d74c951a666:string:DNS-TXT",
          location: "21866627-4a33-40f8-97d8-0d80d02dddee:string:example.tradetrust.io"
        }
      }
    ],
    recipient: {
      name: "2c1f3d7f-d696-47d4-90a5-8b6ee25be70e:string:SG FREIGHT",
      address: {
        street: "d7bc78c0-8207-4c76-928d-de9ab3767aeb:string:101 ORCHARD ROAD",
        country: "f8ad1e99-7ef8-444d-b89f-4131ad55454a:string:SINGAPORE"
      }
    },
    consignment: {
      description: "4b8e8dbe-8577-464f-8f29-b56be86eea34:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "e60d438d-3379-4030-a2c3-b70ab6285e6d:number:5000",
        unit: "dfbd56fb-ecc0-4dbd-b303-0c8764335798:string:LITRES"
      },
      countryOfOrigin: "688b24a9-20fc-485b-928d-a59276274c34:string:AUSTRALIA",
      outwardBillNo: "594335c6-794b-42e4-aa01-4a3fa354f159:string:AQSIQ170923130",
      dateOfDischarge: "08cd4fd9-d9af-4c50-9b0a-580660214385:string:2018-01-26",
      dateOfDeparture: "3b512cca-1f93-4c18-87c6-40258bb4ca02:string:2018-01-30",
      countryOfFinalDestination: "43bdf6f1-6f28-44c4-b988-031b70861532:string:CHINA",
      outgoingVehicleNo: "30cc4dd9-2464-4ba2-9942-c1fe5f54e75e:string:COSCO JAPAN 074E/30-JAN"
    },
    declaration: {
      name: "ed1fb785-0ede-430a-a9c6-fb17884f50ec:string:PETER LEE",
      designation: "e5db20b5-2e41-4297-b6f6-06b44b063f7d:string:SHIPPING MANAGER",
      date: "23ac8608-8e9e-483e-885b-1cb070eacf36:string:2018-01-28"
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "da7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d",
    proof: [],
    merkleRoot: "da7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d"
  }
};
