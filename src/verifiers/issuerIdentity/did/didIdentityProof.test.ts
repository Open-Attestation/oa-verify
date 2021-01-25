import { openAttestationDidIdentityProof } from "./didIdentityProof";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDidWrongSignature } from "../../../../test/fixtures/v2/documentDidWrongSignature";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentDidMixedTokenRegistry } from "../../../../test/fixtures/v2/documentDidMixedTokenRegistry";
import { getProvider } from "../../../common/utils";

const options = {
  provider: getProvider({
    network: "ropsten",
  }),
};

describe("skip", () => {
  it("should return skip message", async () => {
    const message = await openAttestationDidIdentityProof.skip(undefined as any, undefined as any);
    expect(message).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationDidIdentityProof",
        "reason": Object {
          "code": 0,
          "codeString": "SKIPPED",
          "message": "Document is not using DID as top level identifier",
        },
        "status": "SKIPPED",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
});

describe("test", () => {
  describe("v2", () => {
    it("should return false for documents not using DID as top level identifier", () => {
      expect(openAttestationDidIdentityProof.test(documentRopstenValidWithDocumentStore, options)).toBe(false);
    });
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {
      expect(openAttestationDidIdentityProof.test(documentDidSigned, options)).toBe(true);
    });
    it("should return false for documents where any issuer is using the `DNS-DID` identity proof", () => {
      expect(openAttestationDidIdentityProof.test(documentDnsDidSigned, options)).toBe(false);
    });
  });
});

describe("verify", () => {
  describe("v2", () => {
    it("should pass for documents using `DID` and did signature is correct", async () => {
      const verificationFragment = await openAttestationDidIdentityProof.verify(documentDidSigned, options);
      expect(verificationFragment).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
              "status": "VALID",
            },
          ],
          "name": "OpenAttestationDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should fail for documents using `DID` and did signature is not correct", async () => {
      const verificationFragment = await openAttestationDidIdentityProof.verify(documentDidWrongSignature, options);
      expect(verificationFragment).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "did": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
              "status": "INVALID",
            },
          ],
          "name": "OpenAttestationDidIdentityProof",
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should fail for documents with other issuers", async () => {
      const verificationFragment = await openAttestationDidIdentityProof.verify(documentDidMixedTokenRegistry, options);
      expect(verificationFragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Issuer is not using DID identityProof type],
          "name": "OpenAttestationDidIdentityProof",
          "reason": Object {
            "code": 2,
            "codeString": "INVALID_ISSUERS",
            "message": "Issuer is not using DID identityProof type",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
  });
});
