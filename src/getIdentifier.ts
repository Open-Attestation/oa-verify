import { Record, String, Static } from "runtypes";
import { VerificationFragment } from "./types/core";
import { Identity } from "./verifiers/issuerIdentity/dnsTxt";
import { SignatureVerificationFragment } from "./verifiers/issuerIdentity/did";
import { DnsVerificationFragment } from "./verifiers/issuerIdentity/dnsDid";

enum IdentityProof {
  DNS = "OpenAttestationDnsTxtIdentityProof",
  DNSDID = "OpenAttestationDnsDidIdentityProof",
  DID = "OpenAttestationDidIdentityProof",
}

const DataDnsIdentifier = Record({
  identifier: String,
  value: String,
});
type DataDnsIdentifier = Static<typeof DataDnsIdentifier>;

const getDnsIdentifierProof = (fragment: VerificationFragment<DataDnsIdentifier | Identity[]>) => {
  const type = "DNS";
  if (Array.isArray(fragment.data)) {
    return fragment.data.map((issuer: Identity) => ({
      identifier: issuer.location,
      type,
    }));
  }
  return {
    identifier: fragment.data?.identifier,
    type,
  };
};

const getDnsDidIdentifierProof = (
  fragment: VerificationFragment<DnsVerificationFragment | DnsVerificationFragment[]>
) => {
  const type = "DNS-DID";
  if (Array.isArray(fragment.data)) {
    return fragment.data.map((issuer: DnsVerificationFragment) => ({
      identifier: issuer.location,
      type,
    }));
  }
  return {
    identifier: fragment.data?.location,
    type,
  };
};

const getDidIdentifierProof = (
  fragment: VerificationFragment<SignatureVerificationFragment | SignatureVerificationFragment[]>
) => {
  const type = "DID";
  if (Array.isArray(fragment.data)) {
    return fragment.data.map((issuer: SignatureVerificationFragment) => ({
      identifier: issuer.did,
      type,
    }));
  }
  return {
    identifier: fragment.data?.did,
    type,
  };
};

const getIdentityProofFragment = (fragments: VerificationFragment[]) => {
  if (fragments.length < 1) {
    throw new Error("Please provide at least one verification fragment");
  }
  return fragments.find((status) => status.type === "ISSUER_IDENTITY" && status.status === "VALID");
};

export const getIdentifier = (fragments: VerificationFragment[]) => {
  const fragment = getIdentityProofFragment(fragments);
  if (!fragment) {
    throw new Error("Did not find any Issuer Identity fragment that is valid");
  }
  if (!fragment.data) {
    throw new Error("No data property found in fragment, malformed fragment");
  }
  switch (fragment.name) {
    case IdentityProof.DNS:
      return getDnsIdentifierProof(fragment);
    case IdentityProof.DNSDID:
      return getDnsDidIdentifierProof(fragment);
    case IdentityProof.DID:
      return getDidIdentifierProof(fragment);
    default:
      return {
        identifier: "Unknown",
        type: "Unknown",
      };
  }
};
