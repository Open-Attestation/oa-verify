import { v3, WrappedDocument } from "@govtechsg/open-attestation";
import { documentSepoliaRevokedWithDocumentStore } from "../../../../test/fixtures/v2/documentSepoliaRevokedWithDocumentStore";
import { documentSepoliaValidWithDocumentStore as v2documentSepoliaValidWithDocumentStore } from "../../../../test/fixtures/v2/documentSepoliaValidWithDocumentStore";
import { documentMixedIssuance } from "../../../../test/fixtures/v2/documentMixedIssuance";
import { documentNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentNotIssuedWithTokenRegistry";
import { getProvider } from "../../../common/utils";
import { openAttestationEthereumDocumentStoreStatus } from "./ethereumDocumentStoreStatus";

// v3 documents
import v3DidSignedRaw from "../../../../test/fixtures/v3/did-signed.json";
import v3DocumentStoreIssuedRaw from "../../../../test/fixtures/v3/documentStore-issued.json";
import v3DocumentStoreRevokedRaw from "../../../../test/fixtures/v3/documentStore-revoked.json";
import v3DocumentStoreWrappedRaw from "../../../../test/fixtures/v3/documentStore-wrapped.json";
import v3TokenRegistryIssuedRaw from "../../../../test/fixtures/v3/tokenRegistry-issued.json";

const v3DocumentStoreWrapped = v3DocumentStoreWrappedRaw as WrappedDocument<v3.OpenAttestationDocument>;
const v3DocumentStoreIssued = v3DocumentStoreIssuedRaw as WrappedDocument<v3.OpenAttestationDocument>;
const v3DidSigned = v3DidSignedRaw as WrappedDocument<v3.OpenAttestationDocument>;
const v3TokenRegistryIssued = v3TokenRegistryIssuedRaw as WrappedDocument<v3.OpenAttestationDocument>;
const v3DocumentStoreRevoked = v3DocumentStoreRevokedRaw as WrappedDocument<v3.OpenAttestationDocument>;

const options = { provider: getProvider({ network: "sepolia" }) };

describe("test", () => {
  describe("v2", () => {
    it("should return false when document does not have data", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        { ...v2documentSepoliaValidWithDocumentStore, data: null } as any,
        options
      );
      expect(shouldVerify).toBe(false);
    });
    it("should return false when document does not have issuers", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        {
          ...v2documentSepoliaValidWithDocumentStore,
          data: { ...v2documentSepoliaValidWithDocumentStore.data, issuers: null },
        } as any,
        options
      );
      expect(shouldVerify).toBe(false);
    });
    it("should return false when document uses token registry", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        documentNotIssuedWithTokenRegistry,
        options
      );
      expect(shouldVerify).toBe(false);
    });
    it("should return true when document uses document store", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        documentSepoliaRevokedWithDocumentStore,
        options
      );
      expect(shouldVerify).toBe(true);
    });
  });
  describe("v3", () => {
    it("should return true for documents not yet issued via document store", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(v3DocumentStoreWrapped, options);
      expect(shouldVerify).toBe(true);
    });
    it("should return true for documents issued via document store", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(v3DocumentStoreIssued, options);
      expect(shouldVerify).toBe(true);
    });
    it("should return false for documents issued via token registry", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(v3TokenRegistryIssued, options);
      expect(shouldVerify).toBe(false);
    });
    it("should return false for documents issued via did signing", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(v3DidSigned, options);
      expect(shouldVerify).toBe(false);
    });
  });
});

describe("verify", () => {
  describe("v2", () => {
    it("should return an invalid fragment when document store is invalid", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        {
          ...documentSepoliaRevokedWithDocumentStore,
          data: {
            ...documentSepoliaRevokedWithDocumentStore.data,
            issuers: [
              {
                ...documentSepoliaRevokedWithDocumentStore.data.issuers[0],
                documentStore: "0c837c55-4948-4a5a-9ed3-801889db9ce3:string:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
              },
            ],
          },
        },
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
        }
      `);
    });
    it("should return an invalid fragment when document store does not exists", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        {
          ...documentSepoliaRevokedWithDocumentStore,
          data: {
            ...documentSepoliaRevokedWithDocumentStore.data,
            issuers: [
              {
                ...documentSepoliaRevokedWithDocumentStore.data.issuers[0],
                documentStore: "0c837c55-4948-4a5a-9ed3-801889db9ce3:string:0x0000000000000000000000000000000000000000",
              },
            ],
          },
        },
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x0000000000000000000000000000000000000000",
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
        }
      `);
    });

    it("should return an invalid fragment when document with document store that has been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        documentSepoliaRevokedWithDocumentStore,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
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
        }
      `);
    });

    it("should return a valid fragment when document with document store that has not been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        v2documentSepoliaValidWithDocumentStore,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
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
        }
      `);
    });

    it("should return an invalid fragment when used with other issuance methods", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(documentMixedIssuance, options);

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Document store address not found in issuer DEMO STORE],
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 7,
            "codeString": "INVALID_ISSUERS",
            "message": "Document store address not found in issuer DEMO STORE",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });
  describe("v3", () => {
    it("should return valid fragment for document issued correctly on a document store", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(v3DocumentStoreIssued, options);
      expect(fragment).toMatchInlineSnapshot(`
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
        }
      `);
    });
    it("should return an invalid fragment for document not issued on a document store", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(v3DocumentStoreWrapped, options);
      expect(fragment).toMatchInlineSnapshot(`
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
        }
      `);
    });
    it("should return an invalid fragment for document issued but revoked on a document store", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(v3DocumentStoreRevoked, options);
      expect(fragment).toMatchInlineSnapshot(`
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
        }
      `);
    });
  });
});

describe("skip", () => {
  it("should return a skip fragment", async () => {
    const skipFragment = await openAttestationEthereumDocumentStoreStatus.skip(
      openAttestationEthereumDocumentStoreStatus as any,
      options
    );
    expect(skipFragment).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationEthereumDocumentStoreStatus",
        "reason": Object {
          "code": 4,
          "codeString": "SKIPPED",
          "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
        },
        "status": "SKIPPED",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });
});
