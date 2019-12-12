import { v3, WrappedDocument } from "@govtechsg/open-attestation";

export const documentRopstenRevoked: WrappedDocument<v3.OpenAttestationDocument> = {
  version: "open-attestation/3.0",
  data: {
    reference: "9a9e32f8-3caa-40c2-8b59-138e1e0bb473:string:ABCXXXXX00",
    name: "9e00ce78-20bf-4f8c-a9d1-8d3b894b7ab6:string:Certificate of whatever",
    template: {
      name: "5caec94b-25c0-4855-bf31-a77404b4a88a:string:CUSTOM_TEMPLATE",
      type: "c8dbc89d-6bc6-4c1a-ad79-a42157de3aaf:string:EMBEDDED_RENDERER",
      url: "7f902de4-791d-4f61-9c30-47ba19e784e5:string:http://localhost:3000/rederer"
    },
    validFrom: "acfc42ee-6578-41f8-8dc9-3836192273db:string:2018-08-30T00:00:00+08:00",
    proof: {
      type: "c7d88250-c3d5-434a-994f-8063a0668340:string:OpenAttestationSignature2018",
      method: "57cfc114-38e2-43a1-b176-b59484125e6c:string:DOCUMENT_STORE",
      value: "c0315415-ff65-4223-97e5-dadd1bd72a04:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
    },
    issuer: {
      id: "041188c3-c4e3-4439-8b3a-11da47a9c9ab:string:https://example.com",
      name: "fda6b8f3-f89b-4785-8073-8e5d073982d8:string:Issuer name",
      identityProof: {
        type: "f30da9e1-43b6-4e3b-928d-79eaf963923b:string:DNS-TXT",
        location: "6cb10b24-a2ca-48a5-8a96-cdd7951e49ee:string:some.io"
      }
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "ba106f273697b46862f5842fc805902fa65d1f41d50953e0aeb815e43e989fc1",
    proof: [],
    merkleRoot: "ba106f273697b46862f5842fc805902fa65d1f41d50953e0aeb815e43e989fc1"
  }
};
