import { v3 } from "@govtechsg/open-attestation";
import { ethers } from "ethers";
import { INFURA_API_KEY } from "../config";
import { openAttestationDidIdentityProof } from "../verifiers/issuerIdentity/did/didIdentityProof";
import { verificationBuilder } from "../verifiers/verificationBuilder";
import { createResolver, EthrResolverConfig, getProviderConfig, resolve } from "./resolver";

const didDoc = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://identity.foundation/EcdsaSecp256k1RecoverySignature2020/lds-ecdsa-secp256k1-recovery2020-0.0.jsonld",
  ],
  assertionMethod: ["did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457#controller"],
  id: "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
  verificationMethod: [
    {
      id: "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457#controller",
      type: "EcdsaSecp256k1RecoveryMethod2020",
      controller: "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
      blockchainAccountId: "0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457@eip155:5",
    },
  ],
  authentication: ["did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457#controller"],
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
    id: "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
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
      value: "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
      revocation: {
        type: "NONE",
      },
    },
    identityProof: {
      type: "DID",
      identifier: "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
    },
  },
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "b87e09cfd45082d277d3f29957aead552836c0c8ea9744958c05c8554751c9d1",
    proofs: [],
    merkleRoot: "b87e09cfd45082d277d3f29957aead552836c0c8ea9744958c05c8554751c9d1",
    salts:
      "W3sidmFsdWUiOiIxMTJmMjhkODFmNTA4ZTYwOTExZWJjYWM0YWRkODRhNjkyYzBkNDU5MzFjYTM1ZWI0NmRmYmVkNjU4YzE2MGNlIiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiMmE1NGRjNTIzNWFmYjhlYTJhMjJkZDFiOGZmM2ExNjYyNmNlNTc3NjIyMzcyMWMwY2Q0NGM1NDMwYzZmMDljZSIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiIwMmRiYjM0YmU3ZWE5YjRkYjUzNTEyNGI5YmI3MTFiZGRmY2I1ZmVlNmE2NzdhZDQ2MzAxNTBhOWI0YmJmOTU4IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjJiZTFlMzYzYjMzMjg2ODg1OWE5N2VmZjU3ZDExMDRlZWQ0NzdkMzM1YWNjMTYyZTQ0ZDU3OTlhZGU3NTljOWEiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiYTMxYmMzNTMxMmRkZjE0ZmE3YTA1YzU1NjM4ZjExMWQzMDQ3MWYzNjYzYThjZDM1Y2VjMTJmN2RkNDhiMmUwNSIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiZDYyNjFlOTEwMjVmNjdhYTQ0ZGEwNGRkZWI0MmE4MThmM2ZhMDZmNDZkMmFhMWVlNmRjY2IxMzEwMjk2NGQxOCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiNWQxZTNhOWM2MmMxMTdlNTFiMjgwNzNhYjA0NTA4ZWZhNzdlODkwZmRkNWVmOWJlMTM3MTE3ODg1YzJhMDM0MSIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiJlMDU0NmNhY2E1MDBlY2EyNjhhMTM5YmIwZDYyNjZmNDI5MzM0N2Y4NTY3MTc5NzQzYTNlY2IyMzg5ZTdiMDkxIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiZGY0ZTA0MDAwMjIzNjg0ZWZiZmNlNzQwYWFlM2UzOTg2YWYyMWU0Y2ZlYjYxZDM5NWQ1NDk5NjQ0NWYxYjExZCIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjlkNmQwZGM3MDNiMThjMWVlYjI0ZjY2ZGUxODhlZGMzODMwM2M2YWRlNWU0MWQ1NzQzYmM2OWMzODEyNDQ4NDYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiNjYyZTU4NTNkZDUyY2VkM2I4MGU0YzFhNDhhYjhlMmY5OTc3NDRiZTRmZDdiOGM5ODQ1NmMzOTMyZDE0MTI2ZCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5uYW1lIn0seyJ2YWx1ZSI6ImVlMTJlZjRhZjU2Njc1ODQwYmUzNjgzYzAxZWY5ZjE5ZmNiOGNiMTkwMGY3ODRlYjY0ZWI5Njc5MjA3YjY2YzciLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudHlwZSJ9LHsidmFsdWUiOiI0MWY5ZmFkMjM0MGI3NGFkYWFmZGU4YTYwYTk1NGM3NjU5Y2NlMGM0ODY0YjNiN2ZkNjA1YTRjYmM5MDIzYWJlIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnByb29mLm1ldGhvZCJ9LHsidmFsdWUiOiJmMThkN2ZlMjUzNzg3ZTg0ZTdiN2E3ZjI1NjYzZWI3NjkwOTljZmMyMDBkMDE5NTAyNjVlNDkwMGU4MTE5YWYxIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnByb29mLnZhbHVlIn0seyJ2YWx1ZSI6ImUxN2EyYTZlM2FhY2QwNDViZGYxZjUxNTU2YTFmNTAxNzhhMWEwN2VmZDYzY2ExMDRiZWM5OThhODM0YzY5NzEiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YucmV2b2NhdGlvbi50eXBlIn0seyJ2YWx1ZSI6IjBiMzNkNDhjYzY5ODMwMTlhZmJkNzk3YWIxMTA2YzZmOGFjMjVjY2NlNjMzMzVmOGVkN2MzMzQ4YmViNmM0NGMiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEuaWRlbnRpdHlQcm9vZi50eXBlIn0seyJ2YWx1ZSI6ImNkMTUzN2MyN2NlYjdhMjhjNTA2ZDU0Y2MxN2EzMmM5NmI2MzUxMzdiZDU4M2ZiMjRmYmEyNzQwZmMwYWFmNDYiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn1d",
    privacy: {
      obfuscated: [],
    },
    key: "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457#controller",
    signature:
      "0x7ffae45f4527cafa40866736ddeda7941ce46ce4b5395c0cb8c5064064f2aa624a1e062579cdc42e51b1e65f2f9eddd6634219047d3fc449a72e097181a920b31b",
  },
} as v3.SignedWrappedDocument;

const customConfig: EthrResolverConfig = {
  networks: [{ name: "goerli", rpcUrl: `https://goerli.infura.io/v3/${INFURA_API_KEY}` }],
};

describe("custom resolver", () => {
  it("should resolve did using resolver", async () => {
    const did = await resolve(
      "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
      createResolver({ ethrResolverConfig: customConfig })
    );
    expect(did).toEqual(didDoc);
  });

  it("should resolve did using verifier", async () => {
    const verify = verificationBuilder([openAttestationDidIdentityProof], {
      provider: new ethers.providers.JsonRpcProvider({ url: customConfig.networks[0].rpcUrl }),
      resolver: createResolver({ ethrResolverConfig: customConfig }),
    });
    const fragment = await verify(v3DidSigned);
    expect(fragment[0]).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "did": "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
          "verified": true,
        },
        "name": "OpenAttestationDidIdentityProof",
        "status": "VALID",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
});

describe("getProviderConfig", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {
      PROVIDER_NETWORK: "",
      PROVIDER_API_KEY: "",
      PROVIDER_ENDPOINT_TYPE: "",
      PROVIDER_ENDPOINT_URL: "",
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.spyOn(console, "warn").mockRestore();
  });

  it("should use env variables for provider config properties for didResolver", () => {
    process.env.PROVIDER_ENDPOINT_TYPE = "alchemy";
    process.env.PROVIDER_NETWORK = "goerli";

    expect(getProviderConfig()).toEqual({
      networks: [{ name: "goerli", rpcUrl: "https://eth-goerli.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC" }],
    });
  });

  it("should set default when provider type is jsonrpc", () => {
    process.env.PROVIDER_ENDPOINT_TYPE = "jsonrpc";
    process.env.PROVIDER_NETWORK = "goerli";

    expect(getProviderConfig()).toEqual({
      networks: [{ name: "mainnet", rpcUrl: "https://mainnet.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18" }],
    });
  });

  it("should set defaults when no connection url and network is found in provider parameter object", () => {
    expect(getProviderConfig()).toEqual({
      networks: [{ name: "mainnet", rpcUrl: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213" }],
    });
  });
});
