import { isValid, verify } from "./index";
import {
  documentRopstenValidWithDocumentStore,
  documentRopstenValidWithTokenRegistry,
} from "../test/fixtures/v3/documentRopstenValid";
import { documentRopstenTampered } from "../test/fixtures/v3/documentRopstenTampered";
import { documentRopstenNotIssued } from "../test/fixtures/v3/documentRopstenNotIssued";
import { documentRopstenRevoked } from "../test/fixtures/v3/documentRopstenRevoked";

describe("verify v3(integration)", () => {
  it("should fail for OpenAttestationHash when document's hash is invalid and OpenAttestationDnsTxt when identity is invalid", async () => {
    const results = await verify(documentRopstenTampered, { network: "ropsten" });

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
          "data": Object {
            "location": "some.io",
            "reason": Object {
              "code": 4,
              "codeString": "MATCHING_RECORD_NOT_FOUND",
              "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            },
            "status": "INVALID",
            "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 4,
            "codeString": "MATCHING_RECORD_NOT_FOUND",
            "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDid",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
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
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });
  it("should fail for OpenAttestationEthereumDocumentStoreStatus when document was not issued and OpenAttestationDnsTxt when identity is invalid", async () => {
    const results = await verify(documentRopstenNotIssued, { network: "ropsten" });

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
              "issuance": Object {
                "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                "issued": false,
                "reason": "Document 0x76cb959f49db0cffc05107af4a3ecef14092fd445d9acb0c2e7e27908d262142 has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              },
            },
            "issuedOnAll": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_ISSUED",
            "message": "Document 0x76cb959f49db0cffc05107af4a3ecef14092fd445d9acb0c2e7e27908d262142 has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "location": "some.io",
            "reason": Object {
              "code": 4,
              "codeString": "MATCHING_RECORD_NOT_FOUND",
              "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            },
            "status": "INVALID",
            "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 4,
            "codeString": "MATCHING_RECORD_NOT_FOUND",
            "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDid",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
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
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationEthereumDocumentStoreStatus when document was issued an revoked and OpenAttestationDnsTxt when identity is invalid", async () => {
    const results = await verify(documentRopstenRevoked, { network: "ropsten" });

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
              "issuance": Object {
                "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                "reason": "Document 0xba106f273697b46862f5842fc805902fa65d1f41d50953e0aeb815e43e989fc1 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
            "message": "Document 0xba106f273697b46862f5842fc805902fa65d1f41d50953e0aeb815e43e989fc1 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "location": "some.io",
            "reason": Object {
              "code": 4,
              "codeString": "MATCHING_RECORD_NOT_FOUND",
              "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            },
            "status": "INVALID",
            "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 4,
            "codeString": "MATCHING_RECORD_NOT_FOUND",
            "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDid",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
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
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationDnsTxt when identity is invalid and be valid for remaining checks when document with certificate store is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithDocumentStore, { network: "ropsten" });

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
          "data": Object {
            "location": "some.io",
            "reason": Object {
              "code": 4,
              "codeString": "MATCHING_RECORD_NOT_FOUND",
              "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            },
            "status": "INVALID",
            "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 4,
            "codeString": "MATCHING_RECORD_NOT_FOUND",
            "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDid",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
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
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should fail for OpenAttestationDnsTxt when identity is invalid and be valid for remaining checks when document with token registry is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithTokenRegistry, { network: "ropsten" });

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
            "details": Object {
              "address": "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
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
          "data": Object {
            "location": "some.io",
            "reason": Object {
              "code": 4,
              "codeString": "MATCHING_RECORD_NOT_FOUND",
              "message": "Matching DNS record not found for 0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
            },
            "status": "INVALID",
            "value": "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
          },
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 4,
            "codeString": "MATCHING_RECORD_NOT_FOUND",
            "message": "Matching DNS record not found for 0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDid",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
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
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });
});
