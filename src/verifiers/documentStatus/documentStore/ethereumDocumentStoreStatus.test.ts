import { openAttestationEthereumDocumentStoreStatus } from "./ethereumDocumentStoreStatus";
import { documentRopstenRevokedWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenRevokedWithDocumentStore";
import { documentRopstenRevokedWithCertificateStore } from "../../../../test/fixtures/v2/documentRopstenRevokedWithCertificateStore";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import { documentRopstenValidWithCertificateStore } from "../../../../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { documentRopstenValidWithDocumentStore as v2documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentRopstenMixedIssuance } from "../../../../test/fixtures/v2/documentRopstenMixedIssuance";
import { getProvider } from "../../../common/utils";

const options = { provider: getProvider({ network: "ropsten" }) };

describe("test", () => {
  describe("v2", () => {
    it("should return false when document does not have data", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        { ...v2documentRopstenValidWithDocumentStore, data: null } as any,
        options
      );
      expect(shouldVerify).toBe(false);
    });
    it("should return false when document does not have issuers", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        {
          ...v2documentRopstenValidWithDocumentStore,
          data: { ...v2documentRopstenValidWithDocumentStore.data, issuers: null },
        } as any,
        options
      );
      expect(shouldVerify).toBe(false);
    });
    it("should return false when document uses token registry", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        documentRopstenNotIssuedWithTokenRegistry,
        options
      );
      expect(shouldVerify).toBe(false);
    });
    it("should return true when document uses document store", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        documentRopstenRevokedWithDocumentStore,
        options
      );
      expect(shouldVerify).toBe(true);
    });
  });
});

describe("verify", () => {
  describe("v2", () => {
    it("should return an invalid fragment when document store is invalid", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        {
          ...documentRopstenRevokedWithDocumentStore,
          data: {
            ...documentRopstenRevokedWithDocumentStore.data,
            issuers: [
              {
                ...documentRopstenRevokedWithDocumentStore.data.issuers[0],
                documentStore: "0c837c55-4948-4a5a-9ed3-801889db9ce3:string:0xabcd",
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
                  "address": "0xabcd",
                  "issued": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_ISSUED",
                    "message": "Invalid document store address",
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
            "message": "Invalid document store address",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should return an invalid fragment when document store does not exists", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        {
          ...documentRopstenRevokedWithDocumentStore,
          data: {
            ...documentRopstenRevokedWithDocumentStore.data,
            issuers: [
              {
                ...documentRopstenRevokedWithDocumentStore.data.issuers[0],
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
    it("should return an invalid fragment when document was not issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        documentRopstenNotIssuedWithCertificateStore,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "issued": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_ISSUED",
                    "message": "Document 0x2e97b28b1cb7ca50179af42f1f5581591251a2d93dd6dac75fafc8a69077f4ed has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
            "message": "Document 0x2e97b28b1cb7ca50179af42f1f5581591251a2d93dd6dac75fafc8a69077f4ed has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should return an invalid fragment when document with document store that has been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        documentRopstenRevokedWithDocumentStore,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
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
        }
      `);
    });
    it("should return an invalid fragment when document with certificate store that has been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        documentRopstenRevokedWithCertificateStore,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
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
                    "message": "Document 0xa874e4c79b27ddd3701984aaff9bc8bd30248f3214401d53ff238286900204a6 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
            "message": "Document 0xa874e4c79b27ddd3701984aaff9bc8bd30248f3214401d53ff238286900204a6 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should return a valid fragment when document with document store that has not been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        v2documentRopstenValidWithDocumentStore,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
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
        }
      `);
    });
    it("should return a valid fragment when document with certificate store that has not been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(
        documentRopstenValidWithCertificateStore,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
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
        }
      `);
    });
    it("should return an invalid fragment when used with other issuance methods", async () => {
      const fragment = await openAttestationEthereumDocumentStoreStatus.verify(documentRopstenMixedIssuance, options);

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
