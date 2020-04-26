import { openAttestationEthereumDocumentStoreIssued } from "./openAttestationEthereumDocumentStoreIssued";
import { openAttestationW3CDIDProof } from "../w3c-did/openAttestationW3CDIDProof";
import { openAttestationDocumentStoreIssued } from "./openAttestationDocumentStoreIssued";
import { documentRopstenValidWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenNotIssuedWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithDocumentStore";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import { documentRopstenValidWithDocumentStore as v2documentRopstenValidWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentRopstenValidWithDIDSignedProofBlock } from "../../../test/fixtures/v2/documentRopstenValidWithDIDSignedProofBlock";

import {
  documentRopstenValidWithDocumentStore,
  documentRopstenValidWithTokenRegistry
} from "../../../test/fixtures/v3/documentRopstenValid";
import { documentRopstenNotIssued } from "../../../test/fixtures/v3/documentRopstenNotIssued";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";

describe("openAttestationEthereumDocumentStoreIssued", () => {
  // TODO create a verifier and call it to test this => check dns verifier test
  describe("test", () => {
    it("should return true when v2 document has at least one certificate store", () => {
      const test = openAttestationDocumentStoreIssued.test(documentRopstenNotIssuedWithCertificateStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
    it("should return true when v2 document has a valid proof block", () => {
      const test = openAttestationDocumentStoreIssued.test(documentRopstenValidWithDIDSignedProofBlock, {
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
  describe("test with proof block", () => {
    it("should return true when v2 document has a proof block", () => {
      const test = openAttestationDocumentStoreIssued.test(documentRopstenValidWithDIDSignedProofBlock, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
  });
  describe("v2", () => {
    it("should return an invalid fragment when document has certificate store that does not exist", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        {
          ...documentRopstenNotIssuedWithCertificateStore,
          data: {
            ...documentRopstenNotIssuedWithCertificateStore.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithCertificateStore.data.issuers[0],
                certificateStore:
                  "60a8bb36-ab89-4dec-be0e-575b5c59141c:string:0x0000000000000000000000000000000000000000"
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
        data: {
          details: [
            {
              address: "0x0000000000000000000000000000000000000000",
              issued: false,
              reason: {
                code: 404,
                codeString: "CONTRACT_NOT_FOUND",
                message: "Contract 0x0000000000000000000000000000000000000000 was not found"
              }
            }
          ],
          issuedOnAll: false
        },
        reason: {
          code: 404,
          codeString: "CONTRACT_NOT_FOUND",
          message: "Contract 0x0000000000000000000000000000000000000000 was not found"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document has invalid certificate store", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        {
          ...documentRopstenNotIssuedWithCertificateStore,
          data: {
            ...documentRopstenNotIssuedWithCertificateStore.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithCertificateStore.data.issuers[0],
                certificateStore: "60a8bb36-ab89-4dec-be0e-575b5c59141c:string:0xabcd"
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
        data: {
          details: [
            {
              address: "0xabcd",
              issued: false,
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address 0xabcd is invalid"
              }
            }
          ],
          issuedOnAll: false
        },
        reason: {
          code: 2,
          codeString: "CONTRACT_ADDRESS_INVALID",
          message: "Contract address 0xabcd is invalid"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document has invalid ens name certificate store", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        {
          ...documentRopstenNotIssuedWithCertificateStore,
          data: {
            ...documentRopstenNotIssuedWithCertificateStore.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithCertificateStore.data.issuers[0],
                certificateStore: "60a8bb36-ab89-4dec-be0e-575b5c59141c:string:0xomgthisisnotgood"
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
        data: {
          details: [
            {
              address: "0xomgthisisnotgood",
              issued: false,
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address 0xomgthisisnotgood is invalid"
              }
            }
          ],
          issuedOnAll: false
        },
        reason: {
          code: 2,
          codeString: "CONTRACT_ADDRESS_INVALID",
          message: "Contract address 0xomgthisisnotgood is invalid"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document has invalid certificate store with bad checksum", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        {
          ...documentRopstenNotIssuedWithCertificateStore,
          data: {
            ...documentRopstenNotIssuedWithCertificateStore.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithCertificateStore.data.issuers[0],
                certificateStore:
                  "60a8bb36-ab89-4dec-be0e-575b5c59141c:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cd3" // replaced last D by d
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
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cd3",
              issued: false,
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address 0x8Fc57204c35fb9317D91285eF52D6b892EC08cd3 is invalid"
              }
            }
          ],
          issuedOnAll: false
        },
        reason: {
          code: 2,
          codeString: "CONTRACT_ADDRESS_INVALID",
          message: "Contract address 0x8Fc57204c35fb9317D91285eF52D6b892EC08cd3 is invalid"
        },
        status: "INVALID"
      });
    });
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
              issued: false,
              reason: {
                code: 1,
                codeString: "DOCUMENT_NOT_ISSUED",
                message:
                  "Certificate 0x2e97b28b1cb7ca50179af42f1f5581591251a2d93dd6dac75fafc8a69077f4ed has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
              }
            }
          ],
          issuedOnAll: false
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_NOT_ISSUED",
          message:
            "Certificate 0x2e97b28b1cb7ca50179af42f1f5581591251a2d93dd6dac75fafc8a69077f4ed has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
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
              issued: false,
              reason: {
                code: 1,
                codeString: "DOCUMENT_NOT_ISSUED",
                message:
                  "Certificate 0xda7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
              }
            }
          ],
          issuedOnAll: false
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_NOT_ISSUED",
          message:
            "Certificate 0xda7a25d51e62bc50e1c7cfa17f7be0e5df3428b96f584e5d021f0cd8da97306d has not been issued under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
        },
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
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            },
            {
              address: "",
              issued: false,
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address  is invalid"
              }
            }
          ],
          issuedOnAll: false
        },
        reason: { code: 2, codeString: "CONTRACT_ADDRESS_INVALID", message: "Contract address  is invalid" },
        status: "INVALID"
      });
    });
  });
  describe("v2 with proof block", () => {
    it("should return a valid fragment when document has valid signed proof", async () => {
      const fragment = await openAttestationW3CDIDProof.verify(documentRopstenValidWithDIDSignedProofBlock, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        data: {
          "@context": "https://w3id.org/did/v1",
          id: "did:ethr:ropsten:0xd130e6b130D9E940a724f894b316E79F9e58C648",
          authentication: [
            {
              type: "Secp256k1SignatureAuthentication2018",
              publicKey: ["did:ethr:ropsten:0xd130e6b130D9E940a724f894b316E79F9e58C648#owner"]
            }
          ],
          publicKey: [
            {
              id: "did:ethr:ropsten:0xd130e6b130D9E940a724f894b316E79F9e58C648#owner",
              type: "Secp256k1VerificationKey2018",
              ethereumAddress: "0xd130e6b130d9e940a724f894b316e79f9e58c648",
              owner: "did:ethr:ropsten:0xd130e6b130D9E940a724f894b316E79F9e58C648"
            }
          ]
        },
        status: "VALID"
      });
    });
    it("should return an invalid fragment when document has an invalid proof signature", async () => {
      const fragment = await openAttestationW3CDIDProof.verify(
        {
          ...documentRopstenValidWithDIDSignedProofBlock,
          proof: {
            ...documentRopstenValidWithDIDSignedProofBlock.proof,
            signature:
              "0x0004f62545319df30ce9722ff8ee5f9ab66ae365a5ff99dd1ef620200425201c6ed87e95b20728b60f0dad54f0e87eafef6e257f29de4f055db0ac95b8143b1e1b"
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        reason: {
          code: 1,
          codeString: "DOCUMENT_PROOF_INVALID",
          message: "Certificate proof is invalid"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document proof uses an unsupported authentication method (did-method)", async () => {
      const fragment = await openAttestationW3CDIDProof.verify(
        {
          ...documentRopstenValidWithDIDSignedProofBlock,
          proof: {
            ...documentRopstenValidWithDIDSignedProofBlock.proof,
            verificationMethod: "did:sov:WRfXPg8dantKVubE3HX8pw"
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        data: new Error("Issuer DID cannot be authenticated, no supported auth in didDoc."),
        reason: {
          code: 2,
          codeString: "DOCUMENT_PROOF_ERROR",
          message: "Issuer DID cannot be authenticated, no supported auth in didDoc."
        },
        status: "ERROR"
      });
    });
    it("should return an invalid fragment when document proof uses an unsupported proof type", async () => {
      const type = "notSupported";
      const fragment = await openAttestationW3CDIDProof.verify(
        {
          ...documentRopstenValidWithDIDSignedProofBlock,
          proof: {
            ...documentRopstenValidWithDIDSignedProofBlock.proof,
            type
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        data: new Error(`Proof type: ${type} is not supported.`),
        reason: {
          code: 2,
          codeString: "DOCUMENT_PROOF_ERROR",
          message: `Proof type: ${type} is not supported.`
        },
        status: "ERROR"
      });
    });
  });
  describe("v3", () => {
    it("should return an invalid fragment when document has document store that does not exist", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(
        {
          ...documentRopstenNotIssued,
          data: {
            ...documentRopstenNotIssued.data,
            proof: {
              ...documentRopstenNotIssued.data.proof,
              value: "0b9bbe75-8421-4e70-a176-cba76843216d:string:0x0000000000000000000000000000000000000000"
            }
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS",
        data: {
          details: {
            address: "0x0000000000000000000000000000000000000000",
            issued: false,
            reason: {
              code: 404,
              codeString: "CONTRACT_NOT_FOUND",
              message: "Contract 0x0000000000000000000000000000000000000000 was not found"
            }
          },
          issuedOnAll: false
        },
        reason: {
          code: 404,
          codeString: "CONTRACT_NOT_FOUND",
          message: "Contract 0x0000000000000000000000000000000000000000 was not found"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document with document store has not been issued", async () => {
      const fragment = await openAttestationEthereumDocumentStoreIssued.verify(documentRopstenNotIssued, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual({
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
          details: {
            address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            issued: true
          },
          issuedOnAll: true
        },
        status: "VALID"
      });
    });
  });
});
