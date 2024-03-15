import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

interface CustomDocument extends v2.OpenAttestationDocument {
  billTo: any;
  network: {
    chain: string;
    chainId: string;
  };
  consignment: any;
  declaration: any;
  certification: any;
}

export const documentHederaRevokedWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    $template: {
      name: "8f76e856-0695-4032-83f1-3e7a0e502b71:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "9b10ec23-1ae4-401b-bc11-af9127f2dc4b:string:EMBEDDED_RENDERER",
      url: "4d38de69-0622-4012-9316-38167b88f608:string:https://demo-cnm.openattestation.com",
    },
    billTo: {
      name: "2fdf99b6-06f0-4d3c-87f5-8f8dde803b96:string:XYZ",
    },
    issuers: [
      {
        name: "ed31c75d-c0e4-4541-945f-0d9323068e2c:string:Demo Issuer",
        documentStore: "3804f213-cb9d-4e2c-9051-d125ff63024f:string:0x222B69788e2e9B7FB93a3a0fE258D4604Dc7df21",
        identityProof: {
          type: "55592302-01e2-483b-967e-bb4239f79e49:string:DNS-TXT",
          location: "82d945d8-35ef-4556-86c2-609a98549bfd:string:trustlv.org",
        },
      },
    ],
    network: {
      chain: "56221d22-bc28-4915-8a05-c3eb33724531:string:HBAR",
      chainId: "b17571c7-c9c2-40af-b2d4-c14d8c7563c8:string:296",
    },
    consignment: {
      description: "9f6661db-6465-4533-975b-d3b2df0152c5:string:16667 RED WINE",
      quantity: {
        value: "58b2fa48-b186-40d6-b722-75fab3365367:string:1000",
        unit: "a8608e66-8356-4afa-b6bb-910506059d5a:string:LITRES",
      },
      countryOfOrigin: "c27d8e9d-b02c-47bf-87d5-740d0fc8a8e8:string:INDIA",
      outwardBillNo: "e3a9c88e-0232-4884-8030-c3a3d206bc10:string:AQSIQ170923130",
      dateOfDischarge: "477a597d-08d7-4b21-9e1b-c7af5c614661:string:2024-03-01",
      dateOfDeparture: "22ecb19a-a148-432b-a21f-dd2abcab3b4e:string:2024-03-20",
      countryOfFinalDestination: "bf10847d-ee86-4445-8c91-c149013bf5f5:string:SINGAPORE",
      outgoingVehicleNo: "5708878e-9a66-4feb-9c8d-29e0ee936cfc:string:COSCO SING 074E/01-MAR",
    },
    declaration: {
      name: "f733bb67-7273-406d-a8d4-70b6fe8d6c43:string:JOHN",
      designation: "0b4603f2-e2b7-4081-a303-296304748b82:string:SHIPPING MANAGER",
      date: "9506b5f1-6f0e-4a06-9ae4-eb7e869beebe:string:2024-03-01",
    },
    certification: {
      name: "498463c7-2a70-45fa-bd50-5f2da3ec252c:string:DEMO JOHN TAN",
      designation: "992d0be8-ed3d-4354-a0a1-d3360101ffb8:string:DEMO",
      date: "8ae9b8f9-07c2-40a6-a711-220f82084f53:string:2024-03-01",
      signature:
        "57869919-e1e3-4549-9743-90ac71d7c453:string:data:image/png;base64,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",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "ab9040f1dce119c447a5eae6d08ec264f588350e47015d6aa32c49eb3ccdf60b",
    proof: ["e3f42315d32b7d23942f2c140eb00254f120fc8b772c3ab771e36a2c17b5d4a7"],
    merkleRoot: "fcea61cfe337f52c50ea52b2d092cbbcfe395b3e1880de148720b5a3cdd1539b",
  },
};
