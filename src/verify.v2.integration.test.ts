/**
 * @jest-environment node
 */

import { v2 } from "@govtechsg/open-attestation";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  isValid,
  verify,
  verificationBuilder,
  openAttestationVerifiers,
  openAttestationDidIdentityProof,
} from "./index";
import { documentMainnetValidWithCertificateStore } from "../test/fixtures/v2/documentMainnetValidWithCertificateStore";
import {
  tamperedDocumentWithCertificateStore,
  tamperedDocumentWithInvalidCertificateStore,
} from "../test/fixtures/v2/tamperedDocument";
import { documentRopstenValidWithCertificateStore } from "../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenValidWithToken } from "../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenRevokedWithToken } from "../test/fixtures/v2/documentRopstenRevokedWithToken";
import { documentRopstenRevokedWithDocumentStore } from "../test/fixtures/v2/documentRopstenRevokedWithDocumentStore";
import {
  documentRinkebyRevokedWithDocumentStore,
  documentRinkebyValidWithDocumentStore,
} from "../test/fixtures/v2/documentRinkebyWithDocumentStore";
import { documentDidSigned } from "../test/fixtures/v2/documentDidSigned";
import { documentDidWrongSignature } from "../test/fixtures/v2/documentDidWrongSignature";
import { documentDnsDidSigned } from "../test/fixtures/v2/documentDnsDidSigned";
import { documentDidMissingProof } from "../test/fixtures/v2/documentDidMissingProof";
import { documentMainnetInvalidWithOddLengthMerkleRoot } from "../test/fixtures/v2/documentMainnetInvalidWithOddLengthMerkleRoot";
import { documentMainnetInvalidWithIncorrectMerkleRoot } from "../test/fixtures/v2/documentMainnetInvalidWithIncorrectMerkleRoot";
import { documentRopstenObfuscated } from "../test/fixtures/v2/documentRopstenObfuscated";
import { INFURA_API_KEY } from "./config";
import v2DidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v2/did-revocation-store-signed-not-revoked.json";
import v2DidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v2/did-revocation-store-signed-revoked.json";
import v2DnsDidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v2/dnsdid-revocation-store-signed-not-revoked.json";
import v2DnsDidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v2/dnsdid-revocation-store-signed-revoked.json";
import { getFailingFragments } from "../test/utils";

const v2DidSignedRevocationStoreNotRevoked = v2DidSignedRevocationStoreNotRevokedRaw as v2.SignedWrappedDocument;
const v2DidSignedRevocationStoreButRevoked = v2DidSignedRevocationStoreButRevokedRaw as v2.SignedWrappedDocument;

const v2DnsDidSignedRevocationStoreNotRevoked = v2DnsDidSignedRevocationStoreNotRevokedRaw as v2.SignedWrappedDocument;
const v2DnsDidSignedRevocationStoreButRevoked = v2DnsDidSignedRevocationStoreButRevokedRaw as v2.SignedWrappedDocument;

const verifyHomestead = verify;
const verifyRopsten = verificationBuilder(openAttestationVerifiers, { network: "ropsten" });
const verifyRinkeby = verificationBuilder(openAttestationVerifiers, { network: "rinkeby" });

describe("verify(integration)", () => {
  afterEach(() => {
    delete process.env.ETHEREUM_PROVIDER;
  });
  it("should skip all verifiers when the document is an empty object", async () => {
    const fragments = await verifyRopsten({} as any);
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
    const results = await verifyHomestead(tamperedDocumentWithCertificateStore);
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
    const results = await verifyRopsten(tamperedDocumentWithInvalidCertificateStore);
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
    const fragments = await verifyRopsten(documentRopstenObfuscated as any);
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
                  "address": "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
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
              "value": "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
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

  it("should be valid for all checks when document with certificate store is valid on main net", async () => {
    const results = await verifyHomestead(documentMainnetValidWithCertificateStore);
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
                  "address": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
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
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should be valid for all checks when document with certificate store is valid on ropsten", async () => {
    const results = await verifyRopsten(documentRopstenValidWithCertificateStore);
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
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should be valid for all checks when document with token registry is valid on ropsten", async () => {
    const results = await verifyRopsten(documentRopstenValidWithToken);
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
                "address": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
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
              "value": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
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

  describe("Handling HTTP response errors", () => {
    const server = setupServer(); // Placing the following tests in a separate block due to how msw intercepts ALL connections
    beforeAll(() => server.listen()); // Enable API mocking before tests
    afterEach(() => server.resetHandlers()); // Reset any runtime request handlers we may add during the tests
    afterAll(() => server.close()); // Disable API mocking after the tests are done

    it("should return SERVER_ERROR when Ethers cannot connect to Infura with a valid certificate (HTTP 429)", async () => {
      server.use(
        rest.post(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, (req, res, ctx) => {
          return res(
            ctx.status(429, "Mocked rate limit error"),
            ctx.json({ jsonrpc: "2.0", result: "0xs0meR4nd0mErr0r", id: 1 })
          );
        })
      );
      const results = await verifyHomestead(documentMainnetValidWithCertificateStore);
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
            "data": [Error: Unable to connect to the Ethereum network, please try again later],
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 500,
              "codeString": "SERVER_ERROR",
              "message": "Unable to connect to the Ethereum network, please try again later",
            },
            "status": "ERROR",
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
      // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
      expect(isValid(results)).toStrictEqual(false);
      expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
      expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false); // Because of SERVER_ERROR
    });
    it("should return SERVER_ERROR when Ethers cannot connect to Infura with a valid certificate (HTTP 502)", async () => {
      server.use(
        rest.post(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, (req, res, ctx) => {
          return res(
            ctx.status(502, "Mocked rate limit error"),
            ctx.json({ jsonrpc: "2.0", result: "0xs0meR4nd0mErr0r", id: 2 })
          );
        })
      );
      const results = await verifyHomestead(documentMainnetValidWithCertificateStore);
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
            "data": [Error: Unable to connect to the Ethereum network, please try again later],
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 500,
              "codeString": "SERVER_ERROR",
              "message": "Unable to connect to the Ethereum network, please try again later",
            },
            "status": "ERROR",
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
      // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
      expect(isValid(results)).toStrictEqual(false);
      expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
      expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false); // Because of SERVER_ERROR
    });
    it("should return SERVER_ERROR when Ethers cannot connect to Infura with an invalid certificate (HTTP 429)", async () => {
      // NOTE: Purpose of this test is to use a mainnet cert on ropsten. The mainnet cert store is perfectly valid, but does not exist on ropsten.
      server.use(
        rest.post(`https://ropsten.infura.io/v3/${INFURA_API_KEY}`, (req, res, ctx) => {
          return res(
            ctx.status(429, "Mocked rate limit error"),
            ctx.json({ jsonrpc: "2.0", result: "0xs0meR4nd0mErr0r", id: 3 })
          );
        })
      );
      const results = await verifyRopsten(documentMainnetValidWithCertificateStore);
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
            "data": [Error: Unable to connect to the Ethereum network, please try again later],
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 500,
              "codeString": "SERVER_ERROR",
              "message": "Unable to connect to the Ethereum network, please try again later",
            },
            "status": "ERROR",
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
      // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
      expect(isValid(results)).toStrictEqual(false);
      expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
      expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false); // Because of SERVER_ERROR
    });
    it("should return SERVER_ERROR when Ethers cannot connect to Infura with an invalid certificate (HTTP 502)", async () => {
      // NOTE: Purpose of this test is to use a mainnet cert on ropsten. The mainnet cert store is perfectly valid, but does not exist on ropsten.
      server.use(
        rest.post(`https://ropsten.infura.io/v3/${INFURA_API_KEY}`, (req, res, ctx) => {
          return res(
            ctx.status(502, "Mocked rate limit error"),
            ctx.json({ jsonrpc: "2.0", result: "0xs0meR4nd0mErr0r", id: 4 })
          );
        })
      );
      const results = await verifyRopsten(documentMainnetValidWithCertificateStore);
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
            "data": [Error: Unable to connect to the Ethereum network, please try again later],
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 500,
              "codeString": "SERVER_ERROR",
              "message": "Unable to connect to the Ethereum network, please try again later",
            },
            "status": "ERROR",
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
      // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
      expect(isValid(results)).toStrictEqual(false);
      expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
      expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false); // Because of SERVER_ERROR
    });
  });

  it("should fail for OpenAttestationEthereumTokenRegistryStatus when document with token registry was not issued", async () => {
    const results = await verifyRopsten(documentRopstenRevokedWithToken);
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
                "address": "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
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
              "location": "tradetrust.io",
              "status": "VALID",
              "value": "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
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
    const results = await verifyRopsten(documentRopstenRevokedWithDocumentStore);
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
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e452 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
            "message": "Document 0x3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e452 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
              "location": "tradetrust.io",
              "reason": Object {
                "code": 4,
                "codeString": "MATCHING_RECORD_NOT_FOUND",
                "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              },
              "status": "INVALID",
              "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 4,
            "codeString": "MATCHING_RECORD_NOT_FOUND",
            "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
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

  it("should work when document with document store has been issued to rinkeby network", async () => {
    const results = await verifyRinkeby(documentRinkebyValidWithDocumentStore);
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
                  "address": "0x718B518565B81097b185661EBba3966Ff32A0039",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x718B518565B81097b185661EBba3966Ff32A0039",
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
              "value": "0x718B518565B81097b185661EBba3966Ff32A0039",
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

  it("should work when document with document store has been issued and revoked to rinkeby network", async () => {
    const results = await verifyRinkeby(documentRinkebyRevokedWithDocumentStore);
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
                  "address": "0x718B518565B81097b185661EBba3966Ff32A0039",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x718B518565B81097b185661EBba3966Ff32A0039",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x92c04840038856f29890720bb57db655b9131ad2f93cf29cefcf17ea84dfb7d5 has been revoked under contract 0x718B518565B81097b185661EBba3966Ff32A0039",
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
            "message": "Document 0x92c04840038856f29890720bb57db655b9131ad2f93cf29cefcf17ea84dfb7d5 has been revoked under contract 0x718B518565B81097b185661EBba3966Ff32A0039",
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
              "value": "0x718B518565B81097b185661EBba3966Ff32A0039",
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
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(true);
  });

  it("should fail with document signed directly with DID (default verifier)", async () => {
    const results = await verifyRinkeby(documentDidSigned);
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
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
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
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(true);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(false);
    expect(isValid(results)).toStrictEqual(false);
  });

  it("should pass with document signed directly with DID with custom verifier", async () => {
    const customVerify = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
      network: "rinkeby",
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
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
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
              "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
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

  it("should pass with document signed directly with DID and have top level identity as DNS", async () => {
    const results = await verifyRinkeby(documentDnsDidSigned);
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
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
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
              "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
              "location": "example.tradetrust.io",
              "status": "VALID",
            },
          ],
          "name": "OpenAttestationDnsDidIdentityProof",
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

  it("should fail with document incorrectly signed with DID", async () => {
    const results = await verifyRinkeby(documentDidWrongSignature);
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
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": false,
                  "reason": Object {
                    "code": 7,
                    "codeString": "WRONG_SIGNATURE",
                    "message": "merkle root is not signed correctly by 0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
                  },
                },
              ],
              "revocation": Array [
                Object {
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": false,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 7,
            "codeString": "WRONG_SIGNATURE",
            "message": "merkle root is not signed correctly by 0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
          },
          "status": "INVALID",
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
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(false);
    expect(isValid(results)).toStrictEqual(false);
  });

  it("should fail with document with missing DID signature", async () => {
    const results = await verifyRinkeby(documentDidMissingProof);
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
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(false);
    expect(isValid(results)).toStrictEqual(false);
  });
  it("should return valid fragments for document issued correctly with DID & using DID identity proof, but not revoked on a document store", async () => {
    const customVerify = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
      network: "ropsten",
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
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
              "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
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
    const fragments = await verifyRopsten(v2DnsDidSignedRevocationStoreNotRevoked);
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
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
              "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
              "location": "example.tradetrust.io",
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
      network: "ropsten",
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
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x65f1e3c2a042dc9648f26f08257fd47a3739e40606d2dc887fe7566c8290144c has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
            "message": "Document 0x65f1e3c2a042dc9648f26f08257fd47a3739e40606d2dc887fe7566c8290144c has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
      ]
    `);
  });
  it("should return invalid fragments for DID documents, using DNS-DID identity proof that have been revoked", async () => {
    const fragments = await verifyRopsten(v2DnsDidSignedRevocationStoreButRevoked);
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
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x18dd9adb48fd72f54e954cd661e8778520d3676d4ab470384946791cd7aaf809 has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
            "message": "Document 0x18dd9adb48fd72f54e954cd661e8778520d3676d4ab470384946791cd7aaf809 has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
      ]
    `);
  });
});
