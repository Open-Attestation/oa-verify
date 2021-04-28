import { v2, v3, WrappedDocument, SignedWrappedDocument } from "@govtechsg/open-attestation";
import { openAttestationDidSignedDocumentStatus } from "./didSignedDocumentStatus";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentDidCustomRevocation } from "../../../../test/fixtures/v2/documentDidCustomRevocation";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { documentDidObfuscatedRevocation } from "../../../../test/fixtures/v2/documentDidObfuscatedRevocation";
import { getVerificationMethod } from "../../../did/resolver";
import { getProvider } from "../../../common/utils";
import sampleDocumentStoreWrappedV3 from "../../../../test/fixtures/v3/documentStore-wrapped.json";
import sampleTokenRegistryWrappedV3 from "../../../../test/fixtures/v3/tokenRegistry-wrapped.json";
import sampleDidSignedV3 from "../../../../test/fixtures/v3/did-signed.json";
import sampleDNSDidSignedV3 from "../../../../test/fixtures/v3/dnsdid-signed.json";
import sampleDidSignedRevocationStoreNotRevokedV3 from "../../../../test/fixtures/v3/did-revocation-store-signed-not-revoked.json";
import sampleDidSignedRevocationStoreButRevokedV3 from "../../../../test/fixtures/v3/did-revocation-store-signed-revoked.json";
import sampleDidSignedRevocationStoreButNoLocationV3 from "../../../../test/fixtures/v3/did-revocation-store-signed-no-location.json";
import sampleDnsDidSignedRevocationStoreNotRevokedV3 from "../../../../test/fixtures/v3/dnsdid-revocation-store-signed-not-revoked.json";
import sampleDnsDidSignedRevocationStoreButRevokedV3 from "../../../../test/fixtures/v3/dnsdid-revocation-store-signed-revoked.json";

import sampleDidSignedRevocationStoreNotRevokedV2 from "../../../../test/fixtures/v2/did-revocation-store-signed-not-revoked.json";
import sampleDidSignedRevocationStoreButRevokedV2 from "../../../../test/fixtures/v2/did-revocation-store-signed-revoked.json";
import sampleDidSignedRevocationStoreButNoLocationV2 from "../../../../test/fixtures/v2/did-revocation-store-signed-no-location.json";
import sampleDnsDidSignedRevocationStoreNotRevokedV2 from "../../../../test/fixtures/v2/dnsdid-revocation-store-signed-not-revoked.json";
import sampleDnsDidSignedRevocationStoreButRevokedV2 from "../../../../test/fixtures/v2/dnsdid-revocation-store-signed-revoked.json";

const didSignedRevocationStoreNotRevokedV2 = sampleDidSignedRevocationStoreNotRevokedV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const didSignedRevocationStoreButRevokedV2 = sampleDidSignedRevocationStoreButRevokedV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const didSignedRevocationStoreButNoLocationV2 = sampleDidSignedRevocationStoreButNoLocationV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const dnsDidSignedRevocationStoreNotRevokedV2 = sampleDnsDidSignedRevocationStoreNotRevokedV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;
const dnsDidSignedRevocationStoreButRevokedV2 = sampleDnsDidSignedRevocationStoreButRevokedV2 as SignedWrappedDocument<v2.OpenAttestationDocument>;

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

const whenPublicKeyResolvesSuccessfully = () => {
  // Private key for signing from this address
  // 0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655
  // sign using wallet.signMessage(utils.arrayify(merkleRoot))
  mockGetPublicKey.mockResolvedValue({
    id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
    type: "EcdsaSecp256k1RecoveryMethod2020",
    controller: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
    blockchainAccountId: "0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
  });
};

const options = {
  provider: getProvider({
    network: "ropsten",
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
      expect(openAttestationDidSignedDocumentStatus.test(documentRopstenValidWithDocumentStore, options)).toBe(false);
      expect(openAttestationDidSignedDocumentStatus.test(documentRopstenNotIssuedWithTokenRegistry, options)).toBe(
        false
      );
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
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDidSigned, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
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
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreNotRevokedV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDnsDidSigned, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
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
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedRevocationStoreNotRevokedV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
          "data": [Error: Proof not found for did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller],
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 6,
            "codeString": "CORRESPONDING_PROOF_MISSING",
            "message": "Proof not found for did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail when signature is wrong", async () => {
      whenPublicKeyResolvesSuccessfully();
      const incorrectSignatureDocument = { ...documentDnsDidSigned, proof: documentDidSigned.proof };
      const res = await openAttestationDidSignedDocumentStatus.verify(incorrectSignatureDocument, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
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
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreButRevokedV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x65f1e3c2a042dc9648f26f08257fd47a3739e40606d2dc887fe7566c8290144c has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0x65f1e3c2a042dc9648f26f08257fd47a3739e40606d2dc887fe7566c8290144c has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
    it("should fail for documents using `DID-DNS` and is correctly signed, and is revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedRevocationStoreButRevokedV2, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Array [
                Object {
                  "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                  "issued": true,
                },
              ],
              "revocation": Array [
                Object {
                  "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Document 0x18dd9adb48fd72f54e954cd661e8778520d3676d4ab470384946791cd7aaf809 has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0x18dd9adb48fd72f54e954cd661e8778520d3676d4ab470384946791cd7aaf809 has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });

  describe("v3", () => {
    it("should pass for documents using `DID` and is correctly signed", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
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
      whenPublicKeyResolvesSuccessfully();
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
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreNotRevokedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
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
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedRevocationStoreNotRevokedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
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
      whenPublicKeyResolvesSuccessfully();
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
            value: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          },
          identityProof: {
            type: "DID",
            identifier: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
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
      whenPublicKeyResolvesSuccessfully();
      const docWithIncorrectRevocation = {
        ...didSignedV3,
        openAttestationMetadata: {
          ...didSignedV3.openAttestationMetadata,
          proof: {
            type: "OpenAttestationProofMethod",
            method: "DID",
            value: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            revocation: {
              type: "SOMETHING-ELSE",
            },
          },
        },
      };
      const res = await openAttestationDidSignedDocumentStatus.verify(docWithIncorrectRevocation as any, options);
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

    it("should fail for documents using `DID` and is correctly signed, and is revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(didSignedRevocationStoreButRevokedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                "reason": Object {
                  "code": 5,
                  "codeString": "DOCUMENT_REVOKED",
                  "message": "Document 0xd271155c3fccaf97fd9404b15000399620002c092c047d3cd506cf51ecd522d7 has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                },
                "revoked": true,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0xd271155c3fccaf97fd9404b15000399620002c092c047d3cd506cf51ecd522d7 has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should fail for documents using `DID-DNS` and is correctly signed, and is revoked on a document store (if specified)", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(dnsDidSignedRevocationStoreButRevokedV3, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                "issued": true,
              },
              "revocation": Object {
                "address": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                "reason": Object {
                  "code": 5,
                  "codeString": "DOCUMENT_REVOKED",
                  "message": "Document 0x18821b9fb922c38c743bf223cfc08afb8f90c74527d1f9addf3ab766bf1d3eb1 has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
                },
                "revoked": true,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 5,
            "codeString": "DOCUMENT_REVOKED",
            "message": "Document 0x18821b9fb922c38c743bf223cfc08afb8f90c74527d1f9addf3ab766bf1d3eb1 has been revoked under contract 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should fail when signature is wrong", async () => {
      whenPublicKeyResolvesSuccessfully();
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
                "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                "issued": false,
                "reason": Object {
                  "code": 7,
                  "codeString": "WRONG_SIGNATURE",
                  "message": "merkle root is not signed correctly by 0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
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
            "message": "merkle root is not signed correctly by 0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });
});
