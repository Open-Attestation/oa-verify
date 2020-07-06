import { ProofPurpose, SchemaId, SignedWrappedDocument, v2 } from "@govtechsg/open-attestation";

/**
 * The proof.type has been tampered with changing it to `notSupported`
 */
export const documentSignedProofInvalidProofType: SignedWrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    id: "01c2f23b-f789-4dce-9e0a-61b32ee0965c:string:2018-SAF-01",
    issuers: [
      {
        name: "56a1a1f6-1acb-4f87-95b9-5ff0c7993908:string:GovTech",
        identityProof: {
          type: "b796dac6-6322-4bb8-8953-e1773d917eaf:string:DNS-TXT",
          location: "f2a9850c-27aa-479a-8cce-be4d2804cf88:string:convergence.tech",
        },
      },
    ],
    recipient: {
      name: "ec3ce88e-d9aa-42af-8465-2261a8eff152:string:Jonathan Tay",
    },
    $template: {
      name: "542c42cf-af7c-4530-af20-4d43bbba54fd:string:TRYBE_DEFAULT",
      type: "4a4bfa35-77b8-4229-86a9-e5989da6a0fc:string:EMBEDDED_RENDERER",
      url:
        "1cd23e3b-12ce-4250-94df-38d0596a57dd:string:http://localhost:3000/renderer?orgId=5eb021ab277c08612003c1a6&rendererId=12345",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "c38d3369506ef1ce0120a05e2d9b9e0288fdc3a49c7e1b54e3d1af821f7d1274",
    proof: ["c21892d283f5fe488252d8a21c02feb6841ab77460232e1180757d6d64ad6542"],
    merkleRoot: "e9917f70b00bca5ac54086ac9e6a7e3f9e269d7a46bfd1f77f2b8caf63872dbf",
  },
  proof: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore error is valid, need to ignore for test purposes
    type: "notSupported",
    created: "2020-05-04T14:07:41.079Z",
    proofPurpose: ProofPurpose.AssertionMethod,
    verificationMethod: "0xCacfD9D54Ba8846d7eE754B4566a347023F53794",
    signature:
      "0xbe0619768d669c58f4fd491eea10f20149467c3a996f06887cd27ee6915d39d069c66bcf719213c3d470c9a3dc94c11808248e9650ac80c578d1514a59d4409a1b",
  },
};
