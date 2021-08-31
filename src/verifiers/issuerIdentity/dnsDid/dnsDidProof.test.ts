import { v3 } from "@govtechsg/open-attestation";
import { openAttestationDnsDidIdentityProof } from "./dnsDidProof";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidNoDnsTxt } from "../../../../test/fixtures/v2/documentDnsDidNoDnsTxt";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentDnsDidMixedTokenRegistryValid } from "../../../../test/fixtures/v2/documentDnsDidMixedTokenRegistry";
import { getProvider } from "../../../common/utils";

import v3DnsDidWrappedRaw from "../../../../test/fixtures/v3/dnsdid-wrapped.json";
import v3DidSignedRaw from "../../../../test/fixtures/v3/did-signed.json";
import v3DnsDidSignedRaw from "../../../../test/fixtures/v3/dnsdid-signed.json";
import v3DocumentStoreIssuedRaw from "../../../../test/fixtures/v3/documentStore-issued.json";
import v3TokenRegistryIssuedRaw from "../../../../test/fixtures/v3/tokenRegistry-issued.json";

const v3DidSigned = v3DidSignedRaw as v3.SignedWrappedDocument;
const v3DnsDidWrapped = v3DnsDidWrappedRaw as v3.WrappedDocument;
const v3DnsDidSigned = v3DnsDidSignedRaw as v3.SignedWrappedDocument;
const v3DocumentStoreIssued = v3DocumentStoreIssuedRaw as v3.WrappedDocument;
const v3TokenRegistryIssued = v3TokenRegistryIssuedRaw as v3.WrappedDocument;

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
  describe("v3", () => {
    it("should return true for signed document using `DNS-DID` top level identity proof", () => {
      expect(openAttestationDnsDidIdentityProof.test(v3DnsDidSigned, options)).toBe(true);
    });
    it("should return false for not signed document using `DNS-DID` top level identity proof", () => {
      expect(openAttestationDnsDidIdentityProof.test(v3DnsDidWrapped, options)).toBe(false);
    });
    it("should return false for document using `DID` top level identity proof", () => {
      expect(openAttestationDnsDidIdentityProof.test(v3DidSigned, options)).toBe(false);
    });
    it("should return false for document using `DNS-TXT` top level identity proof", () => {
      expect(openAttestationDnsDidIdentityProof.test(v3DocumentStoreIssued, options)).toBe(false);
      expect(openAttestationDnsDidIdentityProof.test(v3TokenRegistryIssued, options)).toBe(false);
    });
  });
});

describe("verify", () => {
  describe("v2", () => {
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
          "reason": Object {
            "code": 6,
            "codeString": "INVALID_IDENTITY",
            "message": "Could not find identity at location",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should error if document has issuers not using DNS-DID", async () => {
      const fragment = await openAttestationDnsDidIdentityProof.verify(documentDnsDidMixedTokenRegistryValid, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: Issuer is not using DID-DNS identityProof type],
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 3,
            "codeString": "INVALID_ISSUERS",
            "message": "Issuer is not using DID-DNS identityProof type",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
  });
  describe("v3", () => {
    it("should return valid fragment for document with dns binding to did", async () => {
      const fragment = await openAttestationDnsDidIdentityProof.verify(v3DnsDidSigned, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "key": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
            "location": "example.tradetrust.io",
            "status": "VALID",
          },
          "name": "OpenAttestationDnsDidIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document without dns binding to did", async () => {
      const documentWithoutDnsBinding = {
        ...v3DnsDidSigned,
        openAttestationMetadata: {
          ...v3DnsDidSigned.openAttestationMetadata,
          identityProof: {
            type: v3.IdentityProofType.DNSDid,
            identifier: "example.com",
          },
        },
      };
      const fragment = await openAttestationDnsDidIdentityProof.verify(documentWithoutDnsBinding, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "key": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
            "location": "example.com",
            "status": "INVALID",
          },
          "name": "OpenAttestationDnsDidIdentityProof",
          "reason": Object {
            "code": 6,
            "codeString": "INVALID_IDENTITY",
            "message": "Could not find identity at location",
          },
          "status": "INVALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
  });
});
