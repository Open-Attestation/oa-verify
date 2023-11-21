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
export const documentGoerliValidWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "64158d51-eafe-4729-9906-9d6c30d316e3:string:SGCNM21566325",
    $template: {
      name: "a86bd538-8e50-4ce8-a399-ac7ae1e55279:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "7d1d7b85-3d49-4516-9fb7-d58f6840017a:string:EMBEDDED_RENDERER",
      url: "b52c809d-bbc2-426c-94d2-a1a0b1a26982:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "907a1495-7c10-43cb-8aab-54e3ad8fefea:string:DEMO STORE",
        documentStore: "38229e0e-9ae6-401f-a80e-8a6c2166a42a:string:0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
        identityProof: {
          type: "7efb0791-788b-425c-b16d-4b6de3da428c:string:DNS-TXT",
          location: "73b5c847-99f8-44f2-ba8d-1a0f36cc9c6f:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "2d74acae-9ede-4b1a-83ed-3b3347a89475:string:SG FREIGHT",
      address: {
        street: "81ac9def-b249-4b0e-ac41-4905a364dee0:string:101 ORCHARD ROAD",
        country: "dd94c51b-1567-4f33-81dd-a4266558a46b:string:SINGAPORE",
      },
    },
    consignment: {
      description: "ec926c9f-7ba5-4ee2-8bb1-c5e8a503f14c:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "d5f4854f-6aa2-4d5d-bca3-625f04f7e782:string:5000",
        unit: "bb2432e2-3487-4fbd-8c7e-ee9ba01c87e5:string:LITRES",
      },
      countryOfOrigin: "2bfbb0c3-8da0-4aee-9859-030399ed8d1d:string:AUSTRALIA",
      outwardBillNo: "a1c730a9-a9c8-46e0-b50a-b3af5ebce1bc:string:AQSIQ170923130",
      dateOfDischarge: "8a53a611-ab41-426a-94cf-895211ea81f2:string:2018-01-26",
      dateOfDeparture: "905f5dfd-00ae-498f-8622-1c11118b52d9:string:2018-01-30",
      countryOfFinalDestination: "a90adff1-7156-406c-81b5-2820bd32813d:string:CHINA",
      outgoingVehicleNo: "8a5a76bb-0879-4775-9436-ad41c5e4114d:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "2ed2103d-a0b0-4eac-b22f-e69b37b4b669:string:PETER LEE",
      designation: "1e3008e3-bbed-486c-a0dd-1b5630c0964c:string:SHIPPING MANAGER",
      date: "e6c1ec4a-e8ad-49b9-a1dc-98c60953fbc9:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "9ece474bfd087cf3fc2e7fcf62f82af22cd8ae6a68ff40d7992b6335399309b4",
    proof: [],
    merkleRoot: "9ece474bfd087cf3fc2e7fcf62f82af22cd8ae6a68ff40d7992b6335399309b4",
  },
};
