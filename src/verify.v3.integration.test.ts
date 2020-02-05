import { isValid, verify } from "./index";
import {
  documentRopstenValidWithDocumentStore,
  documentRopstenValidWithTokenRegistry
} from "../test/fixtures/v3/documentRopstenValid";
import { documentRopstenTampered } from "../test/fixtures/v3/documentRopstenTampered";
import { documentRopstenNotIssued } from "../test/fixtures/v3/documentRopstenNotIssued";
import { documentRopstenRevoked } from "../test/fixtures/v3/documentRopstenRevoked";

describe("verify v3(integration)", () => {
  it("should fail for OpenAttestationHash when document's hash is invalid and OpenAttestationDnsTxt when identity is invalid", async () => {
    const results = await verify(documentRopstenTampered, { network: "ropsten" });

    expect(results).toStrictEqual([
      {
        data: false,
        reason: {
          code: 0,
          codeString: "DOCUMENT_TAMPERED",
          message: "Certificate has been tampered with"
        },
        status: "INVALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            issued: true
          },
          issuedOnAll: true
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            revoked: false
          },
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          location: "some.io",
          status: "INVALID",
          value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        reason: {
          code: 1,
          codeString: "INVALID_IDENTITY",
          message: "Certificate issuer identity is invalid"
        },
        name: "OpenAttestationDnsTxt",
        status: "INVALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });
  it("should fail for OpenAttestationEthereumDocumentStoreIssued when document was not issued and OpenAttestationDnsTxt when identity is invalid", async () => {
    const results = await verify(documentRopstenNotIssued, { network: "ropsten" });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            issued: false,
            reason: {
              code: 1,
              codeString: "DOCUMENT_NOT_ISSUED",
              message:
                "Certificate 0x76cb959f49db0cffc05107af4a3ecef14092fd445d9acb0c2e7e27908d262142 has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
            }
          },
          issuedOnAll: false
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_NOT_ISSUED",
          message:
            "Certificate 0x76cb959f49db0cffc05107af4a3ecef14092fd445d9acb0c2e7e27908d262142 has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        status: "INVALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            revoked: false
          },
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          location: "some.io",
          status: "INVALID",
          value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        reason: {
          code: 1,
          codeString: "INVALID_IDENTITY",
          message: "Certificate issuer identity is invalid"
        },
        name: "OpenAttestationDnsTxt",
        status: "INVALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationEthereumDocumentStoreRevoked when document was not issued and OpenAttestationDnsTxt when identity is invalid", async () => {
    const results = await verify(documentRopstenRevoked, { network: "ropsten" });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            issued: true
          },
          issuedOnAll: true
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            revoked: true,
            reason: {
              code: 1,
              codeString: "DOCUMENT_REVOKED",
              message:
                "Certificate 0xba106f273697b46862f5842fc805902fa65d1f41d50953e0aeb815e43e989fc1 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
            }
          },
          revokedOnAny: true
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_REVOKED",
          message:
            "Certificate 0xba106f273697b46862f5842fc805902fa65d1f41d50953e0aeb815e43e989fc1 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        status: "INVALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          location: "some.io",
          status: "INVALID",
          value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        reason: {
          code: 1,
          codeString: "INVALID_IDENTITY",
          message: "Certificate issuer identity is invalid"
        },
        name: "OpenAttestationDnsTxt",
        status: "INVALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationDnsTxt when identity is invalid and be valid for remaining checks when document with certificate store is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithDocumentStore, { network: "ropsten" });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            issued: true
          },
          issuedOnAll: true
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            revoked: false
          },
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          location: "some.io",
          status: "INVALID",
          value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        reason: {
          code: 1,
          codeString: "INVALID_IDENTITY",
          message: "Certificate issuer identity is invalid"
        },
        name: "OpenAttestationDnsTxt",
        status: "INVALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should fail for OpenAttestationDnsTxt when identity is invalid and be valid for remaining checks when document with token registry is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithTokenRegistry, { network: "ropsten" });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message:
            'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method'
        },
        name: "OpenAttestationEthereumDocumentStoreIssued",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: {
            address: "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
            minted: true
          },
          mintedOnAll: true
        },
        status: "VALID",
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message:
            'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method'
        },
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          location: "some.io",
          status: "INVALID",
          value: "0xb53499ee758352fAdDfCed863d9ac35C809E2F20"
        },
        reason: {
          code: 1,
          codeString: "INVALID_IDENTITY",
          message: "Certificate issuer identity is invalid"
        },
        name: "OpenAttestationDnsTxt",
        status: "INVALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });
});
