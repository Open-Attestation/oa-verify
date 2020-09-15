import { OpenAttestationDnsDid } from "./dnsDidProof";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidNoDns } from "../../../../test/fixtures/v2/documentDnsDidNoDns";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import {
  documentDnsDidMixedTokenRegistryValid,
  documentDnsDidMixedTokenRegistryInvalid,
} from "../../../../test/fixtures/v2/documentDnsDidMixedTokenRegistry";
// TODO Temporarily passing in this option, until make the entire option optional in another PR
const options = {
  network: "ropsten",
};

describe("skip", () => {
  it("should return skip message", async () => {
    const message = await OpenAttestationDnsDid.skip(undefined as any, undefined as any);
    expect(message).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationDnsDid",
        "reason": Object {
          "code": 0,
          "codeString": "SKIPPED",
          "message": "Document was not issued using DNS-DID",
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
      expect(OpenAttestationDnsDid.test(documentRopstenValidWithDocumentStore, options)).toBe(false);
    });
    it("should return false for documents where any issuer is using the `DID` identity proof", () => {
      expect(OpenAttestationDnsDid.test(documentDidSigned, options)).toBe(false);
    });
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {
      expect(OpenAttestationDnsDid.test(documentDnsDidSigned, options)).toBe(true);
    });
  });
});

describe("verify", () => {
  it("should verify a document with dns binding to did", async () => {
    const fragment = await OpenAttestationDnsDid.verify(documentDnsDidSigned, options);
    expect(fragment).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            "location": "example.tradetrust.io",
            "status": "VALID",
          },
        ],
        "name": "OpenAttestationDnsDid",
        "status": "VALID",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });

  it("should verify a document without dns binding to did", async () => {
    const fragment = await OpenAttestationDnsDid.verify(documentDnsDidNoDns, options);
    expect(fragment).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            "location": "example.com",
            "status": "INVALID",
          },
        ],
        "name": "OpenAttestationDnsDid",
        "status": "INVALID",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });

  it("should skip issuers which are not using DNS-DID", async () => {
    const validFragment = await OpenAttestationDnsDid.verify(documentDnsDidMixedTokenRegistryValid, options);
    expect(validFragment).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            "location": "example.tradetrust.io",
            "status": "VALID",
          },
          Object {
            "status": "SKIPPED",
          },
        ],
        "name": "OpenAttestationDnsDid",
        "status": "VALID",
        "type": "ISSUER_IDENTITY",
      }
    `);

    const invalidFragment = await OpenAttestationDnsDid.verify(documentDnsDidMixedTokenRegistryInvalid, options);
    expect(invalidFragment).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            "location": "example.com",
            "status": "INVALID",
          },
          Object {
            "status": "SKIPPED",
          },
        ],
        "name": "OpenAttestationDnsDid",
        "status": "INVALID",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
});
