import { v3 } from "@govtechsg/open-attestation";
import {
  openAttestationDidIdentityProof,
  openAttestationDnsDidIdentityProof,
  openAttestationDnsTxtIdentityProof,
} from ".";
import { getProvider } from "./common/utils";
import { getIdentifier } from "./getIdentifier";
import { SkippedVerificationFragment, ValidVerificationFragment } from "./types/core";

import v3DidSignedRaw from "../test/fixtures/v3/did-signed.json";
import v3DnsDidSignedRaw from "../test/fixtures/v3/dnsdid-signed.json";
import v3DocumentStoreIssuedRaw from "../test/fixtures/v3/documentStore-issued.json";
import { OpenAttestationDidIdentityProofValidFragmentV2 } from "./verifiers/issuerIdentity/did/didIdentityProof.type";
import { OpenAttestationDnsTxtIdentityProofValidFragmentV2 } from "./verifiers/issuerIdentity/dnsTxt/openAttestationDnsTxt.type";

const v3DidSigned = v3DidSignedRaw as v3.SignedWrappedDocument;
const v3DnsDidSigned = v3DnsDidSignedRaw as v3.SignedWrappedDocument;
const v3DocumentStoreIssued = v3DocumentStoreIssuedRaw as v3.WrappedDocument;

const options = {
  provider: getProvider({ network: "sepolia" }),
};

const verificationFragment1: SkippedVerificationFragment = {
  status: "SKIPPED",
  type: "DOCUMENT_STATUS",
  name: "OpenAttestationDidSignedDocumentStatus",
  reason: {
    code: 0,
    codeString: "SKIPPED",
    message: "Document was not signed by DID directly",
  },
};
const verificationFragment2: OpenAttestationDnsTxtIdentityProofValidFragmentV2 = {
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
const verificationFragment3: ValidVerificationFragment<{ status: "VALID"; location: string; key: string }[]> = {
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
const verificationFragment4: OpenAttestationDidIdentityProofValidFragmentV2 = {
  name: "OpenAttestationDidIdentityProof",
  type: "ISSUER_IDENTITY",
  data: [
    {
      did: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      verified: true,
    },
  ],
  status: "VALID",
};
/**
 * this fragment is malformed because the fragment's name is Unknown
 */
const malformedVerificationFragment1: ValidVerificationFragment<[]> = {
  name: "Unknown",
  type: "ISSUER_IDENTITY",
  data: [],
  status: "VALID",
};
/**
 * this fragment is malformed because the fragment's data is undefined
 */
const malformedVerificationFragment2: ValidVerificationFragment<undefined> = {
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
        identifier: "example.openattestation.com",
        type: "DNS",
      });
    });
    it("should return a DNS-DID identity proof if issuer fragment is of type OpenAttestationDnsDidIdentityProof", async () => {
      const fragment = await openAttestationDnsDidIdentityProof.verify(v3DnsDidSigned, options);
      expect(getIdentifier([verificationFragment1, fragment])).toStrictEqual({
        identifier: "demo-tradetrust.openattestation.com",
        type: "DNS-DID",
      });
    });
    it("should return a DID identity proof if issuer fragment is of type OpenAttestationDidIdentityProof", async () => {
      const fragment = await openAttestationDidIdentityProof.verify(v3DidSigned, options);
      expect(getIdentifier([verificationFragment1, fragment])).toStrictEqual({
        identifier: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
        type: "DID",
      });
    });
  });
});
