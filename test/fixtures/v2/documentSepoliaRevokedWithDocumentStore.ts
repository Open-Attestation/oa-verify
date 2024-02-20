import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

interface CustomDocument extends v2.OpenAttestationDocument {
  billFrom: any;
  billTo: {
    company: any;
    name: string;
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

export const documentSepoliaRevokedWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    billFrom: {
      name: "1dd67f60-f3d5-4b18-9abb-f976b0fb1537:string:acdc",
      streetAddress: "b3c66f30-10ae-4426-88bc-24219f608b80:string:abxc",
      city: "a580ede8-87ec-48dd-a439-a835f9475a2f:string:asdf",
      postalCode: "d5dcec9d-beaa-45f8-82b2-0ba8bae8119e:string:asdf",
      phoneNumber: "68e6501a-f6ac-4195-8537-4bd1fb61c646:string:89482323",
    },
    billTo: {
      company: {},
      name: "35fd787a-39fb-4ec6-8659-2d42a04e9d1d:string:butter",
      email: "91b66cb5-5e71-4b3c-9bf9-43d885d3bd81:string:b@gmail.com",
    },
    $template: {
      type: "c78f4bff-57cd-4b74-b2ed-293e89edc849:string:EMBEDDED_RENDERER",
      name: "dc194506-3c18-4feb-a4d9-8ef34af9d47d:string:INVOICE",
      url: "ed8165a2-7455-456f-864d-e69aabf4dc8d:string:https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "299e4388-280a-4799-8bce-0f9163e6e77c:string:Demo Issuer",
        documentStore: "42b721dd-7dd8-4872-b8ae-8c6ef9d60532:string:0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
        identityProof: {
          type: "0c0f4696-52cc-4554-81f8-96a1e4709f4a:string:DNS-TXT",
          location: "766b72ee-f594-4736-9f66-b0e4e5ce34e1:string:example.openattestation.com",
        },
        revocation: {
          type: "0985259b-d488-4d94-b1d9-fdd6228510fa:string:NONE" as v2.RevocationType,
        },
      },
    ],
    id: "f899f601-40ea-4bc0-92db-711c28f79b97:string:1234567",
    date: "b5c5c555-899d-4d90-adc7-1ee161c489d6:string:2022-10-05",
    customerId: "d07f10c3-d260-46dc-a875-f0c378a32118:string:43123",
    terms: "1842c7c8-d6a8-44d8-a168-005bd8f30f73:string:Best Customer",
    subtotal: "7ff858bb-a63a-4ed6-a4b1-4010f43fc6b5:string:undefined",
    tax: "c9b7a0ee-1a1c-4446-aa4e-05b217608444:string:undefined",
    taxTotal: "575b0351-c2db-4a46-9d25-d8378baf06a1:string:undefined",
    total: "72b5c23d-518b-462c-96a4-287998c493e5:string:undefined",
    links: {
      self: {
        href: "e8372ccc-d575-4c79-b96c-cda84bb17ca8:string:https://action.openattestation.com?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftradetrust-functions.netlify.app%2F.netlify%2Ffunctions%2Fstorage%2F23a6f749-fdc3-4a7c-9733-87b023c27c7b%22%2C%22key%22%3A%22703f5f5d796c5a39bfcea5682fbca440df21c341462233008e3be5bab475ee49%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fdev.tradetrust.io%2F%22%2C%22chainId%22%3A%225%22%7D%7D",
      },
    },
    network: {
      chain: "99d0d9f5-d112-4911-be62-384b9a333280:string:ETH",
      chainId: "9a67caca-d58b-479b-b8e9-8206afcb01f3:string:5",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "ae0d37f3bbdda18b9c5ab98b4e18536901e14de9a0f92c36347a0abe6afdc4df",
    proof: [],
    merkleRoot: "ae0d37f3bbdda18b9c5ab98b4e18536901e14de9a0f92c36347a0abe6afdc4df",
  },
};
