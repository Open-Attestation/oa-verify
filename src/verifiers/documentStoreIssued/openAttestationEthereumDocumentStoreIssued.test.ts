import { openAttestationEthereumDocumentStoreIssued } from "./openAttestationEthereumDocumentStoreIssued";
import { documentRopstenValidWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenNotIssuedWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithDocumentStore";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import { documentRopstenValidWithDocumentStore as v2documentRopstenValidWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import {
  documentRopstenValidWithDocumentStore,
  documentRopstenValidWithTokenRegistry
} from "../../../test/fixtures/v3/documentRopstenValid";
import { documentRopstenNotIssued } from "../../../test/fixtures/v3/documentRopstenNotIssued";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";

describe("openAttestationEthereumDocumentStoreIssued", () => {
  describe("test", () => {
    it("should return true when v2 document has at least one certificate store", () => {
      const test = openAttestationEthereumDocumentStoreIssued.test(documentRopstenNotIssuedWithCertificateStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
    it("should return true when v2 document has at least one document store", () => {
      const test = openAttestationEthereumDocumentStoreIssued.test(documentRopstenNotIssuedWithDocumentStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
    it("should return false when v2 document uses token registry", () => {
      const test = openAttestationEthereumDocumentStoreIssued.test(documentRopstenNotIssuedWithTokenRegistry, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(false);
    });
    it("should return true when v3 document uses DOCUMENT_STORE method", () => {
      const test = openAttestationEthereumDocumentStoreIssued.test(documentRopstenValidWithDocumentStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
    it("should return false when v3 document uses TOKEN_REGISTRY method", () => {
      const test = openAttestationEthereumDocumentStoreIssued.test(documentRopstenValidWithTokenRegistry, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(false);
    });
  });
  describe("v2", () => {
    it("should return an invalid fragment when document with certificate store has not been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        documentRopstenNotIssuedWithCertificateStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: false
            }
          ],
          issuedOnAll: false
        },
        message: "Certificate has not been issued",
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document with document store has not been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        documentRopstenNotIssuedWithDocumentStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: false
            }
          ],
          issuedOnAll: false
        },
        message: "Certificate has not been issued",
        status: "INVALID"
      });
    });
    it("should return a valid fragment when document with certificate store has been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        documentRopstenValidWithCertificateStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            }
          ],
          issuedOnAll: true
        },
        status: "VALID"
      });
    });
    it("should return a valid fragment when document with document store has been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        v2documentRopstenValidWithDocumentStore,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            }
          ],
          issuedOnAll: true
        },
        status: "VALID"
      });
    });
    it("should return an error fragment when document mixes document store and other verifier method", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        {
          ...v2documentRopstenValidWithDocumentStore,
          data: {
            ...v2documentRopstenValidWithDocumentStore.data,
            issuers: [
              v2documentRopstenValidWithDocumentStore.data.issuers[0],
              {
                identityProof: v2documentRopstenValidWithDocumentStore.data.issuers[0].identityProof,
                name: "Other Issuer"
              }
            ]
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: new Error(`No document store for issuer "Other Issuer"`),
        message: `No document store for issuer "Other Issuer"`,
        status: "ERROR"
      });
    });
  });
  describe("v3", () => {
    it("should return an invalid fragment when document with document store has not been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(documentRopstenNotIssued, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: false
            }
          ],
          issuedOnAll: false
        },
        message: "Certificate has not been issued",
        status: "INVALID"
      });
    });
    it("should return a valid fragment when document with document store has been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(documentRopstenValidWithDocumentStore, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            }
          ],
          issuedOnAll: true
        },
        status: "VALID"
      });
    });
  });
});
