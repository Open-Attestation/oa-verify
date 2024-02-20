import { obfuscate, v3 } from "@tradetrust-tt/tradetrust";
import { getFailingFragments, getFragmentsByName } from "../test/utils";
import { isValid, openAttestationDidIdentityProof, openAttestationVerifiers, verificationBuilder } from "./index";

import v3DidInvalidSignedRaw from "../test/fixtures/v3/did-invalid-signed.json";
import v3DidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v3/did-revocation-store-signed-not-revoked.json";
import v3DidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v3/did-revocation-store-signed-revoked.json";
import v3DidSignedRaw from "../test/fixtures/v3/did-signed.json";
import v3DidWrappedRaw from "../test/fixtures/v3/did-wrapped.json";

import v3DnsDidInvalidSignedRaw from "../test/fixtures/v3/dnsdid-invalid-signed.json";
import v3DnsDidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v3/dnsdid-revocation-store-signed-not-revoked.json";
import v3DnsDidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v3/dnsdid-revocation-store-signed-revoked.json";
import v3DnsDidSignedRaw from "../test/fixtures/v3/dnsdid-signed.json";
import v3DnsDidWrappedRaw from "../test/fixtures/v3/dnsdid-wrapped.json";

import v3DocumentStoreInvalidIssuedRaw from "../test/fixtures/v3/documentStore-invalid-issued.json";
import v3DocumentStoreIssuedRaw from "../test/fixtures/v3/documentStore-issued.json";
import v3DocumentStoreRevokedRaw from "../test/fixtures/v3/documentStore-revoked.json";
import v3DocumentStoreWrappedRaw from "../test/fixtures/v3/documentStore-wrapped.json";

import v3TokenRegistryInvalidIssuedRaw from "../test/fixtures/v3/tokenRegistry-invalid-issued.json";
import v3TokenRegistryIssuedRaw from "../test/fixtures/v3/tokenRegistry-issued.json";
import v3TokenRegistryWrappedRaw from "../test/fixtures/v3/tokenRegistry-wrapped.json";

const v3DidWrapped = v3DidWrappedRaw as v3.WrappedDocument;
const v3DidSigned = v3DidSignedRaw as v3.SignedWrappedDocument;
const v3DidInvalidSigned = v3DidInvalidSignedRaw as v3.SignedWrappedDocument;
const v3DidSignedRevocationStoreNotRevoked = v3DidSignedRevocationStoreNotRevokedRaw as v3.SignedWrappedDocument;
const v3DidSignedRevocationStoreButRevoked = v3DidSignedRevocationStoreButRevokedRaw as v3.SignedWrappedDocument;

const v3DnsDidWrapped = v3DnsDidWrappedRaw as v3.WrappedDocument;
const v3DnsDidSigned = v3DnsDidSignedRaw as v3.SignedWrappedDocument;
const v3DnsDidInvalidSigned = v3DnsDidInvalidSignedRaw as v3.SignedWrappedDocument;
const v3DnsDidSignedRevocationStoreNotRevoked = v3DnsDidSignedRevocationStoreNotRevokedRaw as v3.SignedWrappedDocument;
const v3DnsDidSignedRevocationStoreButRevoked = v3DnsDidSignedRevocationStoreButRevokedRaw as v3.SignedWrappedDocument;

const v3DocumentStoreIssued = v3DocumentStoreIssuedRaw as v3.WrappedDocument;
const v3DocumentStoreWrapped = v3DocumentStoreWrappedRaw as v3.WrappedDocument;
const v3DocumentStoreRevoked = v3DocumentStoreRevokedRaw as v3.WrappedDocument;
const v3DocumentStoreInvalidIssued = v3DocumentStoreInvalidIssuedRaw as v3.WrappedDocument;

const v3TokenRegistryIssued = v3TokenRegistryIssuedRaw as v3.WrappedDocument;
const v3TokenRegistryWrapped = v3TokenRegistryWrappedRaw as v3.WrappedDocument;
const v3TokenRegistryInvalidIssued = v3TokenRegistryInvalidIssuedRaw as v3.WrappedDocument;

const verifySepolia = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
  network: "sepolia",
});

describe("verify v3(integration)", () => {
  beforeEach(() => {
    jest.resetModules();
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
    delete process.env.PROVIDER_NETWORK;
    delete process.env.PROVIDER_API_KEY;
    delete process.env.PROVIDER_ENDPOINT_TYPE;
    delete process.env.PROVIDER_ENDPOINT_URL;
    jest.spyOn(console, "warn").mockRestore();
  });

  describe("valid documents", () => {
    it("should return valid fragments for document issued correctly with DID & using DID identity proof", async () => {
      const fragments = await verifySepolia(v3DidSigned);
      const valid = isValid(fragments);
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
                "issuance": Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
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
            "data": Object {
              "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
              "verified": true,
            },
            "name": "OpenAttestationDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with DID & using DID identity proof, but not revoked on a document store", async () => {
      const fragments = await verifySepolia(v3DidSignedRevocationStoreNotRevoked);
      const valid = isValid(fragments);
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
                "issuance": Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
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
            "data": Object {
              "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
              "verified": true,
            },
            "name": "OpenAttestationDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with DID & using DNS-DID identity proof", async () => {
      const fragments = await verifySepolia(v3DnsDidSigned);
      const valid = isValid(fragments);
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
                "issuance": Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
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
            "data": Object {
              "key": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
              "location": "demo-tradetrust.openattestation.com",
              "status": "VALID",
            },
            "name": "OpenAttestationDnsDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document is not using DID as top level identifier or has not been wrapped",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with DID & using DNS-DID identity proof, but not revoked  on a document store", async () => {
      const fragments = await verifySepolia(v3DnsDidSignedRevocationStoreNotRevoked);
      const valid = isValid(fragments);
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
                "issuance": Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
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
            "data": Object {
              "key": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
              "location": "demo-tradetrust.openattestation.com",
              "status": "VALID",
            },
            "name": "OpenAttestationDnsDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document is not using DID as top level identifier or has not been wrapped",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with document store & using DNS-TXT identity proof", async () => {
      const fragments = await verifySepolia(v3DocumentStoreIssued);
      const valid = isValid(fragments);
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
                "issuance": Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "revoked": false,
                },
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
            "data": Object {
              "identifier": "example.openattestation.com",
              "value": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
            },
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
          Object {
            "name": "OpenAttestationDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document is not using DID as top level identifier or has not been wrapped",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with token registry & using DNS-TXT identity proof", async () => {
      const fragments = await verifySepolia(v3TokenRegistryIssued);
      const valid = isValid(fragments);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "data": Object {
              "details": Object {
                "address": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
                "minted": true,
              },
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
            "data": Object {
              "identifier": "example.tradetrust.io",
              "value": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
            },
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
          Object {
            "name": "OpenAttestationDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document is not using DID as top level identifier or has not been wrapped",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for documents correctly issued but with data obfuscated", async () => {
      const obfuscated = obfuscate(v3DidSigned, ["reference"]);
      expect(obfuscated.reference).toBe(undefined);
      const fragments = await verifySepolia(obfuscated);
      const valid = isValid(fragments);
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
                "issuance": Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
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
            "data": Object {
              "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
              "verified": true,
            },
            "name": "OpenAttestationDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });

    it("should return the correct fragments even when process.env is used for out of the box verify for document with document store", async () => {
      // simulate loading process.env from .env file
      process.env.PROVIDER_NETWORK = "sepolia";
      process.env.PROVIDER_ENDPOINT_TYPE = "infura";
      const defaultBuilderOption = {
        network: process.env.PROVIDER_NETWORK || "homestead",
      };
      const verification = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
      const fragments = await verification(v3DocumentStoreIssued);
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
                "issuance": Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "revoked": false,
                },
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
            "data": Object {
              "identifier": "example.openattestation.com",
              "value": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
            },
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
    it("should use the defaults to connect to provider even when process.env is not there for document with document store", async () => {
      const defaultBuilderOption = {
        network: process.env.PROVIDER_NETWORK || "homestead",
      };
      const verification = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
      const fragments = await verification(v3DocumentStoreIssued);
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
                "issuance": Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "issued": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_ISSUED",
                    "message": "Contract is not found",
                  },
                },
                "revocation": Object {
                  "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Contract is not found",
                  },
                  "revoked": true,
                },
              },
              "issuedOnAll": false,
              "revokedOnAny": true,
            },
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 5,
              "codeString": "DOCUMENT_REVOKED",
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
            "data": Object {
              "identifier": "example.openattestation.com",
              "value": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
            },
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 4,
              "codeString": "MATCHING_RECORD_NOT_FOUND",
              "message": "Matching DNS record not found for 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
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
    });
    it("should return the correct fragments when using process.env variables for did resolver", async () => {
      // simulate loading process.env from .env file
      process.env.PROVIDER_NETWORK = "sepolia";
      process.env.PROVIDER_ENDPOINT_TYPE = "alchemy";
      const defaultBuilderOption = {
        network: process.env.PROVIDER_NETWORK || "homestead",
      };
      const verification = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
      const didFragments = await verification(v3DidSigned);
      const dnsDidFragments = await verification(v3DnsDidSigned);
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
                "issuance": Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
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
                "issuance": Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
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
            "data": Object {
              "key": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
              "location": "demo-tradetrust.openattestation.com",
              "status": "VALID",
            },
            "name": "OpenAttestationDnsDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
    });
  });
  describe("invalid documents", () => {
    describe("document store", () => {
      it("should return invalid fragments for documents that has been tampered", async () => {
        const tamperedDocument: v3.WrappedDocument = {
          ...v3DocumentStoreIssued,
          issuer: {
            id: "https://example.com",
            name: "DEMO STORE (TAMPERED)",
          },
        };
        const fragments = await verifySepolia(tamperedDocument);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
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
            ]
          `);
      });
      it("should return invalid fragments for document that has not been issued", async () => {
        const fragments = await verifySepolia(v3DocumentStoreWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
                  Array [
                    Object {
                      "data": Object {
                        "details": Object {
                          "issuance": Object {
                            "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                            "issued": false,
                            "reason": Object {
                              "code": 1,
                              "codeString": "DOCUMENT_NOT_ISSUED",
                              "message": "Document 0x19988397c756599f8415200eaa2a413e5b60212d7d21dbc22bb365ae115c6b83 has not been issued under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                            },
                          },
                          "revocation": Object {
                            "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                            "revoked": false,
                          },
                        },
                        "issuedOnAll": false,
                        "revokedOnAny": false,
                      },
                      "name": "OpenAttestationEthereumDocumentStoreStatus",
                      "reason": Object {
                        "code": 1,
                        "codeString": "DOCUMENT_NOT_ISSUED",
                        "message": "Document 0x19988397c756599f8415200eaa2a413e5b60212d7d21dbc22bb365ae115c6b83 has not been issued under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                      },
                      "status": "INVALID",
                      "type": "DOCUMENT_STATUS",
                    },
                  ]
              `);
      });
      it("should return invalid fragments for document that has been revoked", async () => {
        const fragments = await verifySepolia(v3DocumentStoreRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
                  Array [
                    Object {
                      "data": Object {
                        "details": Object {
                          "issuance": Object {
                            "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                            "issued": true,
                          },
                          "revocation": Object {
                            "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                            "reason": Object {
                              "code": 5,
                              "codeString": "DOCUMENT_REVOKED",
                              "message": "Document 0x8e9f71e4526782631acd06d6d88cd1debf3be28375a5d122f03640ec71c1e981 has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                            },
                            "revoked": true,
                          },
                        },
                        "issuedOnAll": true,
                        "revokedOnAny": true,
                      },
                      "name": "OpenAttestationEthereumDocumentStoreStatus",
                      "reason": Object {
                        "code": 5,
                        "codeString": "DOCUMENT_REVOKED",
                        "message": "Document 0x8e9f71e4526782631acd06d6d88cd1debf3be28375a5d122f03640ec71c1e981 has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                      },
                      "status": "INVALID",
                      "type": "DOCUMENT_STATUS",
                    },
                  ]
              `);
      });
      it("should return invalid fragments for documents that is using invalid DNS but correctly issued", async () => {
        const fragments = await verifySepolia(v3DocumentStoreInvalidIssued);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "identifier": "notinuse.tradetrust.io",
                "value": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
              },
              "name": "OpenAttestationDnsTxtIdentityProof",
              "reason": Object {
                "code": 4,
                "codeString": "MATCHING_RECORD_NOT_FOUND",
                "message": "Matching DNS record not found for 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
              },
              "status": "INVALID",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
    });

    describe("token registry", () => {
      it("should return invalid fragments for documents that has been tampered", async () => {
        const tamperedDocument: v3.WrappedDocument = {
          ...v3TokenRegistryIssued,
          issuer: {
            id: "https://example.com",
            name: "DEMO STORE (TAMPERED)",
          },
        };
        const fragments = await verifySepolia(tamperedDocument);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
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
            ]
          `);
      });
      it("should return invalid fragments for document that has not been issued", async () => {
        const fragments = await verifySepolia(v3TokenRegistryWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "address": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
                  "minted": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_MINTED",
                    "message": "Document has not been issued under token registry",
                  },
                },
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
          ]
        `);
      });
      it("should return invalid fragments for documents that is using invalid DNS but correctly issued", async () => {
        const fragments = await verifySepolia(v3TokenRegistryInvalidIssued);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "identifier": "notinuse.tradetrust.io",
                "value": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
              },
              "name": "OpenAttestationDnsTxtIdentityProof",
              "reason": Object {
                "code": 4,
                "codeString": "MATCHING_RECORD_NOT_FOUND",
                "message": "Matching DNS record not found for 0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
              },
              "status": "INVALID",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
    });

    describe("did (DNS-DID)", () => {
      it("should return invalid fragments for documents that has been tampered", async () => {
        const tamperedDocument: v3.WrappedDocument = {
          ...v3DnsDidSigned,
          issuer: {
            id: "https://example.com",
            name: "DEMO STORE (TAMPERED)",
          },
        };
        const fragments = await verifySepolia(tamperedDocument);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
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
          ]
        `);
      });
      it("should return skipped fragments for documents that has not been signed", async () => {
        const fragments = await verifySepolia(v3DnsDidWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFragmentsByName(fragments, "OpenAttestationDnsDidIdentityProof")).toMatchInlineSnapshot(`
          Array [
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
      it("should return invalid fragments for documents with revocation method obfuscated", async () => {
        const obfuscated = obfuscate(v3DnsDidSigned, ["openAttestationMetadata.proof.revocation"]);
        const fragments = await verifySepolia(obfuscated);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": [Error: revocation block not found for an issuer],
              "name": "OpenAttestationDidSignedDocumentStatus",
              "reason": Object {
                "code": 2,
                "codeString": "MISSING_REVOCATION",
                "message": "revocation block not found for an issuer",
              },
              "status": "ERROR",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that is using invalid DNS but correctly signed", async () => {
        const fragments = await verifySepolia(v3DnsDidInvalidSigned);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "key": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
                "location": "notinuse.tradetrust.io",
                "status": "INVALID",
              },
              "name": "OpenAttestationDnsDidIdentityProof",
              "reason": Object {
                "code": 6,
                "codeString": "INVALID_IDENTITY",
                "message": "Could not find identity at location",
              },
              "status": "INVALID",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that have been revoked", async () => {
        const fragments = await verifySepolia(v3DnsDidSignedRevocationStoreButRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0xa05efdb7d3bca55c7d36946837f2b3b6ac6e5c9ed178645f98f296e4f06657ea has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                    },
                    "revoked": true,
                  },
                },
                "issuedOnAll": true,
                "revokedOnAny": true,
              },
              "name": "OpenAttestationDidSignedDocumentStatus",
              "reason": Object {
                "code": 5,
                "codeString": "DOCUMENT_REVOKED",
                "message": "Document 0xa05efdb7d3bca55c7d36946837f2b3b6ac6e5c9ed178645f98f296e4f06657ea has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
    });

    describe("did (DID)", () => {
      it("should return invalid fragments for documents that has been tampered", async () => {
        const tamperedDocument: v3.WrappedDocument = {
          ...v3DidSigned,
          issuer: {
            id: "https://example.com",
            name: "DEMO STORE (TAMPERED)",
          },
        };
        const fragments = await verifySepolia(tamperedDocument);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
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
          ]
        `);
      });
      it("should return invalid fragments for documents that has not been signed", async () => {
        const fragments = await verifySepolia(v3DidWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": [Error: Document is not signed],
              "name": "OpenAttestationDidIdentityProof",
              "reason": Object {
                "code": 5,
                "codeString": "UNSIGNED",
                "message": "Document is not signed",
              },
              "status": "ERROR",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents with revocation method obfuscated", async () => {
        const obfuscated = obfuscate(v3DidSigned, ["openAttestationMetadata.proof.revocation"]);
        const fragments = await verifySepolia(obfuscated);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": [Error: revocation block not found for an issuer],
              "name": "OpenAttestationDidSignedDocumentStatus",
              "reason": Object {
                "code": 2,
                "codeString": "MISSING_REVOCATION",
                "message": "revocation block not found for an issuer",
              },
              "status": "ERROR",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that is using invalid DNS but correctly signed", async () => {
        const fragments = await verifySepolia(v3DidInvalidSigned);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "key": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
                "location": "notinuse.tradetrust.io",
                "status": "INVALID",
              },
              "name": "OpenAttestationDnsDidIdentityProof",
              "reason": Object {
                "code": 6,
                "codeString": "INVALID_IDENTITY",
                "message": "Could not find identity at location",
              },
              "status": "INVALID",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that have been revoked", async () => {
        const fragments = await verifySepolia(v3DidSignedRevocationStoreButRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0x3ad46614034b8d9d00b81d09612344f44c88f28901ca575c655c957cf038f7d4 has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
                    },
                    "revoked": true,
                  },
                },
                "issuedOnAll": true,
                "revokedOnAny": true,
              },
              "name": "OpenAttestationDidSignedDocumentStatus",
              "reason": Object {
                "code": 5,
                "codeString": "DOCUMENT_REVOKED",
                "message": "Document 0x3ad46614034b8d9d00b81d09612344f44c88f28901ca575c655c957cf038f7d4 has been revoked under contract 0xe943C95f456DA8e17c6d1a915eCF1a6ef0a182a8",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
    });
  });
});
