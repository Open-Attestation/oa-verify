import { v3 } from "@tradetrust-tt/tradetrust";
import { documentDidMixedTokenRegistry } from "../../../../test/fixtures/v2/documentDidMixedTokenRegistry";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDidWrongSignature } from "../../../../test/fixtures/v2/documentDidWrongSignature";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentGoerliValidWithDocumentStore } from "../../../../test/fixtures/v2/documentGoerliValidWithDocumentStore";
import v3DidSignedRaw from "../../../../test/fixtures/v3/did-signed.json";
import v3DidWrappedRaw from "../../../../test/fixtures/v3/did-wrapped.json";
import v3DnsDidSignedRaw from "../../../../test/fixtures/v3/dnsdid-signed.json";
import v3DocumentStoreIssuedRaw from "../../../../test/fixtures/v3/documentStore-issued.json";
import v3TokenRegistryIssuedRaw from "../../../../test/fixtures/v3/tokenRegistry-issued.json";
import { getProvider } from "../../../common/utils";
import { openAttestationDidIdentityProof } from "./didIdentityProof";

const v3DidSigned = v3DidSignedRaw as v3.SignedWrappedDocument;
const v3DidWrapped = v3DidWrappedRaw as v3.WrappedDocument;
const v3DnsDidSigned = v3DnsDidSignedRaw as v3.SignedWrappedDocument;
const v3DocumentStoreIssued = v3DocumentStoreIssuedRaw as v3.WrappedDocument;
const v3TokenRegistryIssued = v3TokenRegistryIssuedRaw as v3.WrappedDocument;

const options = {
  provider: getProvider({
    network: "goerli",
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
          "message": "Document is not using DID as top level identifier or has not been wrapped",
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
      expect(openAttestationDidIdentityProof.test(documentGoerliValidWithDocumentStore, options)).toBe(false);
    });
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {
      expect(openAttestationDidIdentityProof.test(documentDidSigned, options)).toBe(true);
    });
    it("should return false for documents where any issuer is using the `DNS-DID` identity proof", () => {
      expect(openAttestationDidIdentityProof.test(documentDnsDidSigned, options)).toBe(false);
    });
  });
  describe("v3", () => {
    it("should return true for documents using DID as top level identifier", () => {
      expect(openAttestationDidIdentityProof.test(v3DidSigned, options)).toBe(true);
      expect(openAttestationDidIdentityProof.test(v3DidWrapped, options)).toBe(true);
    });
    it("should return false for documents using DNS-DID as top level identifier", () => {
      expect(openAttestationDidIdentityProof.test(v3DnsDidSigned, options)).toBe(false);
    });
    it("should return false for documents using DNS-TXT as top level identifier", () => {
      expect(openAttestationDidIdentityProof.test(v3DocumentStoreIssued, options)).toBe(false);
      expect(openAttestationDidIdentityProof.test(v3TokenRegistryIssued, options)).toBe(false);
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
              "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
              "verified": true,
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
              "reason": Object {
                "code": 7,
                "codeString": "WRONG_SIGNATURE",
                "message": "merkle root is not signed correctly by 0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
              },
              "verified": false,
            },
          ],
          "name": "OpenAttestationDidIdentityProof",
          "reason": Object {
            "code": 7,
            "codeString": "WRONG_SIGNATURE",
            "message": "merkle root is not signed correctly by 0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          },
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

  describe("v3", () => {
    it("should return valid fragment for document using `DID` and signature is correct", async () => {
      const fragment = await openAttestationDidIdentityProof.verify(v3DidSigned, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
            "verified": true,
          },
          "name": "OpenAttestationDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document using `DID` and signature is wrong", async () => {
      const documentWithInvalidSignature = {
        ...v3DidSigned,
        proof: {
          ...v3DidSigned.proof,
          signature: v3DnsDidSigned.proof.signature,
        },
      };
      const fragment = await openAttestationDidIdentityProof.verify(documentWithInvalidSignature, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "did": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
            "reason": Object {
              "code": 7,
              "codeString": "WRONG_SIGNATURE",
              "message": "merkle root is not signed correctly by 0x1245e5B64D785b25057f7438F715f4aA5D965733",
            },
            "verified": false,
          },
          "name": "OpenAttestationDidIdentityProof",
          "reason": Object {
            "code": 7,
            "codeString": "WRONG_SIGNATURE",
            "message": "merkle root is not signed correctly by 0x1245e5B64D785b25057f7438F715f4aA5D965733",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document using `DID` and signature is missing", async () => {
      const proofWithoutSignature = { ...v3DnsDidSigned.proof };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error I really want to delete this :)
      delete proofWithoutSignature.signature;
      const documentWithInvalidSignature = {
        ...v3DidSigned,
        proof: proofWithoutSignature,
      };
      const fragment = await openAttestationDidIdentityProof.verify(documentWithInvalidSignature, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Document is not signed],
          "name": "OpenAttestationDidIdentityProof",
          "reason": Object {
            "code": 5,
            "codeString": "UNSIGNED",
            "message": "Document is not signed",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
  });
});
