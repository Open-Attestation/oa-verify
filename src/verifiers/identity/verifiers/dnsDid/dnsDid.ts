import { getData, utils } from "@govtechsg/open-attestation";
import { getDnsDidRecords } from "@govtechsg/dnsprove";
import { OpenAttestationDnsDidCode } from "../../../../types/error";
import { VerifierResults, IssuerIdentityVerifier } from "../../builder";
import { CodedError } from "../../../../common/error";
import { codedErrorResponse } from "../../utils/codedErrorResponse";

const verifier = "OpenAttestationDnsDidIdentityProof";

interface IdentityProof {
  type: string;
  key?: string;
  location?: string;
}

const unexpectedErrorHandler = codedErrorResponse({
  verifier,
  unexpectedErrorCode: OpenAttestationDnsDidCode.UNEXPECTED_ERROR,
});

const verifyIssuerDnsDid = async ({ key, location, type: identityType }: IdentityProof): Promise<VerifierResults> => {
  if (identityType !== "DNS-DID")
    throw new CodedError(
      "identity proof type must be DNS-DID",
      OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF,
      "MALFORMED_IDENTITY_PROOF"
    );
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
    verifier,
    identifier: location,
    data: { key },
    status: records.some((record) => record.publicKey.toLowerCase() === key.toLowerCase()) ? "VALID" : "INVALID",
  };
};

export const verify: IssuerIdentityVerifier = async ({ document, issuerIndex }) => {
  try {
    if (!utils.isWrappedV2Document(document))
      throw new CodedError("Only v2 is supported now", OpenAttestationDnsDidCode.UNSUPPORTED, "UNSUPPORTED");
    if (typeof issuerIndex === "undefined") throw new Error("issuerIndex undefined for V2 document");
    const issuer = getData(document).issuers[issuerIndex];
    if (!issuer.identityProof)
      return {
        verifier,
        status: "ERROR",
        reason: {
          code: OpenAttestationDnsDidCode.MALFORMED_IDENTITY_PROOF,
          codeString: "MALFORMED_IDENTITY_PROOF",
          message: "Identity proof is not present",
        },
      };
    const status = await verifyIssuerDnsDid(issuer.identityProof);
    return status;
  } catch (e) {
    return unexpectedErrorHandler(e);
  }
};

export const OpenAttestationDnsDid = {
  type: "DNS-DID",
  verify,
};
