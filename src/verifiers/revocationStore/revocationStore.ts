import { SchemaId, v2, WrappedDocument } from "@govtechsg/open-attestation";

export const documentRopstenRevocationStoreNotRevoked: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "293d83b9-ffab-4888-b645-a294dce1a9f6:string:John",
        identityProof: {
          type: "846b133e-25af-4b3c-8464-088dcf0bd7f9:string:DNS-TXT",
          location: "e5cf69ff-d95e-409f-a775-2a63694de710:string:tradetrust.io",
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        revocationStore: "79e3f87d-704e-486f-8b01-3c7a04d47896:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
      },
    ],
    foo: "6ccebe9c-7170-4d12-a2b4-34eef1d182d3:string:bar",
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "f5b228fc992405bdb96709f5a141678d8ca39576e211a3624807451039451af0",
    proof: [],
    merkleRoot: "f5b228fc992405bdb96709f5a141678d8ca39576e211a3624807451039451af0",
  },
};

export const documentRopstenRevocationStoreRevoked: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    issuers: [
      {
        name: "ca3d28a9-0bc5-4ec5-a020-3a42ba43146a:string:John",
        identityProof: {
          type: "0bf12863-5868-46f9-ab95-85a85d90c4c7:string:DNS-TXT",
          location: "9fb9839a-c263-4976-b3dd-898495187ade:string:tradetrust.io",
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        revocationStore: "3d3766c0-b9bd-4a8f-8612-62e41887374f:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
      },
    ],
    foo: "95b7ea29-e768-4462-be9a-8464de48f55d:string:bar",
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "856924fa2cf3374bf64697eb0dcf38d0251ff18aedae2bbc193398e8bb11fbd1",
    proof: [],
    merkleRoot: "856924fa2cf3374bf64697eb0dcf38d0251ff18aedae2bbc193398e8bb11fbd1",
  },
};
