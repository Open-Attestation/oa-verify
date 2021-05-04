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
  afterEach(() => server.resetHandlers()); // Reset any runtime request handlers we may add during the tests
  afterAll(() => server.close()); // Disable API mocking after the tests are done

  it("should return SERVER_ERROR when Ethers cannot connect to Infura with a valid certificate (HTTP 429)", async () => {
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
            "data": [Error: Unable to connect to the Ethereum network, please try again later],
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 500,
              "codeString": "SERVER_ERROR",
              "message": "Unable to connect to the Ethereum network, please try again later",
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
            "data": [Error: Unable to connect to the Ethereum network, please try again later],
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 500,
              "codeString": "SERVER_ERROR",
              "message": "Unable to connect to the Ethereum network, please try again later",
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
            "data": [Error: Unable to connect to the Ethereum network, please try again later],
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 500,
              "codeString": "SERVER_ERROR",
              "message": "Unable to connect to the Ethereum network, please try again later",
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
            "data": [Error: Unable to connect to the Ethereum network, please try again later],
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 500,
              "codeString": "SERVER_ERROR",
              "message": "Unable to connect to the Ethereum network, please try again later",
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
