import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { getDnsDidRecords } from "@govtechsg/dnsprove";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDnsDidCode } from "../../../types/error";

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
  if (!utils.isWrappedV2Document(document)) return false;
  const data = getData(document); // TODO casting to any first before OA is updated
  if (data?.issuers.some((issuer: any) => issuer.identityProof?.type === "DNS-DID")) return true;
  return false;
};

interface IdentityProof {
  type: string;
  key: string;
  location: string;
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
  const records = await getDnsDidRecords(location);
  return {
    location,
    key,
    status: records.some((record) => record.publicKey.toLowerCase() === key.toLowerCase()) ? "VALID" : "INVALID",
  };
};

const verify: VerifierType["verify"] = async (document) => {
  try {
    if (!utils.isWrappedV2Document(document)) throw new Error("Only v2 is supported now");
    // TODO fix the OA schema
    const documentData = getData(document) as any;
    const deferredVerificationStatus: Promise<VerificationFragment>[] = documentData.issuers.map((issuer: any) => {
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
        code: OpenAttestationDnsDidCode.UNEXPECTED_ERROR,
        codeString: OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.UNEXPECTED_ERROR],
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
