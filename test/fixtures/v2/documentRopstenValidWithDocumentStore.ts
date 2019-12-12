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
export const documentRopstenValidWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: "open-attestation/2.0",
  schema: "tradetrust/1.0",
  data: {
    id: "7c89df24-c28d-4807-a1cd-abbc917f14ec:string:SGCNM21566325",
    $template: {
      name: "cde68ddb-5d1b-444c-a40d-708575706884:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "16586a2a-fbb4-4afb-a7c5-3dac13b8663e:string:EMBEDDED_RENDERER",
      url: "d1d00871-c7bb-4d8f-b3ad-2f51fac760f7:string:https://demo-cnm.openattestation.com"
    },
    issuers: [
      {
        name: "9f2c0997-4913-46e9-8b35-3b4b48ad0d93:string:DEMO STORE",
        documentStore: "93aef98e-b830-4c45-89f8-d38fc66a68fb:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        identityProof: {
          type: "e73b9b80-2ce0-49c6-bec4-7d814e4c58f8:string:DNS-TXT",
          location: "9b7231eb-e707-4417-b2a0-9ecbc88f312a:string:example.tradetrust.io"
        }
      }
    ],
    recipient: {
      name: "881f0e3b-eb60-462d-9032-d1f05b3d376a:string:SG FREIGHT",
      address: {
        street: "300747db-f71e-4bdc-a973-63a739335830:string:101 ORCHARD ROAD",
        country: "44ca8729-c8f9-4c56-a7ba-d0995b8e19dc:string:SINGAPORE"
      }
    },
    consignment: {
      description: "758d090e-9933-4ba9-bbc2-8c131a18a81d:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "8fd8f4ba-bec7-4a73-ae6a-14e78fa0c716:number:5000",
        unit: "ef64db97-2f27-43fa-8ecd-346dc163e678:string:LITRES"
      },
      countryOfOrigin: "551e50e9-f1ec-4da0-ac05-7d75a76661d5:string:AUSTRALIA",
      outwardBillNo: "8748ef72-9c6a-4c57-b059-d5e87c3fa4b0:string:AQSIQ170923130",
      dateOfDischarge: "2a0bbd3d-6fa2-4b77-87f3-91febc8ceba6:string:2018-01-26",
      dateOfDeparture: "c1d657a3-960d-4f79-9483-44e8929892f7:string:2018-01-30",
      countryOfFinalDestination: "8dcdff63-d762-41f4-82a0-6167761c21a0:string:CHINA",
      outgoingVehicleNo: "c2542c68-1e5f-4ef2-8dfd-a0a7f68b0a1e:string:COSCO JAPAN 074E/30-JAN"
    },
    declaration: {
      name: "878d8a71-0398-4f99-8866-b92818112eb0:string:PETER LEE",
      designation: "1787737a-944e-4a62-8f7e-ad2313403b6e:string:SHIPPING MANAGER",
      date: "07ab2cc7-664b-4c15-930b-aff8ae1e06a9:string:2018-01-28"
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "f079c4321fe7c1990c338167a9776299d523e5097309af340f66412d17e8da28",
    proof: [],
    merkleRoot: "f079c4321fe7c1990c338167a9776299d523e5097309af340f66412d17e8da28"
  }
};
