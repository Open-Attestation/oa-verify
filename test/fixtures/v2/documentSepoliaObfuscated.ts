import { SchemaId, v2, WrappedDocument } from "@govtechsg/open-attestation";

interface CustomDocument extends v2.OpenAttestationDocument {
  billFrom: any;
  billTo: {
    company: any;
    email: string;
  };
  links: {
    self: {
      href: string;
    };
  };
  network: {
    chain: string;
    chainId: string;
  };
  date: string;
  customerId: string;
  terms: string;
  subtotal: string;
  tax: string;
  taxTotal: string;
  total: string;
}
export const documentSepoliaObfuscated: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    billFrom: {
      name: "5a24e57b-23db-4cd0-939c-711c6b013614:string:acdc",
      streetAddress: "de396ac2-486f-4ec3-b70f-15be5b378abe:string:abxc",
      city: "afd8802f-92c8-4743-8438-4711375820e7:string:asdf",
      postalCode: "8b95f9cd-d13b-40f0-bb8b-40d1794aa411:string:asdf",
    },
    billTo: {
      company: {
        name: "b6064fa9-1316-4ae7-b81e-cb70b31b8d15:string:avcx",
        city: "43d9205e-b1a1-4392-b480-0adddbaaeaed:string:eee",
      },
      email: "6da8eaae-94f6-4eec-bbe9-5685d18acaeb:string:b@gmail.com",
    },
    $template: {
      type: "5a9584a5-006f-4f28-9903-bd165070d98e:string:EMBEDDED_RENDERER",
      name: "ce007a4a-f934-4de0-a306-a22b7b1c0695:string:INVOICE",
      url: "7bd9c801-949c-4207-a588-703c4eab350e:string:https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "01bc2e2c-59ea-4716-b298-89953f656ec2:string:Demo Issuer",
        documentStore: "17c51493-e102-4fd2-8233-25517cb6a7de:string:0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
        identityProof: {
          type: "1f8d232f-bdb1-418b-8b1d-bf27a9f488d5:string:DNS-TXT",
          location: "08470d59-c249-4b80-9fff-1a47feed1144:string:example.openattestation.com",
        },
        revocation: {
          type: "381def76-c2a8-4ebd-8b93-4f702f4b3e8e:string:NONE" as v2.RevocationType,
        },
      },
    ],
    id: "6b50e42f-1ec6-4605-ba7a-af2ab157c9fb:string:1234567",
    date: "9adacb60-afc1-4ffd-8f8d-b1144b41de30:string:2022-10-05",
    customerId: "f6d08e3c-2043-4d88-8fcb-04a4806a94ee:string:43123",
    terms: "09375b15-16f2-46bd-a022-7090ec9a5766:string:Best Customer",
    subtotal: "95fbcff3-106f-4a83-a056-0dda49fca3d9:string:werew",
    tax: "52218b0f-fc77-4c0d-ad43-04b6659c6a9f:string:were",
    taxTotal: "6311b60b-a226-4f9c-98b0-370c2a01f702:string:ewerd",
    total: "7a0ebdf0-0d69-4377-8648-33a40532195a:string:sdf",
    links: {
      self: {
        href: "ad3233d0-d2c9-40e4-b072-018043d5a92a:string:https://action.openattestation.com?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftradetrust-functions.netlify.app%2F.netlify%2Ffunctions%2Fstorage%2F65e44a7c-264f-4b6d-8719-bb9401de1f9c%22%2C%22key%22%3A%225d18dc966ca159297b036b1ac6757d74aaf9fa6c4973b99fd164bfec9490d75b%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fdev.tradetrust.io%2F%22%2C%22chainId%22%3A%225%22%7D%7D",
      },
    },
    network: {
      chain: "e6105405-a55d-44a0-8342-94d5e1cdbfc9:string:ETH",
      chainId: "68d5230f-7236-481c-b53a-747e9e5f9d6e:string:11155111",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "c81081ac6c02930ddd6342da129c18cd7e053a883f17301ce0ae85875a185f8f",
    proof: [],
    merkleRoot: "c81081ac6c02930ddd6342da129c18cd7e053a883f17301ce0ae85875a185f8f",
  },
  privacy: {
    obfuscatedData: [
      "ec09d5947e8f688e42904cecb2419eaa911d75ccf59ace068fd827c6968083cc",
      "c9d1534c66d226dd9a10787a455252f26fdb30571c70fcec02ee5967f1d8057b",
    ],
  },
};
