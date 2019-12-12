import { v3, WrappedDocument } from "@govtechsg/open-attestation";

export const documentRopstenNotIssued: WrappedDocument<v3.OpenAttestationDocument> = {
  version: "open-attestation/3.0",
  data: {
    reference: "23099a48-5d9f-463e-941f-28fffaabaec7:string:ABCXXXXX00",
    name: "f7da877a-ba98-4317-9434-67b072bd620a:string:Certificate of whatever",
    template: {
      name: "378bfcf7-25f1-4165-b131-06ad9e5293c7:string:CUSTOM_TEMPLATE",
      type: "bbbb19d4-132f-4139-96e5-0c33492d5319:string:EMBEDDED_RENDERER",
      url: "f0b0332b-b6db-4bd0-8ea8-14bd079d61c8:string:http://localhost:3000/rederer"
    },
    validFrom: "5a7063dd-f8be-45df-931d-75080bd5c701:string:2018-08-30T00:00:00+08:00",
    proof: {
      type: "ba78d365-b039-46fa-a843-b96005a9b49c:string:OpenAttestationSignature2018",
      method: "f0bb4f79-c8a3-476b-8e51-d947d0406047:string:DOCUMENT_STORE",
      value: "0b9bbe75-8421-4e70-a176-cba76843216d:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
    },
    issuer: {
      id: "43f69633-d31a-443b-a3ff-d06ec10583e5:string:https://example.com",
      name: "1e98660f-b351-4d58-8787-9950a5fc51ad:string:Issuer name",
      identityProof: {
        type: "997589bb-9d9d-4879-b640-18c55df22ff8:string:DNS-TXT",
        location: "52eafb04-2edf-4419-b3fd-5c576e23205c:string:some.io"
      }
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "76cb959f49db0cffc05107af4a3ecef14092fd445d9acb0c2e7e27908d262142",
    proof: [],
    merkleRoot: "76cb959f49db0cffc05107af4a3ecef14092fd445d9acb0c2e7e27908d262142"
  }
};
