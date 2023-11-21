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
}
export const documentNotIssuedWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "2d67702d-039a-4911-b88c-c28e744ded1c:string:SGCNM21566325",
    $template: {
      name: "8b74a7f5-f162-4f3a-9a89-b91cd363f53a:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "d0352270-90df-414c-85c0-99ce0d2c7997:string:EMBEDDED_RENDERER",
      url: "4158c318-83cc-4ebf-b84c-2984b5c97322:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "f31f87fd-9140-434c-92cc-51f3dad46255:string:DEMO STORE",
        documentStore: "9ae80379-ee30-44ea-8ed6-b2e7c0971b19:string:0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
        identityProof: {
          type: "a0a15cab-b612-4374-90e5-649f82237509:string:DNS-TXT",
          location: "3cf0e135-5018-479f-8482-32fea82e9715:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "c266b92b-5216-454f-a853-1da726ea3bf5:string:SG FREIGHT",
      address: {
        street: "9a5e5fb2-daec-4f35-9f00-915366857568:string:101 ORCHARD ROAD",
        country: "e9cb2f52-4504-4c22-8f1c-3ef5361e44ce:string:SINGAPORE",
      },
    },
    consignment: {
      description: "77c016a7-bd4e-4814-a161-aa2092caa441:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "f862b235-e797-42cf-985b-e5cb5d5a3b02:string:5000",
        unit: "b310de39-0a16-439e-a2c0-2220d57ddf87:string:LITRES",
      },
      countryOfOrigin: "b6817140-a5bf-4e68-afb8-4f9e15e13ab3:string:AUSTRALIA",
      outwardBillNo: "8ad8ac57-5693-435c-947f-d002458c7d93:string:AQSIQ170923130",
      dateOfDischarge: "024670de-9e20-4356-a3af-0465a3d7337b:string:2018-01-26",
      dateOfDeparture: "436e251b-5018-4827-a45b-f7a7f226c539:string:2018-01-30",
      countryOfFinalDestination: "823b70bd-1aa5-49e6-8374-278ebec07013:string:CHINA",
      outgoingVehicleNo: "2893dd44-1e77-444f-b3de-2061f5e65481:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "63557bd5-8d82-49e3-9d60-78c962cccb26:string:PETER LEE",
      designation: "2083ddc4-e2ad-4f92-9162-a48556024ba9:string:SHIPPING MANAGER",
      date: "79b715af-95f6-432f-b0ab-8476cf2f14d3:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "c23ebdac0fd3a5e5c37a7b29bc3a82bdd1dd85ea8fbe648576ea2c9fb52ef925",
    proof: [],
    merkleRoot: "c23ebdac0fd3a5e5c37a7b29bc3a82bdd1dd85ea8fbe648576ea2c9fb52ef925",
  },
};
