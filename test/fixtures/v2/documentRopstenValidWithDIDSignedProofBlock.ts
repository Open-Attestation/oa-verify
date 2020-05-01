import { v2, WrappedDocument } from "@govtechsg/open-attestation";

interface CustomDocument extends v2.OpenAttestationDocument {
  name: string;
  issuedOn: string;
  $template: string;
  recipient: {
    name: string;
  };
}

export const documentRopstenValidWithDIDSignedProofBlock: WrappedDocument<CustomDocument> = {
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
    targetHash: "6b7013e23767199d3470375b53d7f64ff6620e4c56a5279b1ff7bdde5b7a80b4",
    proof: [],
    merkleRoot: "559225d9661a47d2a1b75c12f0375c8d53a8141103b5de60a42255746e2b2d98"
  },
  proof: {
    type: "EcdsaSecp256k1Signature2019",
    created: "2020-04-16T17:42:56.438Z",
    proofPurpose: "assertionMethod",
    verificationMethod: "0xd130e6b130D9E940a724f894b316E79F9e58C648",
    signature:
      "0xf074f62545319df30ce9722ff8ee5f9ab66ae365a5ff99dd1ef620200425201c6ed87e95b20728b60f0dad54f0e87eafef6e257f29de4f055db0ac95b8143b1e1b"
  }
};
