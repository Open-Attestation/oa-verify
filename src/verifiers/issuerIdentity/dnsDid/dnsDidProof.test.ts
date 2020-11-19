import { openAttestationDnsDidIdentityProof } from "./dnsDidProof";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidNoDnsTxt } from "../../../../test/fixtures/v2/documentDnsDidNoDnsTxt";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import {
  documentDnsDidMixedTokenRegistryValid,
  documentDnsDidMixedTokenRegistryInvalid,
} from "../../../../test/fixtures/v2/documentDnsDidMixedTokenRegistry";
import { getProvider } from "../../../common/utils";

const options = {
  provider: getProvider({ network: "ropsten" }),
};

describe("skip", () => {
  it("should return skip message", async () => {
    const message = await openAttestationDnsDidIdentityProof.skip(undefined as any, undefined as any);
    expect(message).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationDnsDidIdentityProof",
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
      expect(openAttestationDnsDidIdentityProof.test(documentRopstenValidWithDocumentStore, options)).toBe(false);
    });
    it("should return false for documents where any issuer is using the `DID` identity proof", () => {
      expect(openAttestationDnsDidIdentityProof.test(documentDidSigned, options)).toBe(false);
    });
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {
      expect(openAttestationDnsDidIdentityProof.test(documentDnsDidSigned, options)).toBe(true);
    });
  });
});

describe("verify", () => {
  it("should verify a document with dns binding to did", async () => {
    const fragment = await openAttestationDnsDidIdentityProof.verify(documentDnsDidSigned, options);
    expect(fragment).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            "location": "example.tradetrust.io",
            "status": "VALID",
          },
        ],
        "name": "OpenAttestationDnsDidIdentityProof",
        "status": "VALID",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });

  it("should verify a document without dns binding to did", async () => {
    const fragment = await openAttestationDnsDidIdentityProof.verify(documentDnsDidNoDnsTxt, options);
    expect(fragment).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            "location": "example.com",
            "status": "INVALID",
          },
        ],
        "name": "OpenAttestationDnsDidIdentityProof",
        "status": "INVALID",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });

  it("should fail if document has issuers not using DNS-DID", async () => {
    const validFragment = await openAttestationDnsDidIdentityProof.verify(
      documentDnsDidMixedTokenRegistryValid,
      options
    );
    expect(validFragment).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            "location": "example.tradetrust.io",
            "status": "VALID",
          },
          Object {
            "reason": Object {
              "code": 3,
              "codeString": "INVALID_ISSUERS",
              "message": "Issuer is not using DID-DNS identityProof type",
            },
            "status": "INVALID",
          },
        ],
        "name": "OpenAttestationDnsDidIdentityProof",
        "status": "INVALID",
        "type": "ISSUER_IDENTITY",
      }
    `);

    const invalidFragment = await openAttestationDnsDidIdentityProof.verify(
      documentDnsDidMixedTokenRegistryInvalid,
      options
    );
    expect(invalidFragment).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            "location": "example.com",
            "status": "INVALID",
          },
          Object {
            "reason": Object {
              "code": 3,
              "codeString": "INVALID_ISSUERS",
              "message": "Issuer is not using DID-DNS identityProof type",
            },
            "status": "INVALID",
          },
        ],
        "name": "OpenAttestationDnsDidIdentityProof",
        "status": "INVALID",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
});
