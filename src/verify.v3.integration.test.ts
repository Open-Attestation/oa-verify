import { v3, obfuscate } from "@govtechsg/open-attestation";
import { isValid, verificationBuilder, openAttestationVerifiers, openAttestationDidIdentityProof } from "./index";
import { getFailingFragments, getFragmentsByName } from "../test/utils";

import v3DidWrappedRaw from "../test/fixtures/v3/did-wrapped.json";
import v3DidSignedRaw from "../test/fixtures/v3/did-signed.json";
import v3DidInvalidSignedRaw from "../test/fixtures/v3/did-invalid-signed.json";
import v3DidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v3/did-revocation-store-signed-not-revoked.json";
import v3DidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v3/did-revocation-store-signed-revoked.json";

import v3DnsDidWrappedRaw from "../test/fixtures/v3/dnsdid-wrapped.json";
import v3DnsDidSignedRaw from "../test/fixtures/v3/dnsdid-signed.json";
import v3DnsDidInvalidSignedRaw from "../test/fixtures/v3/dnsdid-invalid-signed.json";
import v3DnsDidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v3/dnsdid-revocation-store-signed-not-revoked.json";
import v3DnsDidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v3/dnsdid-revocation-store-signed-revoked.json";

import v3DocumentStoreIssuedRaw from "../test/fixtures/v3/documentStore-issued.json";
import v3DocumentStoreRevokedRaw from "../test/fixtures/v3/documentStore-revoked.json";
import v3DocumentStoreWrappedRaw from "../test/fixtures/v3/documentStore-wrapped.json";
import v3DocumentStoreInvalidIssuedRaw from "../test/fixtures/v3/documentStore-invalid-issued.json";

import v3TokenRegistryIssuedRaw from "../test/fixtures/v3/tokenRegistry-issued.json";
import v3TokenRegistryWrappedRaw from "../test/fixtures/v3/tokenRegistry-wrapped.json";
import v3TokenRegistryInvalidIssuedRaw from "../test/fixtures/v3/tokenRegistry-invalid-issued.json";

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

const verifyRopsten = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
  network: "ropsten",
});

describe("verify v3(integration)", () => {
  describe("valid documents", () => {
    it("should return valid fragments for document issued correctly with DID & using DID identity proof", async () => {
      const fragments = await verifyRopsten(v3DidSigned);
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
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
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
              "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
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
      const fragments = await verifyRopsten(v3DidSignedRevocationStoreNotRevoked);
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
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xc7dfB2D05ab3Da91e723F2557817165e6acEAc38",
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
              "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
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
      const fragments = await verifyRopsten(v3DnsDidSigned);
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
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
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
              "key": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
              "location": "example.tradetrust.io",
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
      const fragments = await verifyRopsten(v3DnsDidSignedRevocationStoreNotRevoked);
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
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xc7dfB2D05ab3Da91e723F2557817165e6acEAc38",
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
              "key": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
              "location": "example.tradetrust.io",
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
      const fragments = await verifyRopsten(v3DocumentStoreIssued);
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
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
              "identifier": "example.tradetrust.io",
              "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
      const fragments = await verifyRopsten(v3TokenRegistryIssued);
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
                "address": "0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
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
              "value": "0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
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
      const fragments = await verifyRopsten(obfuscated);
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
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
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
              "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
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
        const fragments = await verifyRopsten(tamperedDocument);
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
        const fragments = await verifyRopsten(v3DocumentStoreWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                    "issued": false,
                    "reason": Object {
                      "code": 1,
                      "codeString": "DOCUMENT_NOT_ISSUED",
                      "message": "Document 0xdaf603bcee04e4489e624aed8d39c5f86674a34d5576031c5c3c9a5766b30885 has not been issued under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                    },
                  },
                  "revocation": Object {
                    "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
                "message": "Document 0xdaf603bcee04e4489e624aed8d39c5f86674a34d5576031c5c3c9a5766b30885 has not been issued under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
      it("should return invalid fragments for document that has been revoked", async () => {
        const fragments = await verifyRopsten(v3DocumentStoreRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0x4cefff86bef5079fd0f63a27cf2a849258cf15a6b7c9526bc63d00c7f3d3ebe8 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
                "message": "Document 0x4cefff86bef5079fd0f63a27cf2a849258cf15a6b7c9526bc63d00c7f3d3ebe8 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that is using invalid DNS but correctly issued", async () => {
        const fragments = await verifyRopsten(v3DocumentStoreInvalidIssued);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "identifier": "notinuse.tradetrust.io",
                "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              },
              "name": "OpenAttestationDnsTxtIdentityProof",
              "reason": Object {
                "code": 4,
                "codeString": "MATCHING_RECORD_NOT_FOUND",
                "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
        const fragments = await verifyRopsten(tamperedDocument);
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
        const fragments = await verifyRopsten(v3TokenRegistryWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "address": "0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
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
        const fragments = await verifyRopsten(v3TokenRegistryInvalidIssued);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "identifier": "notinuse.tradetrust.io",
                "value": "0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
              },
              "name": "OpenAttestationDnsTxtIdentityProof",
              "reason": Object {
                "code": 4,
                "codeString": "MATCHING_RECORD_NOT_FOUND",
                "message": "Matching DNS record not found for 0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
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
        const fragments = await verifyRopsten(tamperedDocument);
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
        const fragments = await verifyRopsten(v3DnsDidWrapped);
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
        const fragments = await verifyRopsten(obfuscated);
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
        const fragments = await verifyRopsten(v3DnsDidInvalidSigned);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
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
        const fragments = await verifyRopsten(v3DnsDidSignedRevocationStoreButRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0xc7dfB2D05ab3Da91e723F2557817165e6acEAc38",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0xf2a180a23e7c9917513092d4f315e9aac963388d703d20da2760788032b687b0 has been revoked under contract 0xc7dfB2D05ab3Da91e723F2557817165e6acEAc38",
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
                "message": "Document 0xf2a180a23e7c9917513092d4f315e9aac963388d703d20da2760788032b687b0 has been revoked under contract 0xc7dfB2D05ab3Da91e723F2557817165e6acEAc38",
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
        const fragments = await verifyRopsten(tamperedDocument);
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
        const fragments = await verifyRopsten(v3DidWrapped);
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
        const fragments = await verifyRopsten(obfuscated);
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
        const fragments = await verifyRopsten(v3DidInvalidSigned);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
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
        const fragments = await verifyRopsten(v3DidSignedRevocationStoreButRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0xc7dfB2D05ab3Da91e723F2557817165e6acEAc38",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0xfdd40a012f38dacedad0d7fbe68726ac47f7836c6019f9824329207b9d7e6bb1 has been revoked under contract 0xc7dfB2D05ab3Da91e723F2557817165e6acEAc38",
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
                "message": "Document 0xfdd40a012f38dacedad0d7fbe68726ac47f7836c6019f9824329207b9d7e6bb1 has been revoked under contract 0xc7dfB2D05ab3Da91e723F2557817165e6acEAc38",
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
