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
export const documentHederaValidWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    $template: {
      name: "main",
      type: "EMBEDDED_RENDERER",
      url: "https://tutorial-renderer.openattestation.com",
    },
    recipient: {
      name: "KrypC - Piruthivi",
      address: {
        street: "101 ORCHARD ROAD",
        country: "SINGAPORE",
      },
    },
    issuers: [
      {
        name: "KrypC Issuer",
        tokenRegistry: "0x3DE43bfd3D771931E46CbBd4EDE0D3d95C85f81A",
        identityProof: {
          type: "DNS-TXT",
          location: "trustlv.org",
        },
      },
    ],
    consignment: {},
    declaration: {},
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "1fdea9b542ec22f7d87f23d86f1cf3e526e2edec1b9baaa9aedff904efea78a9",
    proof: [],
    merkleRoot: "1fdea9b542ec22f7d87f23d86f1cf3e526e2edec1b9baaa9aedff904efea78a9",
  },
};
