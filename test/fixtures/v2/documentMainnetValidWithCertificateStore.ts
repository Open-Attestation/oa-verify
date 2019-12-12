import { v2, WrappedDocument } from "@govtechsg/open-attestation";

interface CustomDocument extends v2.OpenAttestationDocument {
  name: string;
  issuedOn: string;
  $template: string;
  recipient: {
    name: string;
  };
}

export const documentMainnetValidWithCertificateStore: WrappedDocument<CustomDocument> = {
  version: "open-attestation/2.0",
  schema: "opencerts/1.4",
  data: {
    id: "ab89a9ae-954f-4d28-8b48-2a534d3a3d60:string:2018-SAF-01",
    $template: "2d00853b-43ae-4bc9-82a2-c614ec0fca49:string:SG-GOVTECH-OPENCERTS",
    name: "9a4499fa-8f68-43d8-b42b-57dc365ab249:string:Certified OpenCerts Associate",
    issuedOn: "60bf1feb-e373-4757-8a5d-cf485199bf7a:string:2018-11-30T15:00:00+08:00",
    issuers: [
      {
        name: "a8d46c32-2e35-4f4e-99b1-f8a5acb04180:string:GovTech",
        certificateStore: "9f3ffc2c-2e06-4a9d-a762-8449aec4ca9e:string:0x007d40224f6562461633ccfbaffd359ebb2fc9ba"
      }
    ],
    recipient: {
      name: "d93f6840-0219-4f16-991e-d02fae161c6b:string:Jonathan Tay"
    }
  },
  privacy: {
    obfuscatedData: [
      "38c3bb23e0e0bb29d1e6efecc25ff6f95cf4bc05e6310e767f2ebd3eac766fa9",
      "825aff8c9c91518b75aaa583ee72f182fa3b40a2c09d9a2e1092b6b5d8ed0b7d",
      "54ea1052e0a5dd98a1a674b14af0f21aa8a3d7a23d6c90adcebc1215622fb0d2"
    ]
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "5b5ed60a40d445c58ffa21e73d11a98acc04be538ab9729da5066f75f0eaddb4",
    proof: [
      "86874cd45a74f39759c21028ddacb6b45c56cd1b36203a874d91d3ef276eab7b",
      "cd6d9d9a5969a6c5f428b7b4d8e854a798143072371f477bf09145a66951a9d8",
      "6e78b6b1bfc66f4f34fe70f97d3e91bcc318f17916394eab95cf15e2e20ac63e"
    ],
    merkleRoot: "1a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6"
  }
};
