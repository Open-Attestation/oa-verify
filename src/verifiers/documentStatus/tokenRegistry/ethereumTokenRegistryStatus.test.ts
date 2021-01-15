import { providers } from "ethers";
import { openAttestationEthereumTokenRegistryStatus } from "./ethereumTokenRegistryStatus";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { documentRopstenValidWithToken } from "../../../../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenValidWithTokenRegistry as v3documentRopstenValidWithTokenRegistry } from "../../../../test/fixtures/v3/documentRopstenValid";
import { documentRopstenNotIssuedWithTokenRegistry as v3documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v3/documentRopstenNotIssuedWithTokenRegistry";
import { documentRopstenNotIssuedWithCertificateStore } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithCertificateStore";
import { documentRopstenNotIssuedWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithDocumentStore";
import { documentRopstenMixedIssuance } from "../../../../test/fixtures/v2/documentRopstenMixedIssuance";
import { verificationBuilder } from "../../verificationBuilder";

const defaultVerify = verificationBuilder([openAttestationEthereumTokenRegistryStatus], { network: "ropsten" });
const alchemyVerify = verificationBuilder([openAttestationEthereumTokenRegistryStatus], {
  // this is nebulis personal key, feel free to change to another one :)
  provider: new providers.AlchemyProvider("ropsten", "zPyvUi9PX4yE_rnUvj6Ue3aP3d7OrENk"),
});

type Element = [string, typeof defaultVerify];
const verifiers: Element[] = [
  ["infura", defaultVerify],
  ["alchemy", alchemyVerify],
];

describe("openAttestationEthereumTokenRegistryStatus", () => {
  describe("v2", () => {
    it.each(verifiers)(
      "on %s, should return a skipped fragment when document does not have data",
      async (_, verify) => {
        const fragment = await verify(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          { ...documentRopstenValidWithToken, data: null }
        );
        expect(fragment).toStrictEqual([
          {
            name: "OpenAttestationEthereumTokenRegistryStatus",
            reason: {
              code: 4,
              codeString: "SKIPPED",
              message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
            },
            status: "SKIPPED",
            type: "DOCUMENT_STATUS",
          },
        ]);
      }
    );
    it.each(verifiers)(
      "on %s, should return a skipped fragment when document does not have issuers",
      async (_, verify) => {
        const fragment = await verify({
          ...documentRopstenValidWithToken,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          data: { ...documentRopstenValidWithToken.data, issuers: null },
        });
        expect(fragment).toStrictEqual([
          {
            name: "OpenAttestationEthereumTokenRegistryStatus",
            reason: {
              code: 4,
              codeString: "SKIPPED",
              message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
            },
            status: "SKIPPED",
            type: "DOCUMENT_STATUS",
          },
        ]);
      }
    );
    it.each(verifiers)(
      "on %s, should return a skipped fragment when document uses certificate store",
      async (_, verify) => {
        const fragment = await verify(documentRopstenNotIssuedWithCertificateStore);
        expect(fragment).toStrictEqual([
          {
            name: "OpenAttestationEthereumTokenRegistryStatus",
            reason: {
              code: 4,
              codeString: "SKIPPED",
              message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
            },
            status: "SKIPPED",
            type: "DOCUMENT_STATUS",
          },
        ]);
      }
    );
    it.each(verifiers)(
      "on %s, should return a skipped fragment when document uses document store",
      async (_, verify) => {
        const fragment = await verify(documentRopstenNotIssuedWithDocumentStore);
        expect(fragment).toStrictEqual([
          {
            name: "OpenAttestationEthereumTokenRegistryStatus",
            reason: {
              code: 4,
              codeString: "SKIPPED",
              message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
            },
            status: "SKIPPED",
            type: "DOCUMENT_STATUS",
          },
        ]);
      }
    );
    it.each(verifiers)("on %s, should return an invalid fragment when token registry is invalid", async (_, verify) => {
      const fragment = await verify({
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
      });
      expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
    });
    it.each(verifiers)(
      "on %s, should return an invalid fragment when token registry does not exist",
      async (_, verify) => {
        const fragment = await verify({
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
        });
        expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
      }
    );
    it.each(verifiers)(
      "on %s, should return an invalid fragment when document with token registry has not been minted",
      async (_, verify) => {
        const fragment = await verify(documentRopstenNotIssuedWithTokenRegistry);
        expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
      }
    );
    it.each(verifiers)(
      "on %s, should return a valid fragment when document with token registry has been minted",
      async (_, verify) => {
        const fragment = await verify(documentRopstenValidWithToken);
        expect(fragment).toStrictEqual([
          {
            name: "OpenAttestationEthereumTokenRegistryStatus",
            type: "DOCUMENT_STATUS",
            data: {
              details: [
                {
                  address: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
                  minted: true,
                },
              ],
              mintedOnAll: true,
            },
            status: "VALID",
          },
        ]);
      }
    );
    it.each(verifiers)(
      "on %s, should return an error fragment when document has 2 issuers with token registry",
      async (_, verify) => {
        const fragment = await verify({
          ...documentRopstenValidWithToken,
          data: {
            ...documentRopstenValidWithToken.data,
            issuers: [documentRopstenValidWithToken.data.issuers[0], documentRopstenValidWithToken.data.issuers[0]],
          },
        });
        expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
      }
    );
    it.each(verifiers)(
      "on %s, should return an error fragment when document uses 2 different verification method",
      async (_, verify) => {
        const fragment = await verify({
          ...documentRopstenValidWithToken,
          data: {
            ...documentRopstenValidWithToken.data,
            issuers: [
              documentRopstenValidWithToken.data.issuers[0],
              {
                identityProof: documentRopstenValidWithToken.data.issuers[0].identityProof,
                name: "Second Issuer",
              },
            ],
          },
        });
        expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
      }
    );
    it.each(verifiers)(
      "on %s, should return an invalid fragment when used with other issuance methods",
      async (_, verify) => {
        const fragment = await verify(documentRopstenMixedIssuance);

        expect(fragment).toMatchInlineSnapshot(`
        Array [
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
          },
        ]
      `);
      }
    );
  });
  describe("v3", () => {
    it.each(verifiers)(
      "on %s, should return an invalid fragment when document with token registry has not been minted",
      async (_, verify) => {
        const fragment = await verify(v3documentRopstenNotIssuedWithTokenRegistry);
        expect(fragment).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": Object {
              "details": Object {
                "address": "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
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
          },
        ]
      `);
      }
    );
    it.each(verifiers)(
      "on %s, should return a valid fragment when document with document store has been minted",
      async (_, verify) => {
        const fragment = await verify(v3documentRopstenValidWithTokenRegistry);
        expect(fragment).toStrictEqual([
          {
            name: "OpenAttestationEthereumTokenRegistryStatus",
            type: "DOCUMENT_STATUS",
            data: {
              details: {
                address: "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
                minted: true,
              },
              mintedOnAll: true,
            },
            status: "VALID",
          },
        ]);
      }
    );
  });
});
