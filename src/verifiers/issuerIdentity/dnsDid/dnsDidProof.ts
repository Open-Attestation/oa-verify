import { getData, utils, v2, v3 } from "@tradetrust-tt/tradetrust";
import { getDnsDidRecords } from "@tradetrust-tt/dnsprove";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDnsDidCode } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";
import {
  DnsDidVerificationStatus,
  OpenAttestationDnsDidIdentityProofVerificationFragment,
  ValidDnsDidVerificationStatus,
  ValidDnsDidVerificationStatusArray,
} from "./dnsDidProof.type";

const name = "OpenAttestationDnsDidIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<OpenAttestationDnsDidIdentityProofVerificationFragment>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDnsDidCode.SKIPPED,
      codeString: OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.SKIPPED],
      message: `Document was not issued using DNS-DID`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  if (utils.isSignedWrappedV2Document(document)) {
    const data = getData(document);
    return data.issuers.some((issuer) => issuer.identityProof?.type === "DNS-DID");
  } else if (utils.isSignedWrappedV3Document(document)) {
    return document.openAttestationMetadata.identityProof.type === v3.IdentityProofType.DNSDid;
  }
  return false;
};

const verifyIssuerDnsDid = async ({
  key,
  location,
}: {
  key: string;
  location: string;
}): Promise<DnsDidVerificationStatus> => {
  const records = await getDnsDidRecords(location);
  return {
    location,
    key,
    status: records.some((record) => record.publicKey.toLowerCase() === key.toLowerCase()) ? "VALID" : "INVALID",
  };
};

const verifyV2 = async (
  document: v2.SignedWrappedDocument
): Promise<OpenAttestationDnsDidIdentityProofVerificationFragment> => {
  const documentData = getData(document);
  const deferredVerificationStatus: Promise<DnsDidVerificationStatus>[] = documentData.issuers.map((issuer) => {
    const { identityProof } = issuer;
    if (!identityProof)
      throw new CodedError(
        "Identity proof missing",
        OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF,
        OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF]
      );
    const { key, location, type: identityProofType } = identityProof;
    if (identityProofType !== v2.IdentityProofType.DNSDid)
      throw new CodedError(
        "Issuer is not using DID-DNS identityProof type",
        OpenAttestationDnsDidCode.INVALID_ISSUERS,
        OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.INVALID_ISSUERS]
      );
    if (!location)
      throw new CodedError(
        "location is not present in identity proof",
        OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF,
        OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF]
      );
    if (!key)
      throw new CodedError(
        "key is not present in identity proof",
        OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF,
        OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF]
      );
    return verifyIssuerDnsDid({ key, location });
  });
  const verificationStatus = await Promise.all(deferredVerificationStatus);

  if (ValidDnsDidVerificationStatusArray.guard(verificationStatus)) {
    return {
      name,
      type,
      data: verificationStatus,
      status: "VALID",
    };
  }

  return {
    name,
    type,
    data: verificationStatus,
    reason: {
      message: "Could not find identity at location",
      code: OpenAttestationDnsDidCode.INVALID_IDENTITY,
      codeString: "INVALID_IDENTITY",
    },
    status: "INVALID",
  };
};

const verifyV3 = async (
  document: v3.SignedWrappedDocument
): Promise<OpenAttestationDnsDidIdentityProofVerificationFragment> => {
  if (!utils.isSignedWrappedV3Document(document))
    throw new CodedError(
      "document is not signed",
      OpenAttestationDnsDidCode.UNSIGNED,
      OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNSIGNED]
    );
  const location = document.openAttestationMetadata.identityProof.identifier;
  const { key } = document.proof;
  const verificationStatus = await verifyIssuerDnsDid({ key, location });

  if (ValidDnsDidVerificationStatus.guard(verificationStatus)) {
    return {
      name,
      type,
      data: verificationStatus,
      status: "VALID",
    };
  }
  return {
    name,
    type,
    data: verificationStatus,
    status: "INVALID",
    reason: {
      message: "Could not find identity at location",
      code: OpenAttestationDnsDidCode.INVALID_IDENTITY,
      codeString: "INVALID_IDENTITY",
    },
  };
};

const verify: VerifierType["verify"] = async (document) => {
  if (utils.isSignedWrappedV2Document(document)) return verifyV2(document);
  else if (utils.isSignedWrappedV3Document(document)) return verifyV3(document);
  throw new CodedError(
    "Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.",
    OpenAttestationDnsDidCode.UNRECOGNIZED_DOCUMENT,
    OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNRECOGNIZED_DOCUMENT]
  );
};

export const openAttestationDnsDidIdentityProof: VerifierType = {
  skip,
  test,
  verify: withCodedErrorHandler(verify, {
    name,
    type,
    unexpectedErrorCode: OpenAttestationDnsDidCode.UNEXPECTED_ERROR,
    unexpectedErrorString: OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNEXPECTED_ERROR],
  }),
};
