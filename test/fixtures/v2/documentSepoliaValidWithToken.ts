import { SchemaId, v2, WrappedDocument } from "@govtechsg/open-attestation";

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

export const documentSepoliaValidWithToken: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "c4d0823c-49c9-494f-8fa5-576c746900d7:string:SGCNM21566325",
    $template: {
      name: "26be0257-5d10-421f-b42e-84dc03f77b66:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "9194bf18-e6ba-4533-b846-5db60ea3a9fc:string:EMBEDDED_RENDERER",
      url: "a9e9af66-bad3-411e-a02e-9863a4103a8e:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "f12055b9-18ac-4362-9b85-045c7945f267:string:DEMO STORE",
        tokenRegistry: "dcd4aecf-abec-4316-925b-d537418d456a:string:0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
        identityProof: {
          type: "222cb8e1-13bb-40ae-a255-7d56781e716c:string:DNS-TXT",
          location: "7f1c5629-122b-4808-9618-20ea701526b9:string:example.tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "b775d0db-ef6f-41ce-bb2f-f2366ef0e1a6:string:SG FREIGHT",
      address: {
        street: "dc231e06-7fca-4ea1-9933-190457799ae6:string:101 ORCHARD ROAD",
        country: "8c6b9f39-e431-4c91-b1e7-c7833d13e649:string:SINGAPORE",
      },
    },
    consignment: {
      description: "5cba970f-8e70-4181-8b39-ddb9502abba1:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "69a0296d-0123-4072-a500-59b935c7df3e:string:5000",
        unit: "c2cb02b3-7c26-45fb-8d5c-c1e0db4f5b8c:string:LITRES",
      },
      countryOfOrigin: "5911978b-9f00-4ece-a079-0268cf15246d:string:AUSTRALIA",
      outwardBillNo: "3c971efe-0ce5-4651-ad0c-87728c713dff:string:AQSIQ170923130",
      dateOfDischarge: "290a80c5-1aa8-43dd-aa97-ff85fb6db653:string:2018-01-26",
      dateOfDeparture: "4459e2fa-df5c-46c7-82cb-da9fe8fec1ea:string:2018-01-30",
      countryOfFinalDestination: "152cc7a4-1fc3-48de-8e5e-dc363aa629fd:string:CHINA",
      outgoingVehicleNo: "d77fbf0f-fb4b-4dbc-be61-ce44e2307316:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "23992b1b-050c-4914-8d19-cfec43d66260:string:PETER LEE",
      designation: "642cefd7-96f2-416e-a390-81c8b0141b6b:string:SHIPPING MANAGER",
      date: "42f3aa4f-7353-4a14-b046-e864e21d5533:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "de08643a0b7504329f0024174ac7fbb297876a52437aae8190bdbca794f9d96b",
    proof: [],
    merkleRoot: "de08643a0b7504329f0024174ac7fbb297876a52437aae8190bdbca794f9d96b",
  },
};
