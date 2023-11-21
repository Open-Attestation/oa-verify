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

export const documentGoerliRevokedWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    billFrom: {
      name: "d8a6ba1a-70b0-4bd0-94f7-1e60e6a97793:string:acdc",
      streetAddress: "17655fc2-6d53-427f-8319-7ad8e76f9e5e:string:abxc",
      city: "474ae8f6-c2a4-40e2-957a-44445b62aee6:string:asdf",
      postalCode: "858506ab-1cb6-4ea6-b15f-cdf46e9d4359:string:asdf",
      phoneNumber: "2301a5bc-ad7e-4b75-b9ab-3d4e91af3a62:string:89482323",
    },
    billTo: {
      company: {
        name: "b8478913-1096-42ba-96f9-2e827e5a1b3d:undefined:undefined",
        streetAddress: "61e3ec46-f9ab-4001-a3df-bb5d070ea877:undefined:undefined",
        city: "3f7243a2-47ad-42a8-9d95-3f5bb572e9b8:undefined:undefined",
        postalCode: "0cd42903-7a8d-413d-a297-e78893b525a6:undefined:undefined",
        phoneNumber: "f5aa5a8f-1619-4193-9985-ff610e4cfcef:undefined:undefined",
      },
      name: "f0c16fca-a59a-4760-a25f-387635af3192:string:butter",
      email: "0d0d2442-d520-4c54-aec6-e7263aa184f7:string:b@gmail.com",
    },
    $template: {
      type: "d8bbf449-8a40-420a-a675-1e91add264e9:string:EMBEDDED_RENDERER",
      name: "6e66e30d-ef29-41e3-b3f1-517db214901d:string:INVOICE",
      url: "5142eaf5-0a27-4d92-a925-1bb0307fc8b3:string:https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "8c9ccf0d-107b-4568-87d9-868c2fcf24b9:string:Demo Issuer",
        documentStore: "cdbcfda6-2eb9-4e19-9bb9-b86161914ca7:string:0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
        identityProof: {
          type: "9487502b-0be7-4be9-be3f-ee7cb6582584:string:DNS-TXT",
          location: "71555492-8db6-4068-a8c8-2cca4bd7d6e7:string:demo-tradetrust.openattestation.com",
        },
        revocation: {
          type: "073b40d8-bfbe-4b57-b483-bcb4e212c472:string:NONE" as v2.RevocationType,
        },
      },
    ],
    id: "ab719e3a-24d1-46cc-bdff-f5284ebcb42f:string:1234567",
    date: "7071426a-bb95-4352-8025-cba2c60e4e76:string:2022-10-05",
    customerId: "0b8c36fd-9156-47b0-b329-928de93d2e08:string:43123",
    terms: "99a2dbd9-a90c-4571-823b-7475bc38585a:string:Best Customer",
    subtotal: "8c18b95f-73ae-426e-9a6a-cc428b9563de:undefined:undefined",
    tax: "e6bdd02e-ffb7-46cb-9cfc-bdc607bfd64d:undefined:undefined",
    taxTotal: "2d49b39d-c490-4ff4-a723-1e1b68d42661:undefined:undefined",
    total: "d65c69f7-7a5a-4e4d-b8b3-2ec3cf5a3b03:undefined:undefined",
    links: {
      self: {
        href:
          "313a2de3-43b8-41be-afc3-59011421f76c:string:https://action.openattestation.com?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftradetrust-functions.netlify.app%2F.netlify%2Ffunctions%2Fstorage%2F23a6f749-fdc3-4a7c-9733-87b023c27c7b%22%2C%22key%22%3A%22703f5f5d796c5a39bfcea5682fbca440df21c341462233008e3be5bab475ee49%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fdev.tradetrust.io%2F%22%2C%22chainId%22%3A%225%22%7D%7D",
      },
    },
    network: {
      chain: "dd0e5db4-27a3-4e64-8678-82b47d408f69:string:ETH",
      chainId: "52289b91-ffa0-46bf-85c7-7ab8d483b24d:string:5",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "6a6c94352e6327437970a41126c041a83cec0fe684b13045991942ea67fca554",
    proof: [],
    merkleRoot: "6a6c94352e6327437970a41126c041a83cec0fe684b13045991942ea67fca554",
  },
};
