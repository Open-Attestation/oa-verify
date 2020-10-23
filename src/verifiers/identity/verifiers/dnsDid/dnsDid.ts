import { getData, utils } from "@govtechsg/open-attestation";
import { getDnsDidRecords } from "@govtechsg/dnsprove";
import { OpenAttestationDnsDidIdentityProofCode } from "../../../../types/error";
import { VerifierResults, IssuerIdentityVerifier, IssuerIdentityVerifierDefinition } from "../../../../types/core";
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
  unexpectedErrorCode: OpenAttestationDnsDidIdentityProofCode.UNEXPECTED_ERROR,
});

const verifyIssuerDnsDid = async ({ key, location, type: identityType }: IdentityProof): Promise<VerifierResults> => {
  if (identityType !== "DNS-DID")
    throw new CodedError(
      "identity proof type must be DNS-DID",
      OpenAttestationDnsDidIdentityProofCode.MALFORMED_IDENTITY_PROOF,
      "MALFORMED_IDENTITY_PROOF"
    );
  if (!location)
    throw new CodedError(
      "location is not present in identity proof",
      OpenAttestationDnsDidIdentityProofCode.MALFORMED_IDENTITY_PROOF,
      "MALFORMED_IDENTITY_PROOF"
    );
  if (!key)
    throw new CodedError(
      "key is not present in identity proof",
      OpenAttestationDnsDidIdentityProofCode.MALFORMED_IDENTITY_PROOF,
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
      throw new CodedError(
        "Only v2 is supported now",
        OpenAttestationDnsDidIdentityProofCode.UNSUPPORTED,
        "UNSUPPORTED"
      );
    if (typeof issuerIndex === "undefined") throw new Error("issuerIndex undefined for V2 document");
    const issuer = getData(document).issuers[issuerIndex];
    if (!issuer.identityProof)
      return {
        verifier,
        status: "ERROR",
        reason: {
          code: OpenAttestationDnsDidIdentityProofCode.MALFORMED_IDENTITY_PROOF,
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

export const OpenAttestationDnsDidIdentityProof: IssuerIdentityVerifierDefinition = {
  type: "DNS-DID",
  verify,
};
