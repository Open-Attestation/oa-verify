import { SchemaId, v2, WrappedDocument } from "@govtechsg/open-attestation";

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

export const documentSepoliaNotIssuedTokenRegistry: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "f0654606-c5eb-4a4f-b09a-e55ebb6e5a3f:string:SGCNM21566325",
    $template: {
      name: "ac70d180-4f79-47d2-bd7f-d1e97b8a0f4e:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "c4c356f7-5976-4315-a6f5-249ba9c73853:string:EMBEDDED_RENDERER",
      url: "a4338c57-a3f6-4bb5-994b-2699ff3458fc:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "60664864-9949-4f21-b80a-930c9e0df9bb:string:DEMO STORE",
        tokenRegistry: "e33a93cd-dbe1-4563-88d0-cd5f782e1890:string:0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
        identityProof: {
          type: "54c0fd27-1aa9-487c-9ade-e62c97a5c44f:string:DNS-TXT",
          location: "f1a5fffc-5a58-485a-a56a-f97c7206f97c:string:example.tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "641e55b1-e06f-4f5d-b329-d8870d01c493:string:SG FREIGHT",
      address: {
        street: "94508090-2aa9-4a5b-90c5-940cfe425b82:string:101 ORCHARD ROAD",
        country: "5e8ac441-54cc-4a95-bd2e-3df3aa584821:string:SINGAPORE",
      },
    },
    consignment: {
      description: "e577f342-f7b8-478d-8b1b-da9fa372ff0e:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "8c7fa055-426d-4278-8ca7-e6a48c8c13bc:string:5000",
        unit: "8539361a-9add-4ebf-ae2a-5b8ef528cf9a:string:LITRES",
      },
      countryOfOrigin: "623c9c60-f342-4077-aa21-8c217632c6ba:string:AUSTRALIA",
      outwardBillNo: "5f905bf8-3bc6-4243-823c-4036b46986cf:string:AQSIQ170923130",
      dateOfDischarge: "4f522463-0cf9-433e-888d-93d6fc3039f5:string:2018-01-26",
      dateOfDeparture: "fc8d3363-92cb-4520-a57b-d4c715a6c763:string:2018-01-30",
      countryOfFinalDestination: "05febc30-e9a1-47a0-8f65-6f6ac2f8c099:string:CHINA",
      outgoingVehicleNo: "aa82ad8f-fe23-4c35-9a55-34d6d695e402:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "8a2286a5-4fad-4c2a-94f6-acb3dd19fa4f:string:PETER LEE",
      designation: "355c9482-9985-4788-8dc3-9a1002aaad9c:string:SHIPPING MANAGER",
      date: "a77425ba-cc49-47e3-9a48-f9215f134898:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "5645ff3d9c78b42642304855c26120345f3bec2bf3412a45d489eee85ee81092",
    proof: [],
    merkleRoot: "5645ff3d9c78b42642304855c26120345f3bec2bf3412a45d489eee85ee81092",
  },
};
