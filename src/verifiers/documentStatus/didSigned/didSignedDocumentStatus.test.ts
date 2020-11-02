import { openAttestationDidSignedDocumentStatus } from "./didSignedDocumentStatus";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentDidCustomRevocation } from "../../../../test/fixtures/v2/documentDidCustomRevocation";
import { documentDidMissingProof } from "../../../../test/fixtures/v2/documentDidMissingProof";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { documentDidObfuscatedRevocation } from "../../../../test/fixtures/v2/documentDidObfuscatedRevocation";
import { getPublicKey } from "../../../did/resolver";

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

// TODO Temporarily passing in this option, until make the entire option optional in another PR
const options = {
  network: "ropsten",
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
    it("should fail when proof is missing", async () => {
      whenPublicKeyResolvesSuccessfully();
      const res = await openAttestationDidSignedDocumentStatus.verify(documentDidMissingProof, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Only signed v2 is supported now],
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 1,
            "codeString": "UNEXPECTED_ERROR",
            "message": "Only signed v2 is supported now",
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
      const res = await openAttestationDidSignedDocumentStatus.verify({ ...documentDidSigned, proof: [] }, options);
      expect(res).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Proof not found for did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller],
          "name": "OpenAttestationDidSignedDocumentStatus",
          "reason": Object {
            "code": 5,
            "codeString": "CORRESPONDING_PROOF_MISSING",
            "message": "Proof not found for did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });
});
