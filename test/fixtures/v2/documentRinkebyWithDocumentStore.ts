import { SchemaId, v2, WrappedDocument } from "@govtechsg/open-attestation";

interface CustomDocument extends v2.OpenAttestationDocument {
  name: string;
}
export const documentRinkebyValidWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "de3e3e29-24b4-489e-8e63-03255e58e9c0:string:53b75bbe",
    name: "0ca56c17-084b-4c52-8a56-5acfdd517800:string:Govtech Demo Certificate",
    $template: {
      name: "fd948b70-0e9a-4fe1-a288-a8deeb6c2b73:string:GOVTECH_DEMO",
      type: "10458382-c7c5-4edd-a5da-8318b547df2e:string:EMBEDDED_RENDERER",
      url: "0fb18658-670e-461f-938f-a5a10794fef7:string:https://demo-renderer.opencerts.io",
    },
    issuers: [
      {
        name: "e09d407e-54e7-4cb4-9704-9bde78fa3ba1:string:Govtech",
        documentStore: "a6db3b26-b848-4f1f-b46b-b3dbcd0db332:string:0x718B518565B81097b185661EBba3966Ff32A0039",
        identityProof: {
          type: "2135cbfa-9714-46fc-b65e-464c1e1413bf:string:DNS-TXT",
          location: "eed8cc31-5832-4d84-8b5d-504734bc647e:string:example.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "78327e90-bc9e-4ff5-b4b7-797630bdfc63:string:Your Name",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "723991dd29aaada73246da95106448b1b4c0fd41ad86cf0352177c4829f2f8de",
    proof: [],
    merkleRoot: "723991dd29aaada73246da95106448b1b4c0fd41ad86cf0352177c4829f2f8de",
  },
};

export const documentRinkebyRevokedWithDocumentStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "d8eb4e38-dc66-4d7d-8791-05348af674c2:string:53b75bbe",
    name: "de3c2354-0693-4803-81d9-509f82792b7e:string:Govtech Demo Certificate",
    $template: {
      name: "06788de0-68dd-4cd4-a3e9-969886cbe040:string:GOVTECH_DEMO",
      type: "c0ed52d4-b297-4696-bde9-51f3583b0249:string:EMBEDDED_RENDERER",
      url: "43f124b3-2457-4759-bd4d-1d433bca8b02:string:https://demo-renderer.opencerts.io",
    },
    issuers: [
      {
        name: "ea753750-2e71-49e3-98d1-5a6a5f2ebebc:string:Govtech",
        documentStore: "5c390b10-fcd5-4dc9-a399-8ec269676655:string:0x718B518565B81097b185661EBba3966Ff32A0039",
        identityProof: {
          type: "133055da-2743-41ee-aa22-d0a9b10248d8:string:DNS-TXT",
          location: "b7b6fb65-01cf-4a48-9edf-d2ecc7665920:string:example.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "85b1bb18-04b6-4e9f-9c9e-f2546ff4c1ac:string:Your Name",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "92c04840038856f29890720bb57db655b9131ad2f93cf29cefcf17ea84dfb7d5",
    proof: [],
    merkleRoot: "92c04840038856f29890720bb57db655b9131ad2f93cf29cefcf17ea84dfb7d5",
  },
};
