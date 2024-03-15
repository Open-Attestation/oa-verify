import { v3, WrappedDocument } from "@tradetrust-tt/tradetrust";
import { documentHederaRevokedWithDocumentStore } from "../../../../test/fixtures/v2/documentHederaRevokedWithDocumentStore";
import { documentHederaValidWithDocumentStore as v2documentHederaValidWithDocumentStore } from "../../../../test/fixtures/v2/documentHederaValidWithDocumentStore";
import { documentMixedIssuance } from "../../../../test/fixtures/v2/documentMixedIssuance";
import { documentNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentNotIssuedWithTokenRegistry";
import { openAttestationEthereumDocumentStoreStatus } from "./ethereumDocumentStoreStatus";

// v3 documents
import v3DocumentStoreIssuedRaw from "../../../../test/fixtures/v3/documentStore-issued.json";
import v3DocumentStoreWrappedRaw from "../../../../test/fixtures/v3/documentStore-wrapped.json";
import v3TokenRegistryIssuedRaw from "../../../../test/fixtures/v3/tokenRegistry-issued.json";
import { VerifierOptions } from "../../../types/core";

const v3DocumentStoreWrapped = v3DocumentStoreWrappedRaw as WrappedDocument<v3.OpenAttestationDocument>;
const v3DocumentStoreIssued = v3DocumentStoreIssuedRaw as WrappedDocument<v3.OpenAttestationDocument>;
const v3TokenRegistryIssued = v3TokenRegistryIssuedRaw as WrappedDocument<v3.OpenAttestationDocument>;

const options = {} as VerifierOptions;
//hederatestnet
describe("test", () => {
  describe("v2", () => {
    it("should return false when document does not have data", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        { ...v2documentHederaValidWithDocumentStore, data: null } as any,
        options
      );
      expect(shouldVerify).toBe(false);
    });
    it("should return false when document does not have issuers", async () => {
      const shouldVerify = await openAttestationEthereumDocumentStoreStatus.test(
        {
          ...v2documentHederaValidWithDocumentStore,
          data: { ...v2documentHederaValidWithDocumentStore.data, issuers: null },
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
        documentHederaRevokedWithDocumentStore,
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
  });
});

describe("verify", () => {
  describe("v2", () => {
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
});
