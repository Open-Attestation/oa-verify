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
              revoked: true
            }
          ],
          revokedOnAny: true
        },
        message: "Certificate has been revoked",
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
              revoked: true
            }
          ],
          revokedOnAny: true
        },
        message: "Certificate has been revoked",
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
        data: new Error(`No document store for issuer "Foo Issuer"`),
        message: `No document store for issuer "Foo Issuer"`,
        status: "ERROR"
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
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: true
            }
          ],
          revokedOnAny: true
        },
        message: "Certificate has been revoked",
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
  });
});
