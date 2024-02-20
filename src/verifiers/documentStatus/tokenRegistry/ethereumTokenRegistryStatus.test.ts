import { v3, WrappedDocument } from "@tradetrust-tt/tradetrust";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentSepoliaValidWithToken } from "../../../../test/fixtures/v2/documentSepoliaValidWithToken";
import { documentMixedIssuance } from "../../../../test/fixtures/v2/documentMixedIssuance";
import { documentNotIssuedWithDocumentStore } from "../../../../test/fixtures/v2/documentNotIssuedWithDocumentStore";
import { documentNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentNotIssuedWithTokenRegistry";
import { openAttestationEthereumTokenRegistryStatus } from "./ethereumTokenRegistryStatus";

import v3TokenRegistryIssuedRaw from "../../../../test/fixtures/v3/tokenRegistry-issued.json";
import v3TokenRegistryWrappedRaw from "../../../../test/fixtures/v3/tokenRegistry-wrapped.json";

import { getProvider } from "../../../common/utils";

const v3TokenRegistryWrapped = v3TokenRegistryWrappedRaw as WrappedDocument<v3.OpenAttestationDocument>;
const v3TokenRegistryIssued = v3TokenRegistryIssuedRaw as WrappedDocument<v3.OpenAttestationDocument>;

const options = { provider: getProvider({ network: "sepolia" }) };

describe("test", () => {
  describe("v2", () => {
    it("should return false when document does not have data", async () => {
      const documentWithoutData: any = { ...documentSepoliaValidWithToken, data: null };
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutData, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document does not have issuers", async () => {
      const documentWithoutIssuer: any = {
        ...documentSepoliaValidWithToken,
        data: { ...documentSepoliaValidWithToken.data, issuers: null },
      };
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutIssuer, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses document store", async () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentNotIssuedWithDocumentStore, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses did signing", async () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentDidSigned, options);

      expect(shouldVerify).toBe(false);
    });
  });

  describe("v3", () => {
    it("should return true for documents using token registry", async () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(v3TokenRegistryIssued, options);

      expect(shouldVerify).toBe(true);
    });
    it("should return false when document does not have OpenAttestationMetadata", async () => {
      const documentWithoutOpenAttestationMetadata: any = {
        ...v3TokenRegistryWrapped,
        openAttestationMetadata: null,
      };

      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(
        documentWithoutOpenAttestationMetadata,
        options
      );

      expect(shouldVerify).toBe(false);
    });

    it("should return false when document does not have identityProof", async () => {
      const documentWithoutIdentityProof: any = {
        ...v3TokenRegistryWrapped,
        openAttestationMetadata: {
          ...v3TokenRegistryWrapped.openAttestationMetadata,
          identityProof: null,
        },
      };

      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutIdentityProof, options);

      expect(shouldVerify).toBe(false);
    });

    it("should return false when document does not have proof", async () => {
      const documentWithoutProof: any = {
        ...v3TokenRegistryWrapped,
        openAttestationMetadata: {
          ...v3TokenRegistryWrapped.openAttestationMetadata,
          proof: null,
        },
      };

      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutProof, options);

      expect(shouldVerify).toBe(false);
    });

    it("should return false when document does not have template", async () => {
      const documentWithoutTemplate: any = {
        ...v3TokenRegistryWrapped,
        openAttestationMetadata: {
          ...v3TokenRegistryWrapped.openAttestationMetadata,
          template: null,
        },
      };

      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutTemplate, options);

      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses document store", async () => {
      const documentUsesDocumentStore: any = {
        ...v3TokenRegistryWrapped,
        openAttestationMetadata: {
          ...v3TokenRegistryWrapped.openAttestationMetadata,
          proof: {
            ...v3TokenRegistryWrapped.openAttestationMetadata.proof,
            method: "DOCUMENT_STORE",
          },
        },
      };

      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentUsesDocumentStore, options);

      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses did signing", async () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentDidSigned, options);

      expect(shouldVerify).toBe(false);
    });
  });
});

describe("verify", () => {
  describe("v2", () => {
    it("should return an invalid fragment when token registry is invalid", async () => {
      const documentWithInvalidTokenRegistry: any = {
        ...documentNotIssuedWithTokenRegistry,
        data: {
          ...documentNotIssuedWithTokenRegistry.data,
          issuers: [
            {
              ...documentNotIssuedWithTokenRegistry.data.issuers[0],
              tokenRegistry: "0fb5b63a-aaa5-4e6e-a6f4-391c0f6ba423:string:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            },
          ],
        },
      };

      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentWithInvalidTokenRegistry,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "minted": false,
                "reason": Object {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Token registry is not found",
                },
              },
            ],
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Token registry is not found",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an invalid fragment when token registry does not exist", async () => {
      const documentWithMissingTokenRegistry: any = {
        ...documentNotIssuedWithTokenRegistry,
        data: {
          ...documentNotIssuedWithTokenRegistry.data,
          issuers: [
            {
              ...documentNotIssuedWithTokenRegistry.data.issuers[0],
              tokenRegistry: "0fb5b63a-aaa5-4e6e-a6f4-391c0f6ba423:string:0x0000000000000000000000000000000000000000",
            },
          ],
        },
      };

      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentWithMissingTokenRegistry,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0x0000000000000000000000000000000000000000",
                "minted": false,
                "reason": Object {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Token registry is not found",
                },
              },
            ],
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Token registry is not found",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an invalid fragment when document with token registry has not been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentNotIssuedWithTokenRegistry,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0x921dC7cEF00155ac3A33f04DA7395324d7809757",
                "minted": false,
                "reason": Object {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Document has not been issued under token registry",
                },
              },
            ],
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Document has not been issued under token registry",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return a valid fragment when document with token registry has been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(documentSepoliaValidWithToken, options);

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
                "minted": true,
              },
            ],
            "mintedOnAll": true,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an error fragment when document has 2 issuers with token registry", async () => {
      const documentHasTwoIssuersWithTokenRegistry: any = {
        ...documentSepoliaValidWithToken,
        data: {
          ...documentSepoliaValidWithToken.data,
          issuers: [documentSepoliaValidWithToken.data.issuers[0], documentSepoliaValidWithToken.data.issuers[0]],
        },
      };

      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentHasTwoIssuersWithTokenRegistry,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Only one issuer is allowed for tokens],
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 5,
            "codeString": "INVALID_ISSUERS",
            "message": "Only one issuer is allowed for tokens",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an error fragment when used with other issuance methods", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(documentMixedIssuance, options);

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Only one issuer is allowed for tokens],
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 5,
            "codeString": "INVALID_ISSUERS",
            "message": "Only one issuer is allowed for tokens",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });

  describe("v3", () => {
    it("should return an invalid fragment when token registry is invalid", async () => {
      const documentWithInvalidTokenRegistry: any = {
        ...v3TokenRegistryWrapped,
        openAttestationMetadata: {
          ...v3TokenRegistryWrapped.openAttestationMetadata,
          proof: {
            ...v3TokenRegistryWrapped.openAttestationMetadata.proof,
            value: "0xabcd",
          },
        },
      };

      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentWithInvalidTokenRegistry,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "address": "0xabcd",
              "minted": false,
              "reason": Object {
                "code": 1,
                "codeString": "DOCUMENT_NOT_MINTED",
                "message": "Invalid token registry address",
              },
            },
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Invalid token registry address",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an invalid fragment when token registry does not exist", async () => {
      const documentWithMissingTokenRegistry: any = {
        ...v3TokenRegistryWrapped,
        openAttestationMetadata: {
          ...v3TokenRegistryWrapped.openAttestationMetadata,
          proof: {
            ...v3TokenRegistryWrapped.openAttestationMetadata.proof,
            value: "0x0000000000000000000000000000000000000000",
          },
        },
      };

      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentWithMissingTokenRegistry,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "address": "0x0000000000000000000000000000000000000000",
              "minted": false,
              "reason": Object {
                "code": 1,
                "codeString": "DOCUMENT_NOT_MINTED",
                "message": "Token registry is not found",
              },
            },
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Token registry is not found",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an invalid fragment when document with token registry has not been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(v3TokenRegistryWrapped, options);

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "address": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
              "minted": false,
              "reason": Object {
                "code": 1,
                "codeString": "DOCUMENT_NOT_MINTED",
                "message": "Document has not been issued under token registry",
              },
            },
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Document has not been issued under token registry",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return a valid fragment when document with token registry has been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(v3TokenRegistryIssued, options);

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "address": "0x142Ca30e3b78A840a82192529cA047ED759a6F7e",
              "minted": true,
            },
            "mintedOnAll": true,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });
});

describe("skip", () => {
  it("should return the skip fragment", async () => {
    const fragment = await openAttestationEthereumTokenRegistryStatus.skip(documentNotIssuedWithTokenRegistry, options);
    expect(fragment).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationEthereumTokenRegistryStatus",
        "reason": Object {
          "code": 4,
          "codeString": "SKIPPED",
          "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
        },
        "status": "SKIPPED",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });
});
