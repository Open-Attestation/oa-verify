/**
 * @jest-environment node
 */

import { v2 } from "@govtechsg/open-attestation";

import v2DidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v2/did-revocation-store-signed-not-revoked.json";
import v2DidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v2/did-revocation-store-signed-revoked.json";
import v2DnsDidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v2/dnsdid-revocation-store-signed-not-revoked.json";
import v2DnsDidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v2/dnsdid-revocation-store-signed-revoked.json";

import { documentDidSigned } from "../test/fixtures/v2/documentDidSigned";
import { documentDnsDidSigned } from "../test/fixtures/v2/documentDnsDidSigned";
import { documentSepoliaNotIssuedTokenRegistry } from "../test/fixtures/v2/documentSepoliaNotIssuedTokenRegistry";
import { documentSepoliaObfuscated } from "../test/fixtures/v2/documentSepoliaObfuscated";
import { documentSepoliaRevokedWithDocumentStore } from "../test/fixtures/v2/documentSepoliaRevokedWithDocumentStore";
import { documentSepoliaValidWithDocumentStore } from "../test/fixtures/v2/documentSepoliaValidWithDocumentStore";
import { documentSepoliaValidWithToken } from "../test/fixtures/v2/documentSepoliaValidWithToken";
import { documentMainnetInvalidWithIncorrectMerkleRoot } from "../test/fixtures/v2/documentMainnetInvalidWithIncorrectMerkleRoot";
import { documentMainnetInvalidWithOddLengthMerkleRoot } from "../test/fixtures/v2/documentMainnetInvalidWithOddLengthMerkleRoot";

import { tamperedDocument, tamperedDocumentInvalid } from "../test/fixtures/v2/tamperedDocument";
import { getFailingFragments } from "../test/utils";
import {
  isValid,
  openAttestationDidIdentityProof,
  openAttestationVerifiers,
  verificationBuilder,
  verify,
} from "./index";

const v2DidSignedRevocationStoreNotRevoked = v2DidSignedRevocationStoreNotRevokedRaw as v2.SignedWrappedDocument;
const v2DidSignedRevocationStoreButRevoked = v2DidSignedRevocationStoreButRevokedRaw as v2.SignedWrappedDocument;

const v2DnsDidSignedRevocationStoreNotRevoked = v2DnsDidSignedRevocationStoreNotRevokedRaw as v2.SignedWrappedDocument;
const v2DnsDidSignedRevocationStoreButRevoked = v2DnsDidSignedRevocationStoreButRevokedRaw as v2.SignedWrappedDocument;

const verifyHomestead = verify;
const verifySepolia = verificationBuilder(openAttestationVerifiers, { network: "sepolia" });

describe("verify(integration)", () => {
  let defaultEnvironment: NodeJS.ProcessEnv;
  beforeEach(() => {
    jest.resetModules();
    defaultEnvironment = process.env;
    process.env = Object.assign(process.env, {
      PROVIDER_NETWORK: "",
      PROVIDER_API_KEY: "",
      PROVIDER_ENDPOINT_TYPE: "",
      PROVIDER_ENDPOINT_URL: "",
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = defaultEnvironment;
    jest.spyOn(console, "warn").mockRestore();
  });

  it("should skip all verifiers when the document is an empty object", async () => {
    const fragments = await verifySepolia({} as any);
    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "OpenAttestationHash",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document does not have merkle root, target hash or data.",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments)).toStrictEqual(false);
    expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
  });

  it("should fail for everything when document's hash is invalid and certificate store is invalid", async () => {
    const results = await verifyHomestead(tamperedDocument);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": false,
          "name": "OpenAttestationHash",
          "reason": Object {
            "code": 0,
            "codeString": "DOCUMENT_TAMPERED",
            "message": "Document has been tampered with",
          },
          "status": "INVALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
                  "issued": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_ISSUED",
                    "message": "Contract is not found",
                  },
                },
              ],
            },
            "issuedOnAll": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_ISSUED",
            "message": "Contract is not found",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationHash and OpenAttestationEthereumDocumentStoreStatus when document's hash is invalid and was not issued", async () => {
    const results = await verifySepolia(tamperedDocumentInvalid);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": false,
          "name": "OpenAttestationHash",
          "reason": Object {
            "code": 0,
            "codeString": "DOCUMENT_TAMPERED",
            "message": "Document has been tampered with",
          },
          "status": "INVALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x20bc9C354A18C8178A713B9BcCFFaC2152b53991",
                  "issued": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_ISSUED",
                    "message": "Bad document store address checksum",
                  },
                },
              ],
            },
            "issuedOnAll": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_ISSUED",
            "message": "Bad document store address checksum",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
  });

  it("should be valid for all checks for a document with obfuscated fields", async () => {
    const fragments = await verifySepolia(documentSepoliaObfuscated as any);
    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "example.openattestation.com",
              "status": "VALID",
              "value": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments)).toStrictEqual(true);
    expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
  });

  it("should be valid for all checks when document with token registry is valid on sepolia", async () => {
    const results = await verifySepolia(documentSepoliaValidWithToken);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
                "minted": true,
              },
            ],
            "mintedOnAll": true,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "example.tradetrust.io",
              "status": "VALID",
              "value": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(true);
  });

  it("should be invalid with a merkle root that is odd-length", async () => {
    const results = await verifyHomestead(documentMainnetInvalidWithOddLengthMerkleRoot);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": false,
          "name": "OpenAttestationHash",
          "reason": Object {
            "code": 0,
            "codeString": "DOCUMENT_TAMPERED",
            "message": "Document has been tampered with",
          },
          "status": "INVALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x6d71da10Ae0e5B73d0565E2De46741231Eb247C7",
                  "issued": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_ISSUED",
                    "message": "Invalid call arguments",
                  },
                },
              ],
            },
            "issuedOnAll": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_ISSUED",
            "message": "Invalid call arguments",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "demo.tradetrust.io",
              "status": "VALID",
              "value": "0x6d71da10Ae0e5B73d0565E2De46741231Eb247C7",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    // Ethers would return INVALID_ARGUMENT, as merkle root is odd-length which we tampered it by removing the last char
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(true);
  });

  it("should be invalid with a merkle root that is of incorrect length", async () => {
    // incorrect length means even-length, but not 64 characters as required of merkleRoots
    const results = await verifyHomestead(documentMainnetInvalidWithIncorrectMerkleRoot);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": false,
          "name": "OpenAttestationHash",
          "reason": Object {
            "code": 0,
            "codeString": "DOCUMENT_TAMPERED",
            "message": "Document has been tampered with",
          },
          "status": "INVALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x6d71da10Ae0e5B73d0565E2De46741231Eb247C7",
                  "issued": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_ISSUED",
                    "message": "Invalid call arguments",
                  },
                },
              ],
            },
            "issuedOnAll": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_ISSUED",
            "message": "Invalid call arguments",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "demo.tradetrust.io",
              "status": "VALID",
              "value": "0x6d71da10Ae0e5B73d0565E2De46741231Eb247C7",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    // Ethers would return INVALID_ARGUMENT, as merkle root is odd-length which we tampered it by removing the last char
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(true);
  });

  it("should fail for OpenAttestationEthereumTokenRegistryStatus when document with token registry was not issued", async () => {
    const results = await verifySepolia(documentSepoliaNotIssuedTokenRegistry);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
                "minted": false,
                "reason": Object {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Document has not been issued under token registry",
                },
              },
            ],
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Document has not been issued under token registry",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "example.tradetrust.io",
              "status": "VALID",
              "value": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationEthereumDocumentStoreStatus when document was issued then subsequently revoked", async () => {
    const results = await verifySepolia(documentSepoliaRevokedWithDocumentStore);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0xae0d37f3bbdda18b9c5ab98b4e18536901e14de9a0f92c36347a0abe6afdc4df has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0xae0d37f3bbdda18b9c5ab98b4e18536901e14de9a0f92c36347a0abe6afdc4df has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "example.openattestation.com",
              "status": "VALID",
              "value": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should pass with document signed directly with DID with custom verifier", async () => {
    const customVerify = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
      network: "sepolia",
    });
    const results = await customVerify(documentDidSigned);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "data": Array [
            Object {
              "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
              "verified": true,
            },
          ],
          "name": "OpenAttestationDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(true);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    expect(isValid(results)).toStrictEqual(true);
  });

  it("should return valid fragments for document issued correctly with DID & using DID identity proof, but not revoked on a document store", async () => {
    const customVerify = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
      network: "sepolia",
    });
    const fragments = await customVerify(v2DidSignedRevocationStoreNotRevoked);
    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "data": Array [
            Object {
              "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
              "verified": true,
            },
          ],
          "name": "OpenAttestationDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
    expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    expect(isValid(fragments)).toStrictEqual(true);
  });

  it("should return valid fragments for document issued correctly with DID & using DNS-DID identity proof, but not revoked on a document store", async () => {
    const fragments = await verifySepolia(v2DnsDidSignedRevocationStoreNotRevoked);
    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "data": Array [
            Object {
              "key": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
              "location": "demo-tradetrust.openattestation.com",
              "status": "VALID",
            },
          ],
          "name": "OpenAttestationDnsDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
    expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    expect(isValid(fragments)).toStrictEqual(true);
  });

  it("should return invalid fragments for DID documents that have been revoked", async () => {
    const customVerify = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
      network: "sepolia",
    });
    const fragments = await customVerify(v2DidSignedRevocationStoreButRevoked);
    expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
    expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0xe62bfe652b62efc1918662c284a4cc531e665c7e73ee32304469723ca11698ab has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0xe62bfe652b62efc1918662c284a4cc531e665c7e73ee32304469723ca11698ab has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
      ]
    `);
  });

  it("should return invalid fragments for DID documents, using DNS-DID identity proof that have been revoked", async () => {
    const fragments = await verifySepolia(v2DnsDidSignedRevocationStoreButRevoked);
    expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
    expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
    expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x03c52b529aef3c2a90f497050ea4b72b9e6d8f09a82d295745921a647fc66a1d has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0x03c52b529aef3c2a90f497050ea4b72b9e6d8f09a82d295745921a647fc66a1d has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
      ]
    `);
  });

  it("should return the correct fragments even when process.env is used for out of the box verify for document with document store", async () => {
    // simulate loading process.env from .env file
    process.env.PROVIDER_NETWORK = "sepolia";
    process.env.PROVIDER_ENDPOINT_TYPE = "infura";
    const defaultBuilderOption = {
      network: process.env.PROVIDER_NETWORK || "homestead",
    };
    const verification = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
    const fragments = await verification(documentSepoliaValidWithDocumentStore);
    expect(fragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "example.openattestation.com",
              "status": "VALID",
              "value": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
  });

  it("should return the correct fragments when using process.env variables for did resolver", async () => {
    // simulate loading process.env from .env file
    process.env.PROVIDER_NETWORK = "sepolia";
    process.env.PROVIDER_ENDPOINT_TYPE = "infura";
    const defaultBuilderOption = {
      network: process.env.PROVIDER_NETWORK || "homestead",
    };
    const verification = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
    const didFragments = await verification(documentDidSigned);
    const dnsDidFragments = await verification(documentDnsDidSigned);
    expect(didFragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(dnsDidFragments).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "data": Array [
            Object {
              "key": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
              "location": "demo-tradetrust.openattestation.com",
              "status": "VALID",
            },
          ],
          "name": "OpenAttestationDnsDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
  });
});
