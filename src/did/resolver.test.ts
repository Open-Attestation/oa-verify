import { ethers } from "ethers";
import { v3 } from "@govtechsg/open-attestation";
import { openAttestationDidIdentityProof } from "../verifiers/issuerIdentity/did/didIdentityProof";
import { verificationBuilder } from "../verifiers/verificationBuilder";
import { INFURA_API_KEY } from "../config";
import { createResolver, EthrResolverConfig, resolve } from "./resolver";

const didDoc = {
  "@context": "https://w3id.org/did/v1",
  id: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
  publicKey: [
    {
      id: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457#controller",
      type: "Secp256k1VerificationKey2018",
      controller: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
      ethereumAddress: "0x0ce1854a3836daf9130028cf90d6d35b1ae46457",
    },
  ],
  authentication: [
    {
      type: "Secp256k1SignatureAuthentication2018",
      publicKey: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457#controller",
    },
  ],
};

// this document has been created using:
// issuer address: 0x0ce1854a3836daf9130028cf90d6d35b1ae46457;
// issuer private key: 0xeff5bd53a7df36912370a14c25c79f102736377883528414a2f82cdd1610c938;
// issuer public key: 0x04a515ac97b41c22021a9655b24e49d590f984c9c1f9f4e60baee7845d06e40631452eb79964e65ad0e07eac715154139d6b5314eec4793d3d45f1320b7609462f;

const v3DidSigned = {
  version: "https://schema.openattestation.com/3.0/schema.json",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schema.org",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
  ],
  issuanceDate: "2010-01-01T19:23:24Z",
  issuer: {
    id: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
    name: "anyway",
  },
  type: ["VerifiableCredential", "Name"],
  credentialSubject: {
    id: "did:example:1234",
    name: "John",
  },
  openAttestationMetadata: {
    proof: {
      type: "OpenAttestationProofMethod",
      method: "DID",
      value: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
      revocation: {
        type: "NONE",
      },
    },
    identityProof: {
      type: "DID",
      identifier: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
    },
  },
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "a1c29778310a0c6d6a8f614bb689e10771a78b4d94f0c9289e5a448804f46c24",
    proofs: [],
    merkleRoot: "a1c29778310a0c6d6a8f614bb689e10771a78b4d94f0c9289e5a448804f46c24",
    salts:
      "W3sidmFsdWUiOiJjYWZjZGMyNDEwNmQ3OTcxODhkOTNlN2Y3YTQzMmNlMGY3ZjRjNjljZTRkNTZkODMxMjJhNTllNzAwZGEzYzY4IiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiYmE2NzNhNjU5M2U5MGVmZDQxYjFmODQ1ZmE2N2VmODQ1ODA5YjdiY2Q3MTk3NDkxNDRkZWQxNmRmZGFmNGEzZSIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiIyMjY3ZDAyMGZjZjQzYjcxZGFjNDQxOTJjZmY3NzQ2NzQ1MTRlODNlMGU2Yzg0M2U4MDE5ZTdkNzlmMDNkMzI1IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6ImMzMDVkNGU1NWVmZTgwNGM2NTM3NTY5NzU4MWI4ZWUzNzk5YmJiZWQxOTE4NGI4ODdhMDRkNGJiOWE1NjdlOWIiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiNjI4YTZiYzc5NDg2ZjBmNjQyMzZhNWEwMGYxZjljZWFiODM3ZDJmMzJiZjM0ZDAwMzVhYjUxNDdlOTVkZjhjMCIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiODA4YzA1ZWVlMzdhZjExOTAyYzgxNWZjMTUwMTk5Y2NlZjdkMzIxMzkwNDI0M2U1OTkyMzU5YjhhZjU2NWViMiIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiZDA4ZWNjYWU4YjY4MzhmMWRjZmE1YzdkOTg3NjRhNDI3YWJmZjUzMWVhMTU0NzEyMDJkOWVkNzM1MjZjMTc0NyIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiIyZjZjOGVmMDE0YWJkOGI0MGY2MWQ2MmYyMjVhNWEzYjc3OTFlYTEzODA1N2YyODA3NDdlMDAyNjhlY2ZmNTRkIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiNzg2OWE3ZmMwMWYzNGI2OTI5OTE2NmU1MDhkMDdjMWMzMjg4Nzg3NzViMWY2NGI2NjA3ZWY0NGI1ZGU5YTRiYSIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6ImRiNGNhODA1OWIxZmVlZGM5ZTRiNTE4NTQwMmUwN2EwMjNlNTE3MTNjMTdhN2QwNDdmZjUwOGQwOWY2NDU5YTkiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiNjU2ZjdiYzg2NmRmMmYxMDU3ZTk1MDQ1N2YxZDI0NGZjNGVlMmYyYTRhMTQ3MTFhNzc3NTU5YTc5MjI0NjYyOSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5uYW1lIn0seyJ2YWx1ZSI6IjY2MDYwMTgwMzA0NmNlM2MzYzEwODA3NWQ5OTc1ZTA0ZGRhMDI3ODEzNDRlZjk2YjcwYjFlYzU0OGRlNjU4ZWUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudHlwZSJ9LHsidmFsdWUiOiJkZjZlZGNiODcxNTY3OWYzYmM5MTEzNjNlYWFhNzJkMzVhMWE4N2FlNjVjZDliNGMyN2UyZTJiOTE1YmQ2YTEwIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnByb29mLm1ldGhvZCJ9LHsidmFsdWUiOiJmMjg5MmNhZjUwYzRiYTUzNGYwNzhlZDIwODcwNzk5YTdmZDQwOTM1YzU4Njg0ODA5Mzg1NGM4M2M0ZGI0YTkwIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjRlOTM2YTljMTAyZWY2NDZjMWRhYjQ5NjE1ZGNmZjFkNjU2OThlMDYyNjQ5ZWUyODM2ZDk5NDRhYmEwNTk0ZWEiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YucmV2b2NhdGlvbi50eXBlIn0seyJ2YWx1ZSI6ImIzNzJkOTU5OGU3MTc4NmI2NzE2NWRlYjM4ZTFkMzRmMWU4OGEzYmY0NWJkNjA5Y2RhYzZkZDIzMzQ5ZjI5ZTUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEuaWRlbnRpdHlQcm9vZi50eXBlIn0seyJ2YWx1ZSI6Ijk5NzQwMmZkZWNlYzM1MmYyZWUyNGMyNDQ4NWI2MmQyODAzYTA5Njc1MmUwNTUxYTc4ZjUyYWMzZDQ1MzFkODEiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn1d",
    privacy: {
      obfuscated: [],
    },
    key: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457#controller",
    signature:
      "0x03767d1f4f66c332c63ad2ed38a64334614759f1dc69c295a3bda1299b90a4ff00200761683dbb24e41d6bf2f237c9985dbd6eb21afad4c62831ba08e9d177fb1b",
  },
} as v3.SignedWrappedDocument;

const customConfig: EthrResolverConfig = {
  networks: [{ name: "ropsten", rpcUrl: `https://ropsten.infura.io/v3/${INFURA_API_KEY}` }],
};

describe("custom resolver", () => {
  it("should resolve did using resolver", async () => {
    const did = await resolve(
      "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
      createResolver(customConfig)
    );
    expect(did).toEqual(didDoc);
  });

  it("should resolve did using verifier", async () => {
    const verify = verificationBuilder([openAttestationDidIdentityProof], {
      provider: new ethers.providers.JsonRpcProvider({ url: customConfig.networks[0].rpcUrl }),
      resolver: createResolver(customConfig),
    });
    const fragment = await verify(v3DidSigned);
    expect(fragment[0]).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "did": "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
        "verified": true,
      },
      "name": "OpenAttestationDidIdentityProof",
      "status": "VALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
  });
});
