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
export const documentRopstenNotIssuedWithTokenRegistry: WrappedDocument<CustomDocument> = {
  version: "open-attestation/2.0",
  schema: "tradetrust/1.0",
  data: {
    id: "db133c39-46f6-42a1-b0c3-f481bc90d5ee:string:SGCNM21566325",
    $template: {
      name: "de06c1e2-dcc0-47ab-9bc9-574803bc7c43:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "222deccd-6393-4f4c-a9aa-9c8617b584a2:string:EMBEDDED_RENDERER",
      url: "3d2323d6-71cb-41bc-8905-d37d1ba6262d:string:https://demo-cnm.openattestation.com"
    },
    issuers: [
      {
        name: "b7c8cc05-0f07-4c97-b0f7-081ef8ce6198:string:DEMO STORE",
        tokenRegistry: "0fb5b63a-aaa5-4e6e-a6f4-391c0f6ba423:string:0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
        identityProof: {
          type: "47d6a222-1d7a-42fe-977d-b20c03f8a7b0:string:DNS-TXT",
          location: "7688c75e-4ac6-4fca-b1a7-8ccadbe5fe57:string:example.tradetrust.io"
        }
      }
    ],
    recipient: {
      name: "67d36f24-2b77-4337-bcab-f9e0459d3159:string:SG FREIGHT",
      address: {
        street: "08345dd7-5377-4c3d-9155-f13c88b89f43:string:101 ORCHARD ROAD",
        country: "66c7f51d-abcd-4209-8c6b-f10d5f8359d9:string:SINGAPORE"
      }
    },
    consignment: {
      description: "cfc81683-f04f-40ae-bdd6-92a959cf34c0:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "33336811-5bfd-4d3c-990e-a81e27392aea:number:5000",
        unit: "b483c062-0eca-4c4d-823b-71b3f8b4fc6f:string:LITRES"
      },
      countryOfOrigin: "bdbff22e-6390-44d1-bf48-21ccbabcbaa4:string:AUSTRALIA",
      outwardBillNo: "784d7e51-35a6-4ba6-b392-1ccf318139a4:string:AQSIQ170923130",
      dateOfDischarge: "bb641121-57ba-4267-b02b-d1c4fb816ed9:string:2018-01-26",
      dateOfDeparture: "b11ad0c2-f136-4937-927b-16011a62f739:string:2018-01-30",
      countryOfFinalDestination: "ae328907-00b9-4c68-92a5-03a0f314a66d:string:CHINA",
      outgoingVehicleNo: "336f0865-3d20-4bba-8775-641264cec70a:string:COSCO JAPAN 074E/30-JAN"
    },
    declaration: {
      name: "dd9a4139-9404-405c-a057-c4438f3a02a3:string:PETER LEE",
      designation: "6f437248-78a6-4954-b6e1-d9de5c33ebcc:string:SHIPPING MANAGER",
      date: "84bce922-d91d-4047-8e22-fec7bbeb2056:string:2018-01-28"
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "693c86fbb8f75ac56f865f5b3100e545875f2154b3749bdcf448c874a1d67ef3",
    proof: [],
    merkleRoot: "693c86fbb8f75ac56f865f5b3100e545875f2154b3749bdcf448c874a1d67ef3"
  }
};
