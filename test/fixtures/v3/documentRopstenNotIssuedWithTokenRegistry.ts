import { v3, WrappedDocument } from "@govtechsg/open-attestation";

export const documentRopstenNotIssuedWithTokenRegistry: WrappedDocument<v3.OpenAttestationDocument> = {
  version: "open-attestation/3.0",
  data: {
    reference: "5e5fbb14-32d2-4518-86b7-82ebf207999c:string:ABCXXXXX00",
    name: "229880cf-482f-4701-830c-6baebfafa0ce:string:Certificate of whatever",
    template: {
      name: "e599200c-1243-4521-a7d0-8f9c3f7c4514:string:CUSTOM_TEMPLATE",
      type: "9e3c27ed-b0eb-437d-a6b5-43d827009f59:string:EMBEDDED_RENDERER",
      url: "40a3b2d3-b211-4257-802a-75c4d9e7a00b:string:http://localhost:3000/rederer"
    },
    validFrom: "bcbff139-3457-4df8-927c-e1f6c782d422:string:2018-08-30T00:00:00+08:00",
    proof: {
      type: "7abbb49b-f46f-4883-acd0-5a65cddf3c40:string:OpenAttestationSignature2018",
      method: "263a76f3-e785-4790-9a2c-a793642d717a:string:TOKEN_REGISTRY",
      value: "d0a4e90a-a43e-4a9d-bd89-562e36b4bde2:string:0xb53499ee758352fAdDfCed863d9ac35C809E2F20"
    },
    issuer: {
      id: "b0d4acae-346d-4b84-b2a4-63a6ed1606cf:string:https://example.com",
      name: "0e8883cc-f714-4cd5-a32f-3ff6bd1f7ed7:string:Issuer name",
      identityProof: {
        type: "66355a2f-73a4-422d-8b8f-6cda1ba8db35:string:DNS-TXT",
        location: "2250912d-7ee5-479b-a9b3-dffe381b418c:string:some.io"
      }
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "7c56cf6bac41a744060e515cac8eb177c8f3d2d56f705a0a7df884906623bddc",
    proof: [],
    merkleRoot: "7c56cf6bac41a744060e515cac8eb177c8f3d2d56f705a0a7df884906623bddc"
  }
};
