import { v3, WrappedDocument } from "@govtechsg/open-attestation";
import { openAttestationEthereumTokenRegistryStatus } from "./ethereumTokenRegistryStatus";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { documentRopstenValidWithToken } from "../../../../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import { documentRopstenNotIssuedWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithDocumentStore";
import { documentRopstenMixedIssuance } from "../../../../test/fixtures/v2/documentRopstenMixedIssuance";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";

import v3TokenRegistryWrappedRaw from "../../../../test/fixtures/v3/tokenRegistry-wrapped.json";

const v3TokenRegistryWrapped = v3TokenRegistryWrappedRaw as WrappedDocument<v3.OpenAttestationDocument>;

import { getProvider } from "../../../common/utils";

const options = { provider: getProvider({ network: "ropsten" }) };

describe("test", () => {
  describe("v2", () => {
    it("should return false when document does not have data", async () => {
      const documentWithoutData: any = { ...documentRopstenValidWithToken, data: null };
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutData, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document does not have issuers", async () => {
      const documentWithoutIssuer: any = {
        ...documentRopstenValidWithToken,
        data: { ...documentRopstenValidWithToken.data, issuers: null },
      };
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutIssuer, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses certificate store", async () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(
        documentRopstenNotIssuedWithCertificateStore,
        options
      );
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses document store", async () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(
        documentRopstenNotIssuedWithDocumentStore,
        options
      );
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses did signing", async () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentDidSigned, options);

      expect(shouldVerify).toBe(false);
    });
  });

  describe("v3", () => {
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

    // Don't find certificate store in v3 schema
    xit("should return false when document uses certificate store", async () => {});

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
        ...documentRopstenNotIssuedWithTokenRegistry,
        data: {
          ...documentRopstenNotIssuedWithTokenRegistry.data,
          issuers: [
            {
              ...documentRopstenNotIssuedWithTokenRegistry.data.issuers[0],
              tokenRegistry: "0fb5b63a-aaa5-4e6e-a6f4-391c0f6ba423:string:0xabcd",
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
                "address": "0xabcd",
                "minted": false,
                "reason": Object {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Invalid token registry address",
                },
              },
            ],
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
        ...documentRopstenNotIssuedWithTokenRegistry,
        data: {
          ...documentRopstenNotIssuedWithTokenRegistry.data,
          issuers: [
            {
              ...documentRopstenNotIssuedWithTokenRegistry.data.issuers[0],
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
        documentRopstenNotIssuedWithTokenRegistry,
        options
      );

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
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
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(documentRopstenValidWithToken, options);

      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
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
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [documentRopstenValidWithToken.data.issuers[0], documentRopstenValidWithToken.data.issuers[0]],
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
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(documentRopstenMixedIssuance, options);

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

      console.log(documentWithInvalidTokenRegistry);
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

    xit("should return an invalid fragment when token registry does not exist", async () => {});

    xit("should return an invalid fragment when document with token registry has not been minted", async () => {});

    xit("should return a valid fragment when document with token registry has been minted", async () => {});
  });
});

describe("skip", () => {
  it("should return the skip fragment", async () => {
    const fragment = await openAttestationEthereumTokenRegistryStatus.skip(
      documentRopstenNotIssuedWithTokenRegistry,
      options
    );
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
