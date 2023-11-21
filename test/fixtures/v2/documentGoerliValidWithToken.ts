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

export const documentGoerliValidWithToken: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  schema: "tradetrust/1.0",
  data: {
    id: "b4b7735f-d839-4b61-8562-682c118620ca:string:SGCNM21566325",
    $template: {
      name: "cdbd9bf8-db70-40ef-a660-04d1446192e0:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "d02fda95-451d-4b49-a438-bb4174d26d1b:string:EMBEDDED_RENDERER",
      url: "cbf5c211-a5df-4d69-a6e4-062d3062fbae:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "60db3167-d701-4580-b4e6-7ec278c1a4e4:string:DEMO STORE",
        tokenRegistry: "241d39b4-fcfb-4ee4-9b61-6cc9ef58a862:string:0x921dC7cEF00155ac3A33f04DA7395324d7809757",
        identityProof: {
          type: "d3417093-acc8-4077-a087-c2d1368e9e0b:string:DNS-TXT",
          location: "53b7dd38-15a4-4430-bed2-f0b39f85dbf1:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "2647df56-1645-4790-8117-c0a7ac4fbb17:string:SG FREIGHT",
      address: {
        street: "484606d0-7d3a-4b50-8afc-dbf11e62bdb3:string:101 ORCHARD ROAD",
        country: "d34931c4-c9f7-4c02-b0a0-a64d138e9fa1:string:SINGAPORE",
      },
    },
    consignment: {
      description: "66a5360a-e6d4-4a57-8852-094c32d3cfe0:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "680a3958-3ca6-4e7d-9bc2-18739cc97a89:string:5000",
        unit: "3ffedb5f-79b0-4630-b512-4a74713f4518:string:LITRES",
      },
      countryOfOrigin: "da7eacec-70c7-4f78-afd9-28bdfc33b29e:string:AUSTRALIA",
      outwardBillNo: "4fdf53a9-03e1-4bf4-8cd6-e79561c78252:string:AQSIQ170923130",
      dateOfDischarge: "a1c27be0-2558-45bc-9083-68522489364e:string:2018-01-26",
      dateOfDeparture: "062a1194-66ff-4006-a21d-6afcea605c32:string:2018-01-30",
      countryOfFinalDestination: "90492aeb-f6f9-4ffc-8421-49976256f60b:string:CHINA",
      outgoingVehicleNo: "f4b92304-6202-4c59-83e4-9f3d3ca9119b:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "4b62946c-2fe5-49ed-b5cb-bf6e7f58e7a2:string:PETER LEE",
      designation: "1f877dba-9e25-4eac-84af-5bfabbeb890a:string:SHIPPING MANAGER",
      date: "43cf2bbc-e022-4c7d-b973-6e7057c94c8d:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "01c8d28b49c21a664befab9d63981f029e28468b49b73ec04b35748b08911544",
    proof: [],
    merkleRoot: "01c8d28b49c21a664befab9d63981f029e28468b49b73ec04b35748b08911544",
  },
};
