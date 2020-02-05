import { openAttestationEthereumTokenRegistryMinted } from "./openAttestationEthereumTokenRegistryMinted";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { documentRopstenValidWithToken } from "../../../test/fixtures/v2/documentRopstenValidWithToken";
import {
  documentRopstenValidWithDocumentStore as v3documentRopstenValidWithDocumentStore,
  documentRopstenValidWithTokenRegistry as v3documentRopstenValidWithTokenRegistry
} from "../../../test/fixtures/v3/documentRopstenValid";
import { documentRopstenNotIssuedWithTokenRegistry as v3documentRopstenNotIssuedWithTokenRegistry } from "../../../test/fixtures/v3/documentRopstenNotIssuedWithTokenRegistry";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import { documentRopstenNotIssuedWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenNotIssuedWithDocumentStore";

describe("openAttestationEthereumTokenRegistryMinted", () => {
  // TODO create a verifier and call it to test this => check dns verifier test
  describe("test", () => {
    it("should return false when v2 document uses certificate store", () => {
      const test = openAttestationEthereumTokenRegistryMinted.test(documentRopstenNotIssuedWithCertificateStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(false);
    });
    it("should return false when v2 document uses document store", () => {
      const test = openAttestationEthereumTokenRegistryMinted.test(documentRopstenNotIssuedWithDocumentStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(false);
    });
    it("should return true when v2 document has at least one token registry", () => {
      const test = openAttestationEthereumTokenRegistryMinted.test(documentRopstenNotIssuedWithTokenRegistry, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
    it("should return false when v3 document uses DOCUMENT_STORE method", () => {
      const test = openAttestationEthereumTokenRegistryMinted.test(v3documentRopstenValidWithDocumentStore, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(false);
    });
    it("should return true when v3 document uses TOKEN_REGISTRY method", () => {
      const test = openAttestationEthereumTokenRegistryMinted.test(v3documentRopstenNotIssuedWithTokenRegistry, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
  });
  describe("v2", () => {
    it("should return an invalid fragment when token registry is invalid", async () => {
      const fragment = await openAttestationEthereumTokenRegistryMinted.verify(
        {
          ...documentRopstenNotIssuedWithTokenRegistry,
          data: {
            ...documentRopstenNotIssuedWithTokenRegistry.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithTokenRegistry.data.issuers[0],
                tokenRegistry: "0fb5b63a-aaa5-4e6e-a6f4-391c0f6ba423:string:0xabcd"
              }
            ]
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0xabcd",
              minted: false,
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address 0xabcd is invalid"
              }
            }
          ],
          mintedOnAll: false
        },
        reason: {
          code: 2,
          codeString: "CONTRACT_ADDRESS_INVALID",
          message: "Contract address 0xabcd is invalid"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when token registry does not exist", async () => {
      const fragment = await openAttestationEthereumTokenRegistryMinted.verify(
        {
          ...documentRopstenNotIssuedWithTokenRegistry,
          data: {
            ...documentRopstenNotIssuedWithTokenRegistry.data,
            issuers: [
              {
                ...documentRopstenNotIssuedWithTokenRegistry.data.issuers[0],
                tokenRegistry: "0fb5b63a-aaa5-4e6e-a6f4-391c0f6ba423:string:0x0000000000000000000000000000000000000000"
              }
            ]
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0x0000000000000000000000000000000000000000",
              minted: false,
              reason: {
                code: 404,
                codeString: "CONTRACT_NOT_FOUND",
                message: "Contract 0x0000000000000000000000000000000000000000 was not found"
              }
            }
          ],
          mintedOnAll: false
        },
        reason: {
          code: 404,
          codeString: "CONTRACT_NOT_FOUND",
          message: "Contract 0x0000000000000000000000000000000000000000 was not found"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document with token registry has not been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryMinted.verify(
        documentRopstenNotIssuedWithTokenRegistry,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
              minted: false,
              reason: {
                code: 1,
                codeString: "DOCUMENT_NOT_MINTED",
                message:
                  "Certificate 0x693c86fbb8f75ac56f865f5b3100e545875f2154b3749bdcf448c874a1d67ef3 has not been issued under contract 0xb53499ee758352fAdDfCed863d9ac35C809E2F20"
              }
            }
          ],
          mintedOnAll: false
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_NOT_MINTED",
          message:
            "Certificate 0x693c86fbb8f75ac56f865f5b3100e545875f2154b3749bdcf448c874a1d67ef3 has not been issued under contract 0xb53499ee758352fAdDfCed863d9ac35C809E2F20"
        },
        status: "INVALID"
      });
    });
    it("should return a valid fragment when document with token registry has been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryMinted.verify(documentRopstenValidWithToken, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS",
        data: {
          details: [
            {
              address: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              minted: true
            }
          ],
          mintedOnAll: true
        },
        status: "VALID"
      });
    });
    it("should return an error fragment when document has 2 issuers with token registry", async () => {
      const fragment = await openAttestationEthereumTokenRegistryMinted.verify(
        {
          ...documentRopstenValidWithToken,
          data: {
            ...documentRopstenValidWithToken.data,
            issuers: [documentRopstenValidWithToken.data.issuers[0], documentRopstenValidWithToken.data.issuers[0]]
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS",
        data: new Error("Only one token registry is allowed. Found 2"),
        reason: {
          code: 0,
          codeString: "UNEXPECTED_ERROR",
          message: "Only one token registry is allowed. Found 2"
        },
        status: "ERROR"
      });
    });
    it("should return an error fragment when document uses 2 different verification method", async () => {
      const fragment = await openAttestationEthereumTokenRegistryMinted.verify(
        {
          ...documentRopstenValidWithToken,
          data: {
            ...documentRopstenValidWithToken.data,
            issuers: [
              documentRopstenValidWithToken.data.issuers[0],
              {
                identityProof: documentRopstenValidWithToken.data.issuers[0].identityProof,
                name: "Second Issuer"
              }
            ]
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS",
        data: new Error(`Only one token registry is allowed. Found 2`),
        reason: {
          code: 0,
          codeString: "UNEXPECTED_ERROR",
          message: "Only one token registry is allowed. Found 2"
        },
        status: "ERROR"
      });
    });
  });
  describe("v3", () => {
    it("should return an invalid fragment when document with token registry has not been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryMinted.verify(
        v3documentRopstenNotIssuedWithTokenRegistry,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS",
        data: {
          details: {
            address: "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
            minted: false,
            reason: {
              code: 1,
              codeString: "DOCUMENT_NOT_MINTED",
              message:
                "Certificate 0x7c56cf6bac41a744060e515cac8eb177c8f3d2d56f705a0a7df884906623bddc has not been issued under contract 0xb53499ee758352fAdDfCed863d9ac35C809E2F20"
            }
          },
          mintedOnAll: false
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_NOT_MINTED",
          message:
            "Certificate 0x7c56cf6bac41a744060e515cac8eb177c8f3d2d56f705a0a7df884906623bddc has not been issued under contract 0xb53499ee758352fAdDfCed863d9ac35C809E2F20"
        },
        status: "INVALID"
      });
    });
    it("should return a valid fragment when document with document store has been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryMinted.verify(
        v3documentRopstenValidWithTokenRegistry,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS",
        data: {
          details: {
            address: "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
            minted: true
          },
          mintedOnAll: true
        },
        status: "VALID"
      });
    });
  });
});
