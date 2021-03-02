import { v3 } from "@govtechsg/open-attestation";
import { getIdentifier } from "./getIdentifier";
import { VerificationFragment } from "./types/core";
import {
  openAttestationDnsTxtIdentityProof,
  openAttestationDnsDidIdentityProof,
  openAttestationDidIdentityProof,
} from ".";
import { getProvider } from "./common/utils";

import v3DidSignedRaw from "../test/fixtures/v3/did-signed.json";
import v3DnsDidSignedRaw from "../test/fixtures/v3/dnsdid-signed.json";
import v3DocumentStoreIssuedRaw from "../test/fixtures/v3/documentStore-issued.json";

const v3DidSigned = v3DidSignedRaw as v3.SignedWrappedDocument;
const v3DnsDidSigned = v3DnsDidSignedRaw as v3.SignedWrappedDocument;
const v3DocumentStoreIssued = v3DocumentStoreIssuedRaw as v3.WrappedDocument;

const options = {
  provider: getProvider({ network: "ropsten" }),
};

const verificationFragment1: VerificationFragment = {
  status: "SKIPPED",
  type: "DOCUMENT_STATUS",
  name: "OpenAttestationDidSignedDocumentStatus",
  reason: {
    code: 0,
    codeString: "SKIPPED",
    message: "Document was not signed by DID directly",
  },
};
const verificationFragment2: VerificationFragment = {
  name: "OpenAttestationDnsTxtIdentityProof",
  type: "ISSUER_IDENTITY",
  data: [
    {
      status: "VALID",
      location: "example.openattestation.com",
      value: "0x2f60375e8144e16Adf1979936301D8341D58C36C",
    },
  ],
  status: "VALID",
};
const verificationFragment3: VerificationFragment = {
  name: "OpenAttestationDnsDidIdentityProof",
  type: "ISSUER_IDENTITY",
  data: [
    {
      location: "example.tradetrust.io",
      key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      status: "VALID",
    },
  ],
  status: "VALID",
};
const verificationFragment4: VerificationFragment = {
  name: "OpenAttestationDidIdentityProof",
  type: "ISSUER_IDENTITY",
  data: [
    {
      did: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      status: "VALID",
    },
  ],
  status: "VALID",
};
/**
 * this fragment is malformed because the fragment's name is Unknown
 */
const malformedVerificationFragment1: VerificationFragment = {
  name: "Unknown",
  type: "ISSUER_IDENTITY",
  data: [],
  status: "VALID",
};
/**
 * this fragment is malformed because the fragment's data is undefined
 */
const malformedVerificationFragment2: VerificationFragment = {
  name: "OpenAttestationDnsDidIdentityProof",
  type: "ISSUER_IDENTITY",
  data: undefined,
  status: "VALID",
};

describe("getIdentifier", () => {
  it("should throw an error when no fragments are provided", () => {
    expect(() => getIdentifier([])).toThrowError("Please provide at least one verification fragment");
  });
  it("should return an unknown identity proof, when fragment.name is out of specification", () => {
    expect(getIdentifier([verificationFragment1, malformedVerificationFragment1])).toStrictEqual({
      identifier: "Unknown",
      type: "Unknown",
    });
  });
  it("should throw an error when fragment.data cannot be handled", () => {
    expect(() => getIdentifier([verificationFragment1, malformedVerificationFragment2])).toThrowError(
      "No data property found in fragment, malformed fragment"
    );
  });

  describe("v2", () => {
    it("should return a DNS identity proof if issuer fragment is of type OpenAttestationDnsTxtIdentityProof", () => {
      expect(getIdentifier([verificationFragment1, verificationFragment2])).toContainEqual({
        identifier: "example.openattestation.com",
        type: "DNS",
      });
    });
    it("should return a DNS-DID identity proof if issuer fragment is of type OpenAttestationDnsDidIdentityProof", () => {
      expect(getIdentifier([verificationFragment1, verificationFragment3])).toContainEqual({
        identifier: "example.tradetrust.io",
        type: "DNS-DID",
      });
    });
    it("should return a DID identity proof if issuer fragment is of type OpenAttestationDidIdentityProof", () => {
      expect(getIdentifier([verificationFragment1, verificationFragment4])).toContainEqual({
        identifier: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        type: "DID",
      });
    });
  });

  describe("v3", () => {
    it("should return a DNS identity proof if issuer fragment is of type OpenAttestationDnsTxtIdentityProof", async () => {
      const fragment = await openAttestationDnsTxtIdentityProof.verify(v3DocumentStoreIssued, options);
      expect(getIdentifier([verificationFragment1, fragment])).toStrictEqual({
        identifier: "example.tradetrust.io",
        type: "DNS",
      });
    });
    it("should return a DNS-DID identity proof if issuer fragment is of type OpenAttestationDnsDidIdentityProof", async () => {
      const fragment = await openAttestationDnsDidIdentityProof.verify(v3DnsDidSigned, options);
      expect(getIdentifier([verificationFragment1, fragment])).toStrictEqual({
        identifier: "example.tradetrust.io",
        type: "DNS-DID",
      });
    });
    it("should return a DID identity proof if issuer fragment is of type OpenAttestationDidIdentityProof", async () => {
      const fragment = await openAttestationDidIdentityProof.verify(v3DidSigned, options);
      expect(getIdentifier([verificationFragment1, fragment])).toStrictEqual({
        identifier: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        type: "DID",
      });
    });
  });
});
