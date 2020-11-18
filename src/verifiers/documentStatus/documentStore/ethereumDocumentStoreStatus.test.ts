import { openAttestationEthereumDocumentStoreStatus } from "./ethereumDocumentStoreStatus";
import { documentRopstenRevokedWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenRevokedWithDocumentStore";
import { documentRopstenRevokedWithCertificateStore } from "../../../../test/fixtures/v2/documentRopstenRevokedWithCertificateStore";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import { documentRopstenValidWithDocumentStore as v3documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v3/documentRopstenValid";
import { documentRopstenValidWithCertificateStore } from "../../../../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenRevoked } from "../../../../test/fixtures/v3/documentRopstenRevoked";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { documentRopstenValidWithDocumentStore as v2documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentRopstenMixedIssuance } from "../../../../test/fixtures/v2/documentRopstenMixedIssuance";
import { verificationBuilder } from "../../verificationBuilder";

const verify = verificationBuilder([openAttestationEthereumDocumentStoreStatus], { network: "ropsten" });

describe("OpenAttestationEthereumDocumentStoreStatus", () => {
  describe("v2", () => {
    it("should return a skipped fragment when document does not have data", async () => {
      const fragment = await verify(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        { ...v2documentRopstenValidWithDocumentStore, data: null }
      );
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreStatus",
          type: "DOCUMENT_STATUS",
          reason: {
            code: 4,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
          },
          status: "SKIPPED",
        },
      ]);
    });
    it("should return a skipped fragment when document does not have issuers", async () => {
      const fragment = await verify({
        ...v2documentRopstenValidWithDocumentStore,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        data: { ...v2documentRopstenValidWithDocumentStore.data, issuers: null },
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreStatus",
          type: "DOCUMENT_STATUS",
          reason: {
            code: 4,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
          },
          status: "SKIPPED",
        },
      ]);
    });
    it("should return a skipped fragment when document uses token registry", async () => {
      const fragment = await verify(documentRopstenNotIssuedWithTokenRegistry);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreStatus",
          type: "DOCUMENT_STATUS",
          reason: {
            code: 4,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
          },
          status: "SKIPPED",
        },
      ]);
    });
    it("should return an invalid fragment when document store is invalid", async () => {
      const fragment = await verify({
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
      });
      expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
    });
    it("should return an invalid fragment when document store does not exists", async () => {
      const fragment = await verify({
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
      });
      expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
    });
    it("should return an invalid fragment when document was not issued", async () => {
      const fragment = await verify(documentRopstenNotIssuedWithCertificateStore);
      expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
    });
    it("should return an invalid fragment when document with document store that has been revoked", async () => {
      const fragment = await verify(documentRopstenRevokedWithDocumentStore);
      expect(fragment).toMatchInlineSnapshot(`
        Array [
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
        ]
      `);
    });
    it("should return an invalid fragment when document with certificate store that has been revoked", async () => {
      const fragment = await verify(documentRopstenRevokedWithCertificateStore);
      expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
    });
    it("should return a valid fragment when document with document store that has not been revoked", async () => {
      const fragment = await verify(v2documentRopstenValidWithDocumentStore);

      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreStatus",
          type: "DOCUMENT_STATUS",
          data: {
            issuedOnAll: true,
            revokedOnAny: false,
            details: {
              issuance: [
                {
                  issued: true,
                  address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                },
              ],
              revocation: [
                {
                  revoked: false,
                  address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                },
              ],
            },
          },
          status: "VALID",
        },
      ]);
    });
    it("should return a valid fragment when document with certificate store that has not been revoked", async () => {
      const fragment = await verify(documentRopstenValidWithCertificateStore);

      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreStatus",
          type: "DOCUMENT_STATUS",
          data: {
            issuedOnAll: true,
            revokedOnAny: false,
            details: {
              issuance: [
                {
                  issued: true,
                  address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                },
              ],
              revocation: [
                {
                  revoked: false,
                  address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                },
              ],
            },
          },
          status: "VALID",
        },
      ]);
    });
    it("should return an invalid fragment when used with other issuance methods", async () => {
      const fragment = await verify(documentRopstenMixedIssuance);

      expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
    });
  });
  describe("v3", () => {
    it("should return an invalid fragment when document with document store that has been revoked", async () => {
      const fragment = await verify(documentRopstenRevoked);
      expect(fragment).toMatchInlineSnapshot(`
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
                    "message": "Document 0xba106f273697b46862f5842fc805902fa65d1f41d50953e0aeb815e43e989fc1 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
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
              "message": "Document 0xba106f273697b46862f5842fc805902fa65d1f41d50953e0aeb815e43e989fc1 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            },
            "status": "INVALID",
            "type": "DOCUMENT_STATUS",
          },
        ]
      `);
    });
    it("should return a valid fragment when document with document store that has not been revoked", async () => {
      const fragment = await verify(v3documentRopstenValidWithDocumentStore);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreStatus",
          type: "DOCUMENT_STATUS",
          data: {
            issuedOnAll: true,
            revokedOnAny: false,
            details: {
              issuance: {
                issued: true,
                address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              },
              revocation: {
                revoked: false,
                address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              },
            },
          },
          status: "VALID",
        },
      ]);
    });
  });
});
