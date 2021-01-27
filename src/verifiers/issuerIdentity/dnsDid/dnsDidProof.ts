import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { getDnsDidRecords } from "@govtechsg/dnsprove";
import {
  VerificationFragmentType,
  Verifier,
  VerificationFragment,
  VerificationFragmentStatus,
} from "../../../types/core";
import { OpenAttestationDnsDidCode } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";

const name = "OpenAttestationDnsDidIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

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
  if (utils.isWrappedV2Document(document)) {
    const data = getData(document);
    return !!data?.issuers.some((issuer) => issuer.identityProof?.type === "DNS-DID");
  }
  if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.identityProof.type === v3.IdentityProofType.DNSDid;
  }
  return false;
};
interface DnsVerificationFragment {
  status: VerificationFragmentStatus;
  location?: string;
  key?: string;
}

const verifyIssuerDnsDid = async ({
  key,
  location,
}: {
  key: string;
  location: string;
}): Promise<DnsVerificationFragment> => {
  const records = await getDnsDidRecords(location);
  return {
    location,
    key,
    status: records.some((record) => record.publicKey.toLowerCase() === key.toLowerCase()) ? "VALID" : "INVALID",
  };
};

const verifyV2 = async (document: v2.WrappedDocument): Promise<VerificationFragment> => {
  if (!utils.isSignedWrappedV2Document(document))
    throw new CodedError(
      "document is not signed",
      OpenAttestationDnsDidCode.UNSIGNED,
      OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNSIGNED]
    );
  const documentData = getData(document);
  const deferredVerificationStatus: Promise<DnsVerificationFragment>[] = documentData.issuers.map((issuer) => {
    const { identityProof } = issuer;
    if (!identityProof)
      throw new CodedError(
        "Identity proof missing",
        OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF,
        OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF]
      );
    const { key, location, type } = identityProof;
    if (type !== v2.IdentityProofType.DNSDid)
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
  const overallStatus =
    verificationStatus.some((status) => status.status === "VALID") &&
    verificationStatus.every((status) => status.status === "VALID")
      ? "VALID"
      : "INVALID";
  return {
    name,
    type,
    data: verificationStatus,
    status: overallStatus,
  };
};

const verifyV3 = async (document: v3.WrappedDocument): Promise<VerificationFragment> => {
  if (!utils.isSignedWrappedV3Document(document))
    throw new CodedError(
      "document is not signed",
      OpenAttestationDnsDidCode.UNSIGNED,
      OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNSIGNED]
    );
  const location = document.openAttestationMetadata.identityProof.identifier;
  const { key } = document.proof;
  const verificationStatus = await verifyIssuerDnsDid({ key, location });

  return {
    name,
    type,
    data: verificationStatus,
    status: verificationStatus.status,
  };
};

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document) => {
    if (utils.isWrappedV2Document(document)) return verifyV2(document);
    if (utils.isWrappedV3Document(document)) return verifyV3(document);
    throw new Error("");
  },
  {
    name,
    type,
    unexpectedErrorCode: OpenAttestationDnsDidCode.UNEXPECTED_ERROR,
    unexpectedErrorString: OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNEXPECTED_ERROR],
  }
);

export const openAttestationDnsDidIdentityProof: VerifierType = {
  skip,
  test,
  verify,
};
