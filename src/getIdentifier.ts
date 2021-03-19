import { AllVerificationFragment, isVerificationFragmentWithData, VerificationFragmentWithData } from "./types/core";
import { DidVerificationStatus, DidVerificationStatusArray } from "./did/verifier";
import {
  DnsDidVerificationStatus,
  DnsDidVerificationStatusArray,
} from "./verifiers/issuerIdentity/dnsDid/dnsDidProof.type";
import {
  DnsTxtVerificationStatusArray,
  DnsTxtVerificationStatusDataV3,
} from "./verifiers/issuerIdentity/dnsTxt/openAttestationDnsTxt.type";

enum IdentityProof {
  DNS = "OpenAttestationDnsTxtIdentityProof",
  DNSDID = "OpenAttestationDnsDidIdentityProof",
  DID = "OpenAttestationDidIdentityProof",
}

const getDnsIdentifierProof = ({ data }: VerificationFragmentWithData<unknown>) => {
  const type = "DNS";
  if (DnsTxtVerificationStatusDataV3.guard(data)) {
    return {
      identifier: data.identifier,
      type,
    };
  } else if (DnsTxtVerificationStatusArray.guard(data)) {
    return data.map((issuer) => ({
      identifier: issuer.location,
      type,
    }));
  }
  throw new Error("Fragment for DNS not supported");
};

const getDnsDidIdentifierProof = ({ data }: VerificationFragmentWithData<unknown>) => {
  const type = "DNS-DID";
  if (DnsDidVerificationStatusArray.guard(data)) {
    return data.map((issuer) => ({
      identifier: issuer.location,
      type,
    }));
  } else if (DnsDidVerificationStatus.guard(data)) {
    return {
      identifier: data.location,
      type,
    };
  }
  throw new Error("Fragment for DNS-DID not supported");
};

const getDidIdentifierProof = ({ data }: VerificationFragmentWithData<unknown>) => {
  const type = "DID";
  if (DidVerificationStatusArray.guard(data)) {
    return data.map((issuer) => ({
      identifier: issuer.did,
      type,
    }));
  } else if (DidVerificationStatus.guard(data)) {
    return {
      identifier: data.did,
      type,
    };
  }
  throw new Error("Fragment for DID not supported");
};

const getIdentityProofFragment = <T extends AllVerificationFragment<unknown>>(fragments: T[]): T | undefined => {
  if (fragments.length < 1) {
    throw new Error("Please provide at least one verification fragment");
  }
  return fragments.find((status) => status.type === "ISSUER_IDENTITY" && status.status === "VALID");
};

export const getIdentifier = <T extends AllVerificationFragment<unknown>>(fragments: T[]) => {
  const fragment = getIdentityProofFragment(fragments);
  if (!fragment) {
    throw new Error("Did not find any Issuer Identity fragment that is valid");
  }
  if (!isVerificationFragmentWithData(fragment)) {
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
