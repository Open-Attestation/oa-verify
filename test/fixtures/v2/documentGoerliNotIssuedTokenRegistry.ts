import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

interface CustomDocument extends v2.OpenAttestationDocument {
  recipient: {
    name: string;
    address: {
      street: string;
      country: string;
    };
  };
  consignment: {
    description: string;
    quantity: {
      value: string;
      unit: string;
    };
    countryOfOrigin: string;
    outwardBillNo: string;
    dateOfDischarge: string;
    dateOfDeparture: string;
    countryOfFinalDestination: string;
    outgoingVehicleNo: "string";
  };
  declaration: {
    name: string;
    designation: string;
    date: string;
  };
}

export const documentGoerliNotIssuedTokenRegistry: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "9b6c8095-0050-4624-a899-05562cf87849:string:SGCNM21566325",
    $template: {
      name: "8297569b-f29a-41d6-8d09-69d28ed564a8:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "0b383315-4945-42d3-96a9-b610073ad940:string:EMBEDDED_RENDERER",
      url: "048f1a2d-ac9b-4ceb-b6fa-15cbbe58f246:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "697c685c-076e-4e15-841c-547b22801289:string:DEMO STORE",
        tokenRegistry: "73773f41-579c-4ad6-8fa1-91c53915c684:string:0x921dC7cEF00155ac3A33f04DA7395324d7809757",
        identityProof: {
          type: "57cb7721-e760-433b-ad9c-89ecba31b150:string:DNS-TXT",
          location: "b5b7ed81-4892-4c44-babe-7f1e22e2359c:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "7e6868ec-5478-4566-bfa8-8044574df289:string:SG FREIGHT",
      address: {
        street: "c1fd89ae-25a3-4092-bb60-97f1d25f41a6:string:101 ORCHARD ROAD",
        country: "f3595865-c6f2-48b9-abfb-ec43ae8cb971:string:SINGAPORE",
      },
    },
    consignment: {
      description: "8a17256a-465c-4db6-a6bb-da6f6be053d1:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "5e5458f0-e906-48b7-a530-92cf5adddd64:string:5000",
        unit: "28334a58-3a6f-4c16-a454-ca3521283c38:string:LITRES",
      },
      countryOfOrigin: "0c73c19b-3b96-49db-9dd5-5c1ec976ba70:string:AUSTRALIA",
      outwardBillNo: "00298c54-14c6-4fe3-b9c1-4ee394708826:string:AQSIQ170923130",
      dateOfDischarge: "dff609a1-dcad-4e4c-8172-b564a783aa18:string:2018-01-26",
      dateOfDeparture: "b5d4cebe-e86c-44bf-88ae-08934e89df6c:string:2018-01-30",
      countryOfFinalDestination: "ac044b08-3b96-49bc-979d-e43d178e46ce:string:CHINA",
      outgoingVehicleNo: "f2835d1a-60bd-4616-bffd-26478185a7a1:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "8f9e1c71-1650-41f9-b6e7-88c18cde1813:string:PETER LEE",
      designation: "6540be75-acb8-4549-be18-4edefa8b000d:string:SHIPPING MANAGER",
      date: "cf301a47-fff7-48b0-893d-d00ca6be04e0:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "d87b75bed186f8320a344130a89f91092e91115c5095f49dbc8e1aa3c5ad64f9",
    proof: [],
    merkleRoot: "d87b75bed186f8320a344130a89f91092e91115c5095f49dbc8e1aa3c5ad64f9",
  },
};
