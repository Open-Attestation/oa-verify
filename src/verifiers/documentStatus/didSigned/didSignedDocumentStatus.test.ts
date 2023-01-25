import { SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { rest } from "msw";
import { setupServer, SetupServerApi } from "msw/node";
import { documentDidCustomRevocation } from "../../../../test/fixtures/v2/documentDidCustomRevocation";
import { documentDidObfuscatedRevocation } from "../../../../test/fixtures/v2/documentDidObfuscatedRevocation";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentGoerliValidWithDocumentStore } from "../../../../test/fixtures/v2/documentGoerliValidWithDocumentStore";
import { documentNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentNotIssuedWithTokenRegistry";
import sampleDidSignedRevocationStoreButNoLocationV3 from "../../../../test/fixtures/v3/did-revocation-store-signed-no-location.json";
import sampleDidSignedRevocationStoreNotRevokedV3 from "../../../../test/fixtures/v3/did-revocation-store-signed-not-revoked.json";
import sampleDidSignedRevocationStoreButRevokedV3 from "../../../../test/fixtures/v3/did-revocation-store-signed-revoked.json";
import sampleDidSignedV3 from "../../../../test/fixtures/v3/did-signed.json";
import sampleDnsDidSignedRevocationStoreNotRevokedV3 from "../../../../test/fixtures/v3/dnsdid-revocation-store-signed-not-revoked.json";
import sampleDnsDidSignedRevocationStoreButRevokedV3 from "../../../../test/fixtures/v3/dnsdid-revocation-store-signed-revoked.json";
import sampleDNSDidSignedV3 from "../../../../test/fixtures/v3/dnsdid-signed.json";
import sampleDocumentStoreWrappedV3 from "../../../../test/fixtures/v3/documentStore-wrapped.json";
import sampleTokenRegistryWrappedV3 from "../../../../test/fixtures/v3/tokenRegistry-wrapped.json";
import { getProvider } from "../../../common/utils";
import { getVerificationMethod } from "../../../did/resolver";
import { openAttestationDidSignedDocumentStatus } from "./didSignedDocumentStatus";

import sampleDidSignedRevocationStoreButNoLocationV2 from "../../../../test/fixtures/v2/did-revocation-store-signed-no-location.json";
import sampleDidSignedRevocationStoreNotRevokedV2 from "../../../../test/fixtures/v2/did-revocation-store-signed-not-revoked.json";
import sampleDidSignedRevocationStoreButRevokedV2 from "../../../../test/fixtures/v2/did-revocation-store-signed-revoked.json";
import sampleDnsDidSignedRevocationStoreNotRevokedV2 from "../../../../test/fixtures/v2/dnsdid-revocation-store-signed-not-revoked.json";
import sampleDnsDidSignedRevocationStoreButRevokedV2 from "../../../../test/fixtures/v2/dnsdid-revocation-store-signed-revoked.json";

import sampleDidSignedOcsp from "../../../../test/fixtures/v2/did-revocation-ocsp-signed.json";

const didSignedRevocationStoreNotRevokedV2 = sampleDidSignedRevocationStoreNotRevokedV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const didSignedRevocationStoreButRevokedV2 = sampleDidSignedRevocationStoreButRevokedV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const didSignedRevocationStoreButNoLocationV2 = sampleDidSignedRevocationStoreButNoLocationV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const dnsDidSignedRevocationStoreNotRevokedV2 = sampleDnsDidSignedRevocationStoreNotRevokedV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const dnsDidSignedRevocationStoreButRevokedV2 = sampleDnsDidSignedRevocationStoreButRevokedV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const didSignedOcsp = sampleDidSignedOcsp as SignedWrappedDocument<v2.OpenAttestationDocument>;

const documentStoreWrapV3 = sampleDocumentStoreWrappedV3 as WrappedDocument<v3.OpenAttestationDocument>;
const tokenRegistryWrapV3 = sampleTokenRegistryWrappedV3 as WrappedDocument<v3.OpenAttestationDocument>;
const didSignedV3 = sampleDidSignedV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;
const didSignedRevocationStoreNotRevokedV3 = sampleDidSignedRevocationStoreNotRevokedV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;
const didSignedRevocationStoreButRevokedV3 = sampleDidSignedRevocationStoreButRevokedV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;
const didSignedRevocationStoreButNoLocationV3 = sampleDidSignedRevocationStoreButNoLocationV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;
const dnsDidSignedV3 = sampleDNSDidSignedV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;
const dnsDidSignedRevocationStoreNotRevokedV3 = sampleDnsDidSignedRevocationStoreNotRevokedV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;
const dnsDidSignedRevocationStoreButRevokedV3 = sampleDnsDidSignedRevocationStoreButRevokedV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;

jest.mock("../../../did/resolver");

const mockGetPublicKey = getVerificationMethod as jest.Mock;

const whenPublicKeyResolvesSuccessfully = (key = "0xB26B4941941C51a4885E5B7D3A1B861E54405f90") => {
  // Private key for signing from this address
  // 0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655
  // sign using wallet.signMessage(utils.arrayify(merkleRoot))
  mockGetPublicKey.mockResolvedValue({
    id: `did:ethr:${key}`,
    type: "EcdsaSecp256k1RecoveryMethod2020",
    controller: `did:ethr:${key}`,
    blockchainAccountId: key.toLowerCase(),
  });
};

const options = {
  provider: getProvider({
    network: "goerli",
  }),
};

describe("skip", () => {
  it("should return skip message", async () => {
    const message = await openAttestationDidSignedDocumentStatus.skip(undefined as any, undefined as any);
    expect(message).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationDidSignedDocumentStatus",
        "reason": Object {
          "code": 0,
          "codeString": "SKIPPED",
          "message": "Document was not signed by DID directly",
        },
        "status": "SKIPPED",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });
});

describe("test", () => {
  describe("v2", () => {
    it("should return false for documents not signed by DID", () => {
      expect(openAttestationDidSignedDocumentStatus.test(documentGoerliValidWithDocumentStore, options)).toBe(false);
      expect(openAttestationDidSignedDocumentStatus.test(documentNotIssuedWithTokenRegistry, options)).toBe(false);
    });
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {
      expect(openAttestationDidSignedDocumentStatus.test(documentDidSigned, options)).toBe(true);
    });
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {
      expect(openAttestationDidSignedDocumentStatus.test(documentDnsDidSigned, options)).toBe(true);
    });
  });

  describe("v3", () => {
    it("should return false if it is not signed by DID", () => {
      expect(openAttestationDidSignedDocumentStatus.test(documentStoreWrapV3, options)).toBe(false);
      expect(openAttestationDidSignedDocumentStatus.test(tokenRegistryWrapV3, options)).toBe(false);
    });
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {
      expect(openAttestationDidSignedDocumentStatus.test(didSignedV3, options)).toBe(true);
    });
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {
      expect(openAttestationDidSignedDocumentStatus.test(dnsDidSignedV3, options)).toBe(true);
    });
  });
});

describe("verify", () => {
  beforeEach(() => {
    mockGetPublicKey.mockReset();
  });

  describe("v2", () => {
    it("should pass for documents using `DID` and is correctly signed", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDidSigned, options);

      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should pass for documents using `DID` and is correctly signed, and is not revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreNotRevokedV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should pass for documents using `DID-DNS` and is correctly signed", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDnsDidSigned, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should pass for documents using `DID-DNS` and is correctly signed, and is not revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedRevocationStoreNotRevokedV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail when revocation block is missing", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDidObfuscatedRevocation, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.],
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 8,
            "codeString": "UNRECOGNIZED_DOCUMENT",
            "message": "Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should throw an unrecognized revocation type error when revocation is not set to NONE or REVOCATION_STORE", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDidCustomRevocation, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.],
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 8,
            "codeString": "UNRECOGNIZED_DOCUMENT",
            "message": "Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should throw an missing revocation location type error when revocation location is missing when revocation type is REVOCATION_STORE", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreButNoLocationV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": [Error: missing revocation location for an issuer],
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 10,
            "codeString": "REVOCATION_LOCATION_MISSING",
            "message": "missing revocation location for an issuer",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail when did resolver fails for some reasons", async () => {
      mockGetPublicKey.mockRejectedValue(new Error("Error from DID resolver"));
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDidSigned, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Error from DID resolver],
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 1,
            "codeString": "UNEXPECTED_ERROR",
            "message": "Error from DID resolver",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail when corresponding proof to key is not found in proof", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(
        {
          ...documentDidSigned,
          proof: [
            {
              created: "2021-03-25T07:52:31.291Z",
              type: "OpenAttestationSignature2018",
              proofPurpose: "assertionMethod",
              verificationMethod: "did:ethr:0xdede",
              signature: "0xabcf",
            },
          ],
        },
        options
      );
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Proof not found for did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller],
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 6,
            "codeString": "CORRESPONDING_PROOF_MISSING",
            "message": "Proof not found for did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail when signature is wrong", async () => {
      whenPublicKeyResolvesSuccessfully("0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89");
      const incorrectSignatureDocument = { ...documentDnsDidSigned, proof: documentDidSigned.proof };
      const res = await openAttestationDidSignedDocumentStatus.verify(incorrectSignatureDocument, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": false,
                  "reason": Object {
                    "code": 7,
                    "codeString": "WRONG_SIGNATURE",
                    "message": "merkle root is not signed correctly by 0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
                  },
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": false,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 7,
            "codeString": "WRONG_SIGNATURE",
            "message": "merkle root is not signed correctly by 0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail for documents using `DID` and is correctly signed, and is revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreButRevokedV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "reason": Object {
                    "code": 12,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x3752f29527952e7ccc6bf4da614d80f2fec9e5bd8b71adf10beb4e6763e6c233 has been revoked under contract 0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 12,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0x3752f29527952e7ccc6bf4da614d80f2fec9e5bd8b71adf10beb4e6763e6c233 has been revoked under contract 0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail for documents using `DID-DNS` and is correctly signed, and is revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedRevocationStoreButRevokedV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  "reason": Object {
                    "code": 12,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x3752f29527952e7ccc6bf4da614d80f2fec9e5bd8b71adf10beb4e6763e6c233 has been revoked under contract 0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 12,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0x3752f29527952e7ccc6bf4da614d80f2fec9e5bd8b71adf10beb4e6763e6c233 has been revoked under contract 0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should pass when DID document is signed and is not revoked by an OCSP v1", async () => {
      whenPublicKeyResolvesSuccessfully();

      const handlers = [
        rest.get("https://ocsp.example.com/SGCNM21566327", (_, res, ctx) => {
          return res(
            ctx.json({
              certificateId: "SGCNM21566327",
              certificateStatus: "good",
            })
          );
        }),
      ];

      const server: SetupServerApi = setupServer(...handlers);
      server.listen();

      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedOcsp, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "https://ocsp.example.com",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);

      server.close();
    });
    it("should fail when DID document is signed but is found by an OCSP v1", async () => {
      whenPublicKeyResolvesSuccessfully();

      const handlers = [
        rest.get("https://ocsp.example.com/SGCNM21566327", (_, res, ctx) => {
          return res(
            ctx.json({
              certificateId: "SGCNM21566327",
              certificateStatus: "revoked",
              reasonCode: 4,
              revocationDate: "2021-10-26T05:02:20.100Z",
              thisUpdate: "2021-10-26T05:02:20.100Z",
            })
          );
        }),
      ];

      const server: SetupServerApi = setupServer(...handlers);
      server.listen();

      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedOcsp, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "https://ocsp.example.com",
                  "reason": Object {
                    "code": 4,
                    "codeString": "SUPERSEDED",
                    "message": "SUPERSEDED",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SUPERSEDED",
            "message": "SUPERSEDED",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);

      server.close();
    });
    it("should pass when DID document is signed and is not revoked by an OCSP v2", async () => {
      whenPublicKeyResolvesSuccessfully();

      const handlers = [
        rest.get(
          "https://ocsp.example.com/0x28b221f6287d8e4f8da09a835bcb750537cc8385e2535ff63591fdf0162be824",
          (_, res, ctx) => {
            return res(
              ctx.json({
                revoked: false,
                documentHash: "0x28b221f6287d8e4f8da09a835bcb750537cc8385e2535ff63591fdf0162be824",
              })
            );
          }
        ),
        rest.get(
          "https://ocsp.example.com/0x56961854a82feafe9a56eb57acfe3b97f17eda5d497b622c9acc9f03c412618c",
          (_, res, ctx) => {
            return res(
              ctx.json({
                revoked: false,
                documentHash: "0x56961854a82feafe9a56eb57acfe3b97f17eda5d497b622c9acc9f03c412618c",
              })
            );
          }
        ),
      ];

      const server: SetupServerApi = setupServer(...handlers);
      server.listen();

      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedOcsp, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "https://ocsp.example.com",
                  "revoked": false,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);

      server.close();
    });
    it("should fail when DID document is signed but is found by an OCSP v2", async () => {
      whenPublicKeyResolvesSuccessfully();

      const handlers = [
        rest.get(
          "https://ocsp.example.com/0x28b221f6287d8e4f8da09a835bcb750537cc8385e2535ff63591fdf0162be824",
          (_, res, ctx) => {
            return res(
              ctx.json({
                revoked: true,
                documentHash: "0x28b221f6287d8e4f8da09a835bcb750537cc8385e2535ff63591fdf0162be824",
                reasonCode: 4,
              })
            );
          }
        ),
        rest.get(
          "https://ocsp.example.com/0x56961854a82feafe9a56eb57acfe3b97f17eda5d497b622c9acc9f03c412618c",
          (_, res, ctx) => {
            return res(
              ctx.json({
                revoked: false,
                documentHash: "0x56961854a82feafe9a56eb57acfe3b97f17eda5d497b622c9acc9f03c412618c",
              })
            );
          }
        ),
      ];

      const server: SetupServerApi = setupServer(...handlers);
      server.listen();

      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedOcsp, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "https://ocsp.example.com",
                  "reason": Object {
                    "code": 4,
                    "codeString": "SUPERSEDED",
                    "message": "Document 0x56961854a82feafe9a56eb57acfe3b97f17eda5d497b622c9acc9f03c412618c has been revoked under OCSP Responder: https://ocsp.example.com",
                  },
                  "revoked": true,
                },
              ],
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 4,
            "codeString": "SUPERSEDED",
            "message": "Document 0x56961854a82feafe9a56eb57acfe3b97f17eda5d497b622c9acc9f03c412618c has been revoked under OCSP Responder: https://ocsp.example.com",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);

      server.close();
    });
  });

  describe("v3", () => {
    it("should pass for documents using `DID` and is correctly signed", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                "issued": true,
              },
              "revocation": Object {
                "revoked": false,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should throw an missing revocation location type error when revocation location is missing when revocation type is REVOCATION_STORE", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreButNoLocationV3, options);
      expect(res).toMatchInlineSnapshot(`
          Object {
            "data": [Error: missing revocation location for an issuer],
            "name": "OpenAttestationDidSignedDocumentStatus",
            "reason": Object {
              "code": 10,
              "codeString": "REVOCATION_LOCATION_MISSING",
              "message": "missing revocation location for an issuer",
            },
            "status": "ERROR",
            "type": "DOCUMENT_STATUS",
          }
        `);
    });
    it("should pass for documents using `DID` and is correctly signed, and is not revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreNotRevokedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                "revoked": false,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should pass for documents using `DID-DNS` and is correctly signed", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                "issued": true,
              },
              "revocation": Object {
                "revoked": false,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should pass for documents using `DID-DNS` and is correctly signed, and is not revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedRevocationStoreNotRevokedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                "revoked": false,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail when revocation block is missing", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const docWithoutRevocationBlock = {
        ...didSignedV3,
        openAttestationMetadata: {
          template: {
            name: "CUSTOM_TEMPLATE",
            type: "EMBEDDED_RENDERER",
            url: "https://localhost:3000/renderer",
          },
          proof: {
            type: "OpenAttestationProofMethod",
            method: "DID",
            value: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
          },
          identityProof: {
            type: "DID",
            identifier: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
          },
        },
      };
      const res = await openAttestationDidSignedDocumentStatus.verify(docWithoutRevocationBlock as any, options);
      expect(res).toMatchInlineSnapshot(`
          Object {
            "data": [Error: revocation block not found for an issuer],
            "name": "OpenAttestationDidSignedDocumentStatus",
            "reason": Object {
              "code": 2,
              "codeString": "MISSING_REVOCATION",
              "message": "revocation block not found for an issuer",
            },
            "status": "ERROR",
            "type": "DOCUMENT_STATUS",
          }
        `);
    });
    it("should throw an unrecognized revocation type error when revocation is not set to NONE or REVOCATION_STORE", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const docWithIncorrectRevocation = {
        ...didSignedV3,
        openAttestationMetadata: {
          ...didSignedV3.openAttestationMetadata,
          proof: {
            type: "OpenAttestationProofMethod",
            method: "DID",
            value: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
            revocation: {
              type: "SOMETHING-ELSE",
            },
          },
        },
      };
      const res = await openAttestationDidSignedDocumentStatus.verify(docWithIncorrectRevocation as any, options);
      expect(res).toMatchInlineSnapshot(`
          Object {
            "data": [Error: revocation type not found for an issuer],
            "name": "OpenAttestationDidSignedDocumentStatus",
            "reason": Object {
              "code": 9,
              "codeString": "UNRECOGNIZED_REVOCATION_TYPE",
              "message": "revocation type not found for an issuer",
            },
            "status": "ERROR",
            "type": "DOCUMENT_STATUS",
          }
        `);
    });
    it("should fail for documents using `DID` and is correctly signed, and is revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreButRevokedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                "reason": Object {
                  "code": 12,
                  "codeString": "DOCUMENT_REVOKED",
                  "message": "Document 0xf43045b0c57072a044e810b798e32b8c1de1d0d0c5774d55c8eed1f3fdec6438 has been revoked under contract 0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                },
                "revoked": true,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 12,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0xf43045b0c57072a044e810b798e32b8c1de1d0d0c5774d55c8eed1f3fdec6438 has been revoked under contract 0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail for documents using `DID-DNS` and is correctly signed, and is revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedRevocationStoreButRevokedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                "reason": Object {
                  "code": 12,
                  "codeString": "DOCUMENT_REVOKED",
                  "message": "Document 0xdc34b7bc4e707c77327db76536625c81c2a6777934df566b261bd8ec3f24f8c4 has been revoked under contract 0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
                },
                "revoked": true,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 12,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0xdc34b7bc4e707c77327db76536625c81c2a6777934df566b261bd8ec3f24f8c4 has been revoked under contract 0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail when signature is wrong", async () => {
      whenPublicKeyResolvesSuccessfully("0x1245e5B64D785b25057f7438F715f4aA5D965733");
      const documentWithWrongSig = {
        ...didSignedV3,
        proof: {
          ...didSignedV3.proof,
          signature: dnsDidSignedV3.proof.signature, // Replace with signature from another doc
        },
      };
      const res = await openAttestationDidSignedDocumentStatus.verify(documentWithWrongSig, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
                "issued": false,
                "reason": Object {
                  "code": 7,
                  "codeString": "WRONG_SIGNATURE",
                  "message": "merkle root is not signed correctly by 0x1245e5b64d785b25057f7438f715f4aa5d965733",
                },
              },
              "revocation": Object {
                "revoked": false,
              },
            },
            "issuedOnAll": false,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 7,
            "codeString": "WRONG_SIGNATURE",
            "message": "merkle root is not signed correctly by 0x1245e5b64d785b25057f7438f715f4aa5d965733",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });
});
