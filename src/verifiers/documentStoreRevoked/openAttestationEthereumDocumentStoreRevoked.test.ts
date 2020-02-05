import { openAttestationEthereumDocumentStoreRevoked } from "./openAttestationEthereumDocumentStoreRevoked";
import { documentRopstenRevokedWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenRevokedWithDocumentStore";
import { documentRopstenNotIssuedWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithDocumentStore";
import { documentRopstenRevokedWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenRevokedWithCertificateStore";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import {
  documentRopstenValidWithDocumentStore as v3documentRopstenValidWithDocumentStore,
  documentRopstenValidWithTokenRegistry
} from "../../../test/fixtures/v3/documentRopstenValid";
import { documentRopstenRevoked } from "../../../test/fixtures/v3/documentRopstenRevoked";
import { documentRopstenValidWithDocumentStore as v2documentRopstenValidWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";

describe("openAttestationEthereumDocumentStoreRevoked", () => {
  // TODO create a verifier and call it to test this => check dns verifier test
  describe("test", () => {
    it("should return true when v2 document has at least one certificate store", () => {
      const test = openAttestationEthereumDocumentStoreRevoked.test(documentRopstenNotIssuedWithCertificateStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
    it("should return true when v2 document has at least one document store", () => {
      const test = openAttestationEthereumDocumentStoreRevoked.test(documentRopstenNotIssuedWithDocumentStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
    it("should return false when v2 document uses token registry", () => {
      const test = openAttestationEthereumDocumentStoreRevoked.test(documentRopstenNotIssuedWithTokenRegistry, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(false);
    });
    it("should return true when v3 document uses DOCUMENT_STORE method", () => {
      const test = openAttestationEthereumDocumentStoreRevoked.test(v3documentRopstenValidWithDocumentStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
    it("should return false when v3 document uses TOKEN_REGISTRY method", () => {
      const test = openAttestationEthereumDocumentStoreRevoked.test(documentRopstenValidWithTokenRegistry, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(false);
    });
  });
  describe("v2", () => {
    it("should return an invalid fragment when document store is invalid", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(
        {
          ...documentRopstenRevokedWithDocumentStore,
          data: {
            ...documentRopstenRevokedWithDocumentStore.data,
            issuers: [
              {
                ...documentRopstenRevokedWithDocumentStore.data.issuers[0],
                documentStore: "0c837c55-4948-4a5a-9ed3-801889db9ce3:string:0xabcd"
              }
            ]
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0xabcd",
              revoked: true,
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address 0xabcd is invalid"
              }
            }
          ],
          revokedOnAny: true
        },
        reason: {
          code: 2,
          codeString: "CONTRACT_ADDRESS_INVALID",
          message: "Contract address 0xabcd is invalid"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document store does not exists", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(
        {
          ...documentRopstenRevokedWithDocumentStore,
          data: {
            ...documentRopstenRevokedWithDocumentStore.data,
            issuers: [
              {
                ...documentRopstenRevokedWithDocumentStore.data.issuers[0],
                documentStore: "0c837c55-4948-4a5a-9ed3-801889db9ce3:string:0x0000000000000000000000000000000000000000"
              }
            ]
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x0000000000000000000000000000000000000000",
              revoked: true,
              reason: {
                code: 404,
                codeString: "CONTRACT_NOT_FOUND",
                message: "Contract 0x0000000000000000000000000000000000000000 was not found"
              }
            }
          ],
          revokedOnAny: true
        },
        reason: {
          code: 404,
          codeString: "CONTRACT_NOT_FOUND",
          message: "Contract 0x0000000000000000000000000000000000000000 was not found"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document with document store has been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(
        documentRopstenRevokedWithDocumentStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: true,
              reason: {
                code: 1,
                codeString: "DOCUMENT_REVOKED",
                message:
                  "Certificate 0x3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e452 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
              }
            }
          ],
          revokedOnAny: true
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_REVOKED",
          message:
            "Certificate 0x3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e452 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document with certificate store has been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(
        documentRopstenRevokedWithCertificateStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: true,
              reason: {
                code: 1,
                codeString: "DOCUMENT_REVOKED",
                message:
                  "Certificate 0xa874e4c79b27ddd3701984aaff9bc8bd30248f3214401d53ff238286900204a6 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
              }
            }
          ],
          revokedOnAny: true
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_REVOKED",
          message:
            "Certificate 0xa874e4c79b27ddd3701984aaff9bc8bd30248f3214401d53ff238286900204a6 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
        status: "INVALID"
      });
    });
    it("should return a valid fragment when document with document store has not been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(
        documentRopstenNotIssuedWithDocumentStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false
            }
          ],
          revokedOnAny: false
        },
        status: "VALID"
      });
    });
    it("should return a valid fragment when document with certificate store has not been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(
        documentRopstenNotIssuedWithCertificateStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false
            }
          ],
          revokedOnAny: false
        },
        status: "VALID"
      });
    });
    it("should return an error fragment when document mixes document store and other verifier method", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(
        {
          ...v2documentRopstenValidWithDocumentStore,
          data: {
            ...v2documentRopstenValidWithDocumentStore.data,
            issuers: [
              v2documentRopstenValidWithDocumentStore.data.issuers[0],
              {
                identityProof: v2documentRopstenValidWithDocumentStore.data.issuers[0].identityProof,
                name: "Foo Issuer"
              }
            ]
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false
            },
            {
              address: "",
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address  is invalid"
              },
              revoked: true
            }
          ],
          revokedOnAny: true
        },

        reason: {
          code: 2,
          codeString: "CONTRACT_ADDRESS_INVALID",
          message: "Contract address  is invalid"
        },
        status: "INVALID"
      });
    });
  });
  describe("v3", () => {
    it("should return an invalid fragment when document with document store has been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(documentRopstenRevoked, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
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
        status: "INVALID"
      });
    });

    it("should return a valid fragment when document with document store has not been revoked", async () => {
      const fragment = await openAttestationEthereumDocumentStoreRevoked.verify(
        v3documentRopstenValidWithDocumentStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS",
        data: {
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            revoked: false
          },
          revokedOnAny: false
        },
        status: "VALID"
      });
    });
  });
});
