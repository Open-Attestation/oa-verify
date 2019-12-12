import { WrappedDocument } from "@govtechsg/open-attestation";

export const documentRopstenRevokedWithToken: WrappedDocument = {
  version: "open-attestation/2.0",
  schema: "tradetrust/1.0",
  data: {
    id: "834a20bd-4d5c-4f3a-a080-f3f834420384:string:SGCNM21566325",
    $template: {
      name: "873fd4e8-1d9f-401d-92c6-6c40db495491:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "8f6f8119-f85d-4f8f-9696-4c3a942e0b07:string:EMBEDDED_RENDERER",
      url: "a3c7a619-491e-4a0b-8bb7-eef3277d9b28:string:https://demo-cnm.openattestation.com"
    },
    issuers: [
      {
        name: "31e6be0b-7190-4560-84ff-2155d36b9f54:string:DEMO STORE",
        tokenRegistry: "9610d97f-e52a-43c6-986c-35293655e489:string:0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
        identityProof: {
          type: "cc980ec2-297e-4dac-9a66-2f11b1fc3f78:string:DNS-TXT",
          location: "70d10f15-2669-40c0-8cce-22cd56b0d23a:string:tradetrust.io"
        }
      }
    ],
    recipient: {
      name: "5c2f325b-db44-4283-93bd-596a2b6020d9:string:SG FREIGHT",
      address: {
        street: "9890c629-2d79-4b25-a1ca-f0e1a6749bea:string:101 ORCHARD ROAD",
        country: "d96dfe67-f65b-4d2c-9341-7751bf453a9c:string:SINGAPORE"
      }
    },
    consignment: {
      description: "2ea2e970-4a73-4e74-ae9d-b6f459a33849:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "57d27b61-46cb-4695-970a-f1eab0a23a1c:number:5000",
        unit: "d5fc89ab-9d0d-4ea0-bce9-e4388b1ee045:string:LITRES"
      },
      countryOfOrigin: "08241b90-9aed-4229-9b83-a6cc56a1174d:string:AUSTRALIA",
      outwardBillNo: "47616244-898f-419c-9b03-96f585411cb1:string:AQSIQ170923130",
      dateOfDischarge: "439c416c-bb85-403d-8d1a-57d59b5fc07b:string:2018-01-26",
      dateOfDeparture: "36b4d9b1-0f85-4dd1-af00-8b9718663eba:string:2018-01-30",
      countryOfFinalDestination: "1346832a-45f4-467c-ac0d-ff7b6fd60848:string:CHINA",
      outgoingVehicleNo: "1a771225-8f5b-4a49-91bd-800d4beedfec:string:COSCO JAPAN 074E/30-JAN"
    },
    declaration: {
      name: "9f0f0431-c9d9-45bf-9562-0daa9fc2068a:string:PETER LEE",
      designation: "e9ea18f2-a050-4c25-99de-c4a7a0d18eda:string:SHIPPING MANAGER",
      date: "389227b4-d776-43d7-9712-698efc1b8480:string:2018-01-28"
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef",
    proof: [],
    merkleRoot: "1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef"
  }
};
