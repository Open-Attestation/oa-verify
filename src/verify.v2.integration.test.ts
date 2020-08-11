/**
 * @jest-environment node
 */

import { isValid, verify } from "./index";
import { documentMainnetValidWithCertificateStore } from "../test/fixtures/v2/documentMainnetValidWithCertificateStore";
import {
  tamperedDocumentWithCertificateStore,
  tamperedDocumentWithInvalidCertificateStore,
} from "../test/fixtures/v2/tamperedDocument";
import { documentRopstenValidWithCertificateStore } from "../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenValidWithToken } from "../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenRevokedWithToken } from "../test/fixtures/v2/documentRopstenRevokedWithToken";
import { documentRopstenRevokedWithDocumentStore } from "../test/fixtures/v2/documentRopstenRevokedWithDocumentStore";
import { documentSignedProofValid } from "../test/fixtures/v2/documentSignedProofValid";
import { documentSignedProofInvalidSignature } from "../test/fixtures/v2/documentSignedProofInvalidSignature";
import {
  documentRinkebyRevokedWithDocumentStore,
  documentRinkebyValidWithDocumentStore,
} from "../test/fixtures/v2/documentRinkebyWithDocumentStore";

describe("verify(integration)", () => {
  afterEach(() => {
    delete process.env.ETHEREUM_PROVIDER;
  });
  it("should fail for everything when document's hash is invalid and certificate store is invalid", async () => {
    const results = await verify(tamperedDocumentWithCertificateStore, {
      network: "ropsten",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": false,
          "name": "OpenAttestationHash",
          "reason": Object {
            "code": 0,
            "codeString": "DOCUMENT_TAMPERED",
            "message": "Document has been tampered with",
          },
          "status": "INVALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
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
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
                  "issued": false,
                  "reason": Object {
                    "code": 404,
                    "codeString": "CONTRACT_NOT_FOUND",
                    "message": "Contract 0x20bc9C354A18C8178A713B9BcCFFaC2152b53990 was not found",
                  },
                },
              ],
            },
            "issuedOnAll": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 404,
            "codeString": "CONTRACT_NOT_FOUND",
            "message": "Contract 0x20bc9C354A18C8178A713B9BcCFFaC2152b53990 was not found",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationHash and OpenAttestationEthereumDocumentStoreStatus when document's hash is invalid and was not issued", async () => {
    const results = await verify(tamperedDocumentWithInvalidCertificateStore, {
      network: "ropsten",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": false,
          "name": "OpenAttestationHash",
          "reason": Object {
            "code": 0,
            "codeString": "DOCUMENT_TAMPERED",
            "message": "Document has been tampered with",
          },
          "status": "INVALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
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
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x20bc9C354A18C8178A713B9BcCFFaC2152b53991",
                  "issued": false,
                  "reason": Object {
                    "code": 2,
                    "codeString": "CONTRACT_ADDRESS_INVALID",
                    "message": "Contract address 0x20bc9C354A18C8178A713B9BcCFFaC2152b53991 is invalid",
                  },
                },
              ],
            },
            "issuedOnAll": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 2,
            "codeString": "CONTRACT_ADDRESS_INVALID",
            "message": "Contract address 0x20bc9C354A18C8178A713B9BcCFFaC2152b53991 is invalid",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
  });

  it("should be valid for all checks when document with certificate store is valid on mainnet using cloudflare", async () => {
    process.env.ETHEREUM_PROVIDER = "cloudflare";
    const results = await verify(documentMainnetValidWithCertificateStore, {
      network: "homestead",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
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
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should be valid for all checks when document with certificate store is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithCertificateStore, {
      network: "ropsten",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
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
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should be valid for all checks when document has a valid signed proof block", async () => {
    const results = await verify(documentSignedProofValid, {
      network: "homestead",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
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
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should fail when document has an invalid signed proof block", async () => {
    const results = await verify(documentSignedProofInvalidSignature, {
      network: "ropsten",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_PROOF_INVALID",
            "message": "Document proof is invalid",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
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
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 2,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
          },
          "status": "SKIPPED",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should be valid for all checks when document with token registry is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithToken, {
      network: "ropsten",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
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
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "example.tradetrust.io",
              "status": "VALID",
              "value": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
            },
          ],
          "name": "OpenAttestationDnsTxt",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(true);
  });

  it("should fail for OpenAttestationEthereumTokenRegistryStatus when document with token registry was not issued ", async () => {
    const results = await verify(documentRopstenRevokedWithToken, {
      // TODO: Revoked should be checked by .. asserting that it was previously minted (has transfer event), but currently not issued (owned by 0x0)
      network: "ropsten",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Object {
            "details": Array [
              Object {
                "address": "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
                "minted": false,
                "reason": Object {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Document 0x1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef has not been issued under contract 0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
                },
              },
            ],
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": Object {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Document 0x1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef has not been issued under contract 0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "tradetrust.io",
              "status": "VALID",
              "value": "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
            },
          ],
          "name": "OpenAttestationDnsTxt",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationEthereumDocumentStoreStatus when document was issued then subsequently revoked", async () => {
    const results = await verify(documentRopstenRevokedWithDocumentStore, {
      network: "ropsten",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
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
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e452 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0x3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e452 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "tradetrust.io",
              "status": "INVALID",
              "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
            },
          ],
          "name": "OpenAttestationDnsTxt",
          "reason": Object {
            "code": 1,
            "codeString": "INVALID_IDENTITY",
            "message": "Document issuer identity for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3 is invalid",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false);
  });

  it("should should work when document with document store has been issued to rinkeby network", async () => {
    const results = await verify(documentRinkebyValidWithDocumentStore, {
      network: "rinkeby",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
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
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x718B518565B81097b185661EBba3966Ff32A0039",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x718B518565B81097b185661EBba3966Ff32A0039",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "example.openattestation.com",
              "status": "VALID",
              "value": "0x718B518565B81097b185661EBba3966Ff32A0039",
            },
          ],
          "name": "OpenAttestationDnsTxt",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(true);
  });

  it("should should work when document with document store has been issued and revoked to rinkeby network", async () => {
    const results = await verify(documentRinkebyRevokedWithDocumentStore, {
      network: "rinkeby",
    });
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": true,
          "name": "OpenAttestationHash",
          "status": "VALID",
          "type": "DOCUMENT_INTEGRITY",
        },
        Object {
          "name": "OpenAttestationSignedProof",
          "reason": Object {
            "code": 4,
            "codeString": "SKIPPED",
            "message": "Document does not have a proof block",
          },
          "status": "SKIPPED",
          "type": "DOCUMENT_STATUS",
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
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "address": "0x718B518565B81097b185661EBba3966Ff32A0039",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x718B518565B81097b185661EBba3966Ff32A0039",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x92c04840038856f29890720bb57db655b9131ad2f93cf29cefcf17ea84dfb7d5 has been revoked under contract 0x718B518565B81097b185661EBba3966Ff32A0039",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationEthereumDocumentStoreStatus",
          "reason": Object {
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0x92c04840038856f29890720bb57db655b9131ad2f93cf29cefcf17ea84dfb7d5 has been revoked under contract 0x718B518565B81097b185661EBba3966Ff32A0039",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        },
        Object {
          "data": Array [
            Object {
              "location": "example.openattestation.com",
              "status": "VALID",
              "value": "0x718B518565B81097b185661EBba3966Ff32A0039",
            },
          ],
          "name": "OpenAttestationDnsTxt",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        },
      ]
    `);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_STATUS"])).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    expect(isValid(results, ["ISSUER_IDENTITY"])).toStrictEqual(true);
  });
});
