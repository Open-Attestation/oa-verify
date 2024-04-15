import { v3 } from "@tradetrust-tt/tradetrust";
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
  assertionMethod: ["did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller"],
  id: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
  verificationMethod: [
    {
      id: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
      type: "EcdsaSecp256k1RecoveryMethod2020",
      controller: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
      blockchainAccountId: "0x1245e5B64D785b25057f7438F715f4aA5D965733@eip155:1",
    },
  ],
  authentication: ["did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller"],
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
    id: "did:ethr:0x7020be74e640afa14430f2c807f511b1559c5f60",
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
      value: "did:ethr:0x7020be74e640afa14430f2c807f511b1559c5f60",
      revocation: {
        type: "NONE",
      },
    },
    identityProof: {
      type: "DID",
      identifier: "did:ethr:0x7020be74e640afa14430f2c807f511b1559c5f60",
    },
  },
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "f01721bd6688499e63b596a76456067a762bd09da8c565e9ff4fd476250946fc",
    proofs: [],
    merkleRoot: "f01721bd6688499e63b596a76456067a762bd09da8c565e9ff4fd476250946fc",
    salts:
      "W3sidmFsdWUiOiIzZmQwNTJhM2E2N2FmZjdkZjNhMzIwNGE2N2YwMGQzYTVkZDFmYmIxOWM5MWRkMWQ2YzFlMjA2OGExZDJlMTU2IiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiYzA5ZTNkNDZjNGQ0Y2YyNjBkNDkxNzU3MzE0NzkxMTk5OGExMjhkZjI0ZmQyZDExZGIwMjEyMDRiYTE3ZjhjYiIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiIxZmNjMDllMTgxZGZhNTJkYjI1NzM5Y2M2YjAxZDcwYzU4MmYyM2YzYjZmYTIyZWZiNTRkMzljNzc0YWYyOWQ3IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6ImY2NjZlM2FiZjQ4OTA3YTJmZGVlMWIwZjNiM2U4MmYyZTc2M2Q5YTJmM2FmNTgyNDMzZjQ4MTY1NWVjN2QwMGMiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiMjNiMjIxNTIyMmUyMjIyZjhkZmE4M2IxNzM0YWRkZjBhYTJhZjFiYTI2MTI3NGIwZTlhYjU1MzZiYTBkZWUxZiIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiZGY4NzFjMmFkYTUxNjcxNGMzZWI5MGNkNGZhN2MzYmRjMjgzOGQzYzQ4NmI3M2Q2MzBkYWJhZWNmY2M5ZmVjOSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiNWI0NTMwNTI1YzZjY2YyMmYzZTg3ODc0ZTdiYTZlMTM2ZjRkODIyMGJmMGQ5NDlhNzRkYmY3YThjYzI4M2Y0OSIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiJkMDA2NmRjOGM0NDZhODZkZmYxNmU2MTQzMWU4MDY2NjgwMmYxNWQ0MTNiM2NiNDIzYzU1MGQzNTE1M2Q0MDZmIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiY2NmMjhlY2MwNTYxYmFlNTIyNDg3ZGIzNmI0ZWYxNmNlNDhiYzE2YjRlN2RiNjJiYTYxZDY2NDJiOGM5N2JjOSIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6Ijg5ZWFlNDkxYmIxM2Y1NDgyOWEzMGM2MmM1MzI0ODQ3Nzc0OTY4MjAwYTFlODY0ZTc5MTVmOGMzM2NjYzNjMjciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMjZlYzgwN2ZlOTJhMTdmYjUxMTI5MWQzOWI3MTMxNzQ4ZDYwNDYyMmJiZTIzMTMxMTYxNzE0MTRjN2JiYTJmNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5uYW1lIn0seyJ2YWx1ZSI6IjdhY2MzZmEyZDhiYTE2ZTBjYjE0YTg1NjE0OTAzMzcwNGQ3ODIxNWFhMjVmNDBjZDUxOWVmMmFjMWFkMWYxYmUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudHlwZSJ9LHsidmFsdWUiOiIzMWQyNjRmOTYwNGRiN2QxYjc4YWI1MDhkMjcwZDgzZjhmMWIxN2I3MmMwODg2YmY1MmZhZjdlYjBhYzQ4ZGUyIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnByb29mLm1ldGhvZCJ9LHsidmFsdWUiOiI5NWZkZDY4Zjc5ZTg2YTJkNjU3YjFjMDBjYTM5MjhlMWEzZGQ4MWY2ZWQxMDkxMjI0N2RmN2IyODc2ZTBkOTJlIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjIyYTM0YWM2YmNiZTM0ZmE4YjY3N2VhMzBhMGUyMzQzZmVjNDdlZDQ4ZGNiNjA1NTE5M2FiNDAwNWM5MmExZWIiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YucmV2b2NhdGlvbi50eXBlIn0seyJ2YWx1ZSI6IjA1M2ExYmMwNzZlNzVjNTE4NzMyYmJkNzJlYzI3MmJiYzk5ODkyOGNjYWY2Y2UzYzkxZmIzY2I2MWUxYzQ3ZjYiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEuaWRlbnRpdHlQcm9vZi50eXBlIn0seyJ2YWx1ZSI6ImQzYTY4NDQzODQzYWJlOGRhZDczNmVjZWFjODQyMWYzMWRlMzY1ODkyMTljYjc4ZDE5ZmM1NTI3NDM4ZWE4MmMiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn1d",
    privacy: {
      obfuscated: [],
    },
    key: "did:ethr:0x7020be74e640afa14430f2c807f511b1559c5f60#controller",
    signature:
      "0x1333ef14a32405c1e0c7f0e0926b06e0872bfcc4050b4a28668ffcee29144ef11f5bea1002e09503d7ca773226b1064bcd9e9a2f1688fe389b995ceaa3339b6f1b",
  },
} as v3.SignedWrappedDocument;

const customConfig: EthrResolverConfig = {
  networks: [{ name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}` }],
};

describe("custom resolver", () => {
  it("should resolve did using resolver", async () => {
    const resolver = createResolver({ ethrResolverConfig: customConfig });
    const did = await resolve("did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733", resolver);
    expect(did).toEqual(didDoc);
  });

  it("should resolve did using verifier", async () => {
    const verify = verificationBuilder([openAttestationDidIdentityProof], {
      provider: new ethers.providers.JsonRpcProvider({ url: customConfig.networks[0].rpcUrl }),
      resolver: createResolver({ ethrResolverConfig: customConfig }),
    });
    const fragment = await verify(v3DidSigned);
    expect(fragment[0].status).toBe("VALID");
    expect(fragment[0]).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "did": "did:ethr:0x7020be74e640afa14430f2c807f511b1559c5f60",
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
    process.env.PROVIDER_NETWORK = "mainnet";

    expect(getProviderConfig()).toEqual({
      networks: [{ name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}` }],
    });
  });

  it("should set defaults when no connection url and network is found in provider parameter object", () => {
    expect(getProviderConfig()).toEqual({
      networks: [{ name: "mainnet", rpcUrl: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213" }],
    });
  });
});
