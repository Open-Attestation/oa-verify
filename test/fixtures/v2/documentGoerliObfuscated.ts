import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

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
export const documentGoerliObfuscated: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    billFrom: {
      name: "0482dac7-db36-45b2-ad59-8c2853bcbd33:string:acdc",
      streetAddress: "a692611b-111d-45b2-a0b9-d2d33a9009f6:string:abxc",
      city: "d2fce47b-bd92-4cdf-9024-7c76fe114c37:string:asdf",
      postalCode: "0d987517-4044-43b1-8178-ec80e72e6c33:string:asdf",
    },
    billTo: {
      company: {
        name: "09dceb13-bcc5-4269-9812-44fcd274216b:string:avcx",
        city: "701f6beb-80ec-48f1-a518-af1aab7e1964:string:eee",
      },
      email: "46a48838-2a6a-4741-a4a2-b64189b6616e:string:b@gmail.com",
    },
    $template: {
      type: "14a8a819-72dd-46b7-bfae-1b25ea43e4c7:string:EMBEDDED_RENDERER",
      name: "c77f3848-4eea-45a6-97af-4a3b2e7b8c71:string:INVOICE",
      url: "153fa998-12da-4f76-999d-b550b75277be:string:https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "0e64dcbe-986e-47fc-a334-ebd844572a29:string:Demo Issuer",
        documentStore: "04e43d7e-7ffa-4bdd-af78-be0a7ff9e9b7:string:0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
        identityProof: {
          type: "c43706cf-b681-4593-9076-8e0aeb156e48:string:DNS-TXT",
          location: "24696096-730e-41b0-a3ff-40df8e5b0f11:string:demo-tradetrust.openattestation.com",
        },
        revocation: {
          type: "9b0b3348-cb8e-4f05-bd0b-5ec603e48422:string:NONE" as v2.RevocationType,
        },
      },
    ],
    id: "53568df3-3254-4950-ad52-3b3bf858f3aa:string:1234567",
    date: "f40b8540-1da3-477a-aaa8-234dd283bee4:string:2022-10-05",
    customerId: "9bb1cec7-9892-42da-a40b-d89d6617faf0:string:43123",
    terms: "dbad7460-9b8c-4572-ac22-2eb403ead732:string:Best Customer",
    subtotal: "bc2a28fa-71f8-4f08-83de-8f2c6b01de62:string:werew",
    tax: "8f5246f3-e6c9-4d22-aaed-c440bb3ef64d:string:were",
    taxTotal: "a24178d2-6390-4f20-baa7-c7a0817510ca:string:ewerd",
    total: "b3f99049-89ba-41fc-8087-0d1003da4c32:string:sdf",
    links: {
      self: {
        href:
          "8252ae56-0bb0-4937-ba16-b03170553f07:string:https://action.openattestation.com?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftradetrust-functions.netlify.app%2F.netlify%2Ffunctions%2Fstorage%2F65e44a7c-264f-4b6d-8719-bb9401de1f9c%22%2C%22key%22%3A%225d18dc966ca159297b036b1ac6757d74aaf9fa6c4973b99fd164bfec9490d75b%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fdev.tradetrust.io%2F%22%2C%22chainId%22%3A%225%22%7D%7D",
      },
    },
    network: {
      chain: "55276dc8-ac7f-49db-beb7-dacdb0ecad41:string:ETH",
      chainId: "0ebd6e85-2228-4294-945a-83ede1a537ff:string:5",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "d87a560204a69bb9c0f495b66f6481ce566e2a639935ae07af131d0c7dcbac90",
    proof: [],
    merkleRoot: "d87a560204a69bb9c0f495b66f6481ce566e2a639935ae07af131d0c7dcbac90",
  },
  privacy: {
    obfuscatedData: [
      "edad95328cb21cc7d4de6f7b4733e1102bd481ff43ddc095e9fe2541db2cd203",
      "bfec4cb3960209b066ba9a3f3bde05762916e100dd9abf89a37a0a6113fdf760",
      "b6ba37889b18f66810a5db577d73d3ca16112a43bfb76a7865175dd85fdeff7b",
      "8753e0563b0f3f12a97a61c5c1f0bc404c4238552726c120938ce40065706628",
      "e21d49f3c53eb9100c6534a08ddb6fbd19e694e3e3c8b0a3adcecfd41eb43cf8",
    ],
  },
};
