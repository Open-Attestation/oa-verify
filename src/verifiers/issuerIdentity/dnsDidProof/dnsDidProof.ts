import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { getDnsDidRecords } from "@govtechsg/dnsprove";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDnsDidCode } from "../../../types/error";
import { CodedError } from "../../../common/error";

const name = "OpenAttestationDnsDid";
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
  if (!utils.isSignedWrappedV2Document(document)) return false;
  const data = getData(document);
  if (data?.issuers.some((issuer) => issuer.identityProof?.type === "DNS-DID")) return true;
  return false;
};

interface IdentityProof {
  type: string;
  key?: string;
  location?: string;
}

interface VerificationFragment {
  status: "VALID" | "SKIPPED" | "INVALID";
  location?: string;
  key?: string;
}

const verifyIssuerDnsDid = async ({
  key,
  location,
  type: identityType,
}: IdentityProof): Promise<VerificationFragment> => {
  if (identityType !== "DNS-DID")
    return {
      status: "SKIPPED",
    };
  if (!location)
    throw new CodedError(
      "location is not present in identity proof",
      OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF,
      "MALFORMED_IDENTITY_PROOF"
    );
  if (!key)
    throw new CodedError(
      "key is not present in identity proof",
      OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF,
      "MALFORMED_IDENTITY_PROOF"
    );
  const records = await getDnsDidRecords(location);
  return {
    location,
    key,
    status: records.some((record) => record.publicKey.toLowerCase() === key.toLowerCase()) ? "VALID" : "INVALID",
  };
};

const verify: VerifierType["verify"] = async (document) => {
  try {
    if (!utils.isSignedWrappedV2Document(document)) throw new Error("Only v2 is supported now");
    const documentData = getData(document);
    const deferredVerificationStatus: Promise<VerificationFragment>[] = documentData.issuers.map((issuer) => {
      if (issuer.identityProof?.type === "DNS-DID") return verifyIssuerDnsDid(issuer.identityProof);
      return Promise.resolve({
        status: "SKIPPED",
      });
    });
    const verificationStatus = await Promise.all(deferredVerificationStatus);
    const overallStatus =
      verificationStatus.some((status) => status.status === "VALID") &&
      verificationStatus.every((status) => status.status === "VALID" || status.status === "SKIPPED")
        ? "VALID"
        : "INVALID";
    return {
      name,
      type,
      data: verificationStatus,
      status: overallStatus,
    };
  } catch (e) {
    return {
      name,
      type,
      data: e,
      reason: {
        message: e.message,
        code: e.code || OpenAttestationDnsDidCode.UNEXPECTED_ERROR,
        codeString: e.codeString || OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNEXPECTED_ERROR],
      },
      status: "ERROR",
    };
  }
};

export const OpenAttestationDnsDid: VerifierType = {
  skip,
  test,
  verify,
};
