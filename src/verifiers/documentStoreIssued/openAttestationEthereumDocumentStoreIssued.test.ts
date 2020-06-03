import { openAttestationEthereumDocumentStoreIssued } from "./openAttestationEthereumDocumentStoreIssued";
import { documentRopstenValidWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenNotIssuedWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithDocumentStore";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import { documentRopstenValidWithDocumentStore as v2documentRopstenValidWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import {
  documentRopstenValidWithDocumentStore,
  documentRopstenValidWithTokenRegistry,
} from "../../../test/fixtures/v3/documentRopstenValid";
import { documentRopstenNotIssued } from "../../../test/fixtures/v3/documentRopstenNotIssued";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { verificationBuilder } from "../verificationBuilder";
import { documentRopstenValidWithDocumentStoreAndSignature } from "../../../test/fixtures/v2/documentRopstenValidWithDocumentStoreAndSignature";

const verify = verificationBuilder([openAttestationEthereumDocumentStoreIssued]);

describe("openAttestationEthereumDocumentStoreIssued", () => {
  describe("v2", () => {
    it("should return an invalid fragment when document has certificate store that does not exist", async () => {
      const fragment = await verify(
        {
          ...documentRopstenNotIssuedWithCertificateStore,
          data: {
            ...documentRopstenNotIssuedWithCertificateStore.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithCertificateStore.data.issuers[0],
                certificateStore:
                  "60a8bb36-ab89-4dec-be0e-575b5c59141c:string:0x0000000000000000000000000000000000000000",
              },
            ],
          },
        },
        {
          network: "ropsten",
        }
      );
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: [
              {
                address: "0x0000000000000000000000000000000000000000",
                issued: false,
                reason: {
                  code: 404,
                  codeString: "CONTRACT_NOT_FOUND",
                  message: "Contract 0x0000000000000000000000000000000000000000 was not found",
                },
              },
            ],
            issuedOnAll: false,
          },
          reason: {
            code: 404,
            codeString: "CONTRACT_NOT_FOUND",
            message: "Contract 0x0000000000000000000000000000000000000000 was not found",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return an invalid fragment when document has invalid certificate store", async () => {
      const fragment = await verify(
        {
          ...documentRopstenNotIssuedWithCertificateStore,
          data: {
            ...documentRopstenNotIssuedWithCertificateStore.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithCertificateStore.data.issuers[0],
                certificateStore: "60a8bb36-ab89-4dec-be0e-575b5c59141c:string:0xabcd",
              },
            ],
          },
        },
        {
          network: "ropsten",
        }
      );
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: [
              {
                address: "0xabcd",
                issued: false,
                reason: {
                  code: 2,
                  codeString: "CONTRACT_ADDRESS_INVALID",
                  message: "Contract address 0xabcd is invalid",
                },
              },
            ],
            issuedOnAll: false,
          },
          reason: {
            code: 2,
            codeString: "CONTRACT_ADDRESS_INVALID",
            message: "Contract address 0xabcd is invalid",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return an invalid fragment when document has invalid ens name certificate store", async () => {
      const fragment = await verify(
        {
          ...documentRopstenNotIssuedWithCertificateStore,
          data: {
            ...documentRopstenNotIssuedWithCertificateStore.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithCertificateStore.data.issuers[0],
                certificateStore: "60a8bb36-ab89-4dec-be0e-575b5c59141c:string:0xomgthisisnotgood",
              },
            ],
          },
        },
        {
          network: "ropsten",
        }
      );
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: [
              {
                address: "0xomgthisisnotgood",
                issued: false,
                reason: {
                  code: 2,
                  codeString: "CONTRACT_ADDRESS_INVALID",
                  message: "Contract address 0xomgthisisnotgood is invalid",
                },
              },
            ],
            issuedOnAll: false,
          },
          reason: {
            code: 2,
            codeString: "CONTRACT_ADDRESS_INVALID",
            message: "Contract address 0xomgthisisnotgood is invalid",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return an invalid fragment when document has invalid certificate store with bad checksum", async () => {
      const fragment = await verify(
        {
          ...documentRopstenNotIssuedWithCertificateStore,
          data: {
            ...documentRopstenNotIssuedWithCertificateStore.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithCertificateStore.data.issuers[0],
                certificateStore:
                  "60a8bb36-ab89-4dec-be0e-575b5c59141c:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cd3", // replaced last D by d
              },
            ],
          },
        },
        {
          network: "ropsten",
        }
      );
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: [
              {
                address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cd3",
                issued: false,
                reason: {
                  code: 2,
                  codeString: "CONTRACT_ADDRESS_INVALID",
                  message: "Contract address 0x8Fc57204c35fb9317D91285eF52D6b892EC08cd3 is invalid",
                },
              },
            ],
            issuedOnAll: false,
          },
          reason: {
            code: 2,
            codeString: "CONTRACT_ADDRESS_INVALID",
            message: "Contract address 0x8Fc57204c35fb9317D91285eF52D6b892EC08cd3 is invalid",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return an invalid fragment when document with certificate store has not been issued", async () => {
      const fragment = await verify(documentRopstenNotIssuedWithCertificateStore, {
        network: "ropsten",
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: [
              {
                address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                issued: false,
                reason: {
                  code: 1,
                  codeString: "DOCUMENT_NOT_ISSUED",
                  message:
                    "Certificate 0x2e97b28b1cb7ca50179af42f1f5581591251a2d93dd6dac75fafc8a69077f4ed has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                },
              },
            ],
            issuedOnAll: false,
          },
          reason: {
            code: 1,
            codeString: "DOCUMENT_NOT_ISSUED",
            message:
              "Certificate 0x2e97b28b1cb7ca50179af42f1f5581591251a2d93dd6dac75fafc8a69077f4ed has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return an invalid fragment when document with document store has not been issued", async () => {
      const fragment = await verify(documentRopstenNotIssuedWithDocumentStore, {
        network: "ropsten",
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: [
              {
                address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                issued: false,
                reason: {
                  code: 1,
                  codeString: "DOCUMENT_NOT_ISSUED",
                  message:
                    "Certificate 0xda7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                },
              },
            ],
            issuedOnAll: false,
          },
          reason: {
            code: 1,
            codeString: "DOCUMENT_NOT_ISSUED",
            message:
              "Certificate 0xda7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return a valid fragment when document with certificate store has been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        documentRopstenValidWithCertificateStore,
        {
          network: "ropsten",
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true,
            },
          ],
          issuedOnAll: true,
        },
        status: "VALID",
      });
    });
    it("should return a valid fragment when document with document store has been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        v2documentRopstenValidWithDocumentStore,
        {
          network: "ropsten",
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true,
            },
          ],
          issuedOnAll: true,
        },
        status: "VALID",
      });
    });
    it("should return an invalid fragment when document mixes document store and other verifier method", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        {
          ...v2documentRopstenValidWithDocumentStore,
          data: {
            ...v2documentRopstenValidWithDocumentStore.data,
            issuers: [
              v2documentRopstenValidWithDocumentStore.data.issuers[0],
              {
                identityProof: v2documentRopstenValidWithDocumentStore.data.issuers[0].identityProof,
                name: "Other Issuer",
              },
            ],
          },
        },
        {
          network: "ropsten",
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true,
            },
            {
              address: "",
              issued: false,
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address  is invalid",
              },
            },
          ],
          issuedOnAll: false,
        },
        reason: { code: 2, codeString: "CONTRACT_ADDRESS_INVALID", message: "Contract address  is invalid" },
        status: "INVALID",
      });
    });
    it("should return a skipped fragment when document uses token registry", async () => {
      const test = await verify(documentRopstenNotIssuedWithTokenRegistry, {
        network: "ropsten",
      });
      expect(test).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          reason: {
            code: 4,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
          },
          status: "SKIPPED",
          type: "DOCUMENT_STATUS",
        },
      ]);
    });
    it("should return a skipped fragment when document uses document store but is self signed", async () => {
      const test = await verify(documentRopstenValidWithDocumentStoreAndSignature, {
        network: "ropsten",
      });
      expect(test).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          reason: {
            code: 4,
            codeString: "SKIPPED",
            message: "Document uses signed proof",
          },
          status: "SKIPPED",
          type: "DOCUMENT_STATUS",
        },
      ]);
    });
  });
  describe("v3", () => {
    it("should return an invalid fragment when document has document store that does not exist", async () => {
      const fragment = await verify(
        {
          ...documentRopstenNotIssued,
          data: {
            ...documentRopstenNotIssued.data,
            proof: {
              ...documentRopstenNotIssued.data.proof,
              value: "0b9bbe75-8421-4e70-a176-cba76843216d:string:0x0000000000000000000000000000000000000000",
            },
          },
        },
        {
          network: "ropsten",
        }
      );
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: {
              address: "0x0000000000000000000000000000000000000000",
              issued: false,
              reason: {
                code: 404,
                codeString: "CONTRACT_NOT_FOUND",
                message: "Contract 0x0000000000000000000000000000000000000000 was not found",
              },
            },
            issuedOnAll: false,
          },
          reason: {
            code: 404,
            codeString: "CONTRACT_NOT_FOUND",
            message: "Contract 0x0000000000000000000000000000000000000000 was not found",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return an invalid fragment when document with document store has not been issued", async () => {
      const fragment = await verify(documentRopstenNotIssued, {
        network: "ropsten",
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: false,
              reason: {
                code: 1,
                codeString: "DOCUMENT_NOT_ISSUED",
                message:
                  "Certificate 0x76cb959f49db0cffc05107af4a3ecef14092fd445d9acb0c2e7e27908d262142 has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              },
            },
            issuedOnAll: false,
          },
          reason: {
            code: 1,
            codeString: "DOCUMENT_NOT_ISSUED",
            message:
              "Certificate 0x76cb959f49db0cffc05107af4a3ecef14092fd445d9acb0c2e7e27908d262142 has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return a valid fragment when document with document store has been issued", async () => {
      const fragment = await verify(documentRopstenValidWithDocumentStore, {
        network: "ropsten",
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          type: "DOCUMENT_STATUS",
          data: {
            details: {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true,
            },
            issuedOnAll: true,
          },
          status: "VALID",
        },
      ]);
    });
    it("should return a skipped fragment when document uses token registry", async () => {
      const test = await verify(documentRopstenValidWithTokenRegistry, {
        network: "ropsten",
      });
      expect(test).toStrictEqual([
        {
          name: "OpenAttestationEthereumDocumentStoreIssued",
          reason: {
            code: 4,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
          },
          status: "SKIPPED",
          type: "DOCUMENT_STATUS",
        },
      ]);
    });
  });
});
