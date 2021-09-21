/**
 * @jest-environment node
 */

import { rest } from "msw";
import { setupServer } from "msw/node";
import { isValid, openAttestationVerifiers, verificationBuilder, verify } from "./index";
import { documentMainnetValidWithCertificateStore } from "../test/fixtures/v2/documentMainnetValidWithCertificateStore";
import { INFURA_API_KEY } from "./config";

const verifyHomestead = verify;
const verifyRopsten = verificationBuilder(openAttestationVerifiers, { network: "ropsten" });

describe("Handling HTTP response errors", () => {
  const server = setupServer(); // Placing the following tests in a separate block due to how msw intercepts ALL connections
  beforeAll(() => server.listen()); // Enable API mocking before tests
  beforeEach(() => {
    jest.resetModules();
    process.env = {
      PROVIDER_NETWORK: "",
      PROVIDER_API_KEY: "",
      PROVIDER_ENDPOINT_TYPE: "",
      PROVIDER_ENDPOINT_URL: "",
    };
  });
  afterEach(() => server.resetHandlers()); // Reset any runtime request handlers we may add during the tests
  afterAll(() => server.close()); // Disable API mocking after the tests are done

  it("should return SERVER_ERROR when Ethers cannot connect to Infura with a valid certificate (HTTP 429)", async () => {
    process.env.PROVIDER_API_KEY = INFURA_API_KEY;
    server.use(
      rest.post(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, (req, res, ctx) => {
        return res(
          ctx.status(429, "Mocked rate limit error"),
          ctx.json({ jsonrpc: "2.0", result: "0xs0meR4nd0mErr0r", id: 1 })
        );
      })
    );
    const results = await verifyHomestead(documentMainnetValidWithCertificateStore);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": [Error: missing revert data in call exception (error={"reason":"failed response","code":"SERVER_ERROR","requestBody":"{\\"method\\":\\"eth_call\\",\\"params\\":[{\\"to\\":\\"0x007d40224f6562461633ccfbaffd359ebb2fc9ba\\",\\"data\\":\\"0x163aa6311a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6\\"},\\"latest\\"],\\"id\\":42,\\"jsonrpc\\":\\"2.0\\"}","requestMethod":"POST","url":"https://mainnet.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18"}, data="0x", code=CALL_EXCEPTION, version=providers/5.4.5)],
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 0,
            "codeString": "UNEXPECTED_ERROR",
            "message": "missing revert data in call exception (error={\\"reason\\":\\"failed response\\",\\"code\\":\\"SERVER_ERROR\\",\\"requestBody\\":\\"{\\\\\\"method\\\\\\":\\\\\\"eth_call\\\\\\",\\\\\\"params\\\\\\":[{\\\\\\"to\\\\\\":\\\\\\"0x007d40224f6562461633ccfbaffd359ebb2fc9ba\\\\\\",\\\\\\"data\\\\\\":\\\\\\"0x163aa6311a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6\\\\\\"},\\\\\\"latest\\\\\\"],\\\\\\"id\\\\\\":42,\\\\\\"jsonrpc\\\\\\":\\\\\\"2.0\\\\\\"}\\",\\"requestMethod\\":\\"POST\\",\\"url\\":\\"https://mainnet.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18\\"}, data=\\"0x\\", code=CALL_EXCEPTION, version=providers/5.4.5)",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false); // Because of SERVER_ERROR
  }, 60000);
  it("should return SERVER_ERROR when Ethers cannot connect to Infura with a valid certificate (HTTP 502)", async () => {
    process.env.PROVIDER_API_KEY = INFURA_API_KEY;
    server.use(
      rest.post(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`, (req, res, ctx) => {
        return res(
          ctx.status(502, "Mocked rate limit error"),
          ctx.json({ jsonrpc: "2.0", result: "0xs0meR4nd0mErr0r", id: 2 })
        );
      })
    );
    const results = await verifyHomestead(documentMainnetValidWithCertificateStore);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": [Error: missing revert data in call exception (error={"reason":"bad response","code":"SERVER_ERROR","status":502,"headers":{"x-powered-by":"msw","content-type":"application/json"},"body":"{\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0xs0meR4nd0mErr0r\\",\\"id\\":2}","requestBody":"{\\"method\\":\\"eth_call\\",\\"params\\":[{\\"to\\":\\"0x007d40224f6562461633ccfbaffd359ebb2fc9ba\\",\\"data\\":\\"0x163aa6311a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6\\"},\\"latest\\"],\\"id\\":42,\\"jsonrpc\\":\\"2.0\\"}","requestMethod":"POST","url":"https://mainnet.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18"}, data="0x", code=CALL_EXCEPTION, version=providers/5.4.5)],
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 0,
            "codeString": "UNEXPECTED_ERROR",
            "message": "missing revert data in call exception (error={\\"reason\\":\\"bad response\\",\\"code\\":\\"SERVER_ERROR\\",\\"status\\":502,\\"headers\\":{\\"x-powered-by\\":\\"msw\\",\\"content-type\\":\\"application/json\\"},\\"body\\":\\"{\\\\\\"jsonrpc\\\\\\":\\\\\\"2.0\\\\\\",\\\\\\"result\\\\\\":\\\\\\"0xs0meR4nd0mErr0r\\\\\\",\\\\\\"id\\\\\\":2}\\",\\"requestBody\\":\\"{\\\\\\"method\\\\\\":\\\\\\"eth_call\\\\\\",\\\\\\"params\\\\\\":[{\\\\\\"to\\\\\\":\\\\\\"0x007d40224f6562461633ccfbaffd359ebb2fc9ba\\\\\\",\\\\\\"data\\\\\\":\\\\\\"0x163aa6311a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6\\\\\\"},\\\\\\"latest\\\\\\"],\\\\\\"id\\\\\\":42,\\\\\\"jsonrpc\\\\\\":\\\\\\"2.0\\\\\\"}\\",\\"requestMethod\\":\\"POST\\",\\"url\\":\\"https://mainnet.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18\\"}, data=\\"0x\\", code=CALL_EXCEPTION, version=providers/5.4.5)",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false); // Because of SERVER_ERROR
  });
  it("should return SERVER_ERROR when Ethers cannot connect to Infura with an invalid certificate (HTTP 429)", async () => {
    process.env.PROVIDER_API_KEY = INFURA_API_KEY;
    // NOTE: Purpose of this test is to use a mainnet cert on ropsten. The mainnet cert store is perfectly valid, but does not exist on ropsten.
    server.use(
      rest.post(`https://ropsten.infura.io/v3/${INFURA_API_KEY}`, (req, res, ctx) => {
        return res(
          ctx.status(429, "Mocked rate limit error"),
          ctx.json({ jsonrpc: "2.0", result: "0xs0meR4nd0mErr0r", id: 3 })
        );
      })
    );
    const results = await verifyRopsten(documentMainnetValidWithCertificateStore);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": [Error: missing revert data in call exception (error={"reason":"failed response","code":"SERVER_ERROR","requestBody":"{\\"method\\":\\"eth_call\\",\\"params\\":[{\\"to\\":\\"0x007d40224f6562461633ccfbaffd359ebb2fc9ba\\",\\"data\\":\\"0x163aa6311a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6\\"},\\"latest\\"],\\"id\\":42,\\"jsonrpc\\":\\"2.0\\"}","requestMethod":"POST","url":"https://ropsten.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18"}, data="0x", code=CALL_EXCEPTION, version=providers/5.4.5)],
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 0,
            "codeString": "UNEXPECTED_ERROR",
            "message": "missing revert data in call exception (error={\\"reason\\":\\"failed response\\",\\"code\\":\\"SERVER_ERROR\\",\\"requestBody\\":\\"{\\\\\\"method\\\\\\":\\\\\\"eth_call\\\\\\",\\\\\\"params\\\\\\":[{\\\\\\"to\\\\\\":\\\\\\"0x007d40224f6562461633ccfbaffd359ebb2fc9ba\\\\\\",\\\\\\"data\\\\\\":\\\\\\"0x163aa6311a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6\\\\\\"},\\\\\\"latest\\\\\\"],\\\\\\"id\\\\\\":42,\\\\\\"jsonrpc\\\\\\":\\\\\\"2.0\\\\\\"}\\",\\"requestMethod\\":\\"POST\\",\\"url\\":\\"https://ropsten.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18\\"}, data=\\"0x\\", code=CALL_EXCEPTION, version=providers/5.4.5)",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false); // Because of SERVER_ERROR
  });
  it("should return SERVER_ERROR when Ethers cannot connect to Infura with an invalid certificate (HTTP 502)", async () => {
    process.env.PROVIDER_API_KEY = INFURA_API_KEY;
    // NOTE: Purpose of this test is to use a mainnet cert on ropsten. The mainnet cert store is perfectly valid, but does not exist on ropsten.
    server.use(
      rest.post(`https://ropsten.infura.io/v3/${INFURA_API_KEY}`, (req, res, ctx) => {
        return res(
          ctx.status(502, "Mocked rate limit error"),
          ctx.json({ jsonrpc: "2.0", result: "0xs0meR4nd0mErr0r", id: 4 })
        );
      })
    );
    const results = await verifyRopsten(documentMainnetValidWithCertificateStore);
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": [Error: missing revert data in call exception (error={"reason":"bad response","code":"SERVER_ERROR","status":502,"headers":{"x-powered-by":"msw","content-type":"application/json"},"body":"{\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0xs0meR4nd0mErr0r\\",\\"id\\":4}","requestBody":"{\\"method\\":\\"eth_call\\",\\"params\\":[{\\"to\\":\\"0x007d40224f6562461633ccfbaffd359ebb2fc9ba\\",\\"data\\":\\"0x163aa6311a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6\\"},\\"latest\\"],\\"id\\":42,\\"jsonrpc\\":\\"2.0\\"}","requestMethod":"POST","url":"https://ropsten.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18"}, data="0x", code=CALL_EXCEPTION, version=providers/5.4.5)],
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 0,
            "codeString": "UNEXPECTED_ERROR",
            "message": "missing revert data in call exception (error={\\"reason\\":\\"bad response\\",\\"code\\":\\"SERVER_ERROR\\",\\"status\\":502,\\"headers\\":{\\"x-powered-by\\":\\"msw\\",\\"content-type\\":\\"application/json\\"},\\"body\\":\\"{\\\\\\"jsonrpc\\\\\\":\\\\\\"2.0\\\\\\",\\\\\\"result\\\\\\":\\\\\\"0xs0meR4nd0mErr0r\\\\\\",\\\\\\"id\\\\\\":4}\\",\\"requestBody\\":\\"{\\\\\\"method\\\\\\":\\\\\\"eth_call\\\\\\",\\\\\\"params\\\\\\":[{\\\\\\"to\\\\\\":\\\\\\"0x007d40224f6562461633ccfbaffd359ebb2fc9ba\\\\\\",\\\\\\"data\\\\\\":\\\\\\"0x163aa6311a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6\\\\\\"},\\\\\\"latest\\\\\\"],\\\\\\"id\\\\\\":42,\\\\\\"jsonrpc\\\\\\":\\\\\\"2.0\\\\\\"}\\",\\"requestMethod\\":\\"POST\\",\\"url\\":\\"https://ropsten.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18\\"}, data=\\"0x\\", code=CALL_EXCEPTION, version=providers/5.4.5)",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not signed by DID directly",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxtIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
        Object {
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 0,
            "codeString": "SKIPPED",
            "message": "Document was not issued using DNS-DID",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false); // Because of SERVER_ERROR
  });
});
