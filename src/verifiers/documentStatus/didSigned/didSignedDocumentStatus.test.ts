import { v3, WrappedDocument, SignedWrappedDocument } from "@govtechsg/open-attestation";
import { openAttestationDidSignedDocumentStatus } from "./didSignedDocumentStatus";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentDidCustomRevocation } from "../../../../test/fixtures/v2/documentDidCustomRevocation";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { documentDidObfuscatedRevocation } from "../../../../test/fixtures/v2/documentDidObfuscatedRevocation";
import { getPublicKey } from "../../../did/resolver";
import { getProvider } from "../../../common/utils";
import sampleDocumentStoreWrappedV3 from "../../../../test/fixtures/v3/documentStore-wrapped.json";
import sampleTokenRegistryWrappedV3 from "../../../../test/fixtures/v3/tokenRegistry-wrapped.json";
import sampleDidSignedV3 from "../../../../test/fixtures/v3/did-signed.json";
import sampleDNSDidSignedV3 from "../../../../test/fixtures/v3/dnsdid-signed.json";

const documentStoreWrapV3 = sampleDocumentStoreWrappedV3 as WrappedDocument<v3.OpenAttestationDocument>;
const tokenRegistryWrapV3 = sampleTokenRegistryWrappedV3 as WrappedDocument<v3.OpenAttestationDocument>;
const didSignedV3 = sampleDidSignedV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;
const dnsDidSignedV3 = sampleDNSDidSignedV3 as SignedWrappedDocument<v3.OpenAttestationDocument>;

jest.mock("../../../did/resolver");

const mockGetPublicKey = getPublicKey as jest.Mock;

const whenPublicKeyResolvesSuccessfully = () => {
  // Private key for signing from this address
  // 0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655
  // sign using wallet.signMessage(utils.arrayify(merkleRoot))
  mockGetPublicKey.mockResolvedValue({
    id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
    type: "Secp256k1VerificationKey2018",
    controller: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
    ethereumAddress: "0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
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
    it("should fail when revocation is not set to NONE (for now)", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDidCustomRevocation, options);
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
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "INVALID",
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
      const res = await openAttestationDidSignedDocumentStatus.verify({ ...documentDidSigned, proof: [] }, options);
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
            },
            "issuedOnAll": false,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
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
                "verified": true,
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
                "verified": true,
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

    it("should fail when revocation is not set to NONE (for now)", async () => {
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
          "data": Object {
            "details": Object {
              "issuance": Object {
                "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
                "verified": true,
              },
            },
            "issuedOnAll": true,
            "revokedOnAny": true,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
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
                "reason": Object {
                  "code": 7,
                  "codeString": "WRONG_SIGNATURE",
                  "message": "merkle root is not signed correctly by 0xe712878f6e8d5d4f9e87e10da604f9cb564c9a89",
                },
                "verified": false,
              },
            },
            "issuedOnAll": false,
            "revokedOnAny": false,
          },
          "name": "OpenAttestationDidSignedDocumentStatus",
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });
});
