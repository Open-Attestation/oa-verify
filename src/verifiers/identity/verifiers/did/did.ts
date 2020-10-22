import { getData, utils } from "@govtechsg/open-attestation";
import { OpenAttestationDidSignedDidIdentityProofCode } from "../../../../types/error";
import { verifySignature } from "../../../../did/verifier";
import { CodedError } from "../../../../common/error";
import { IssuerIdentityVerifier } from "../../builder";
import { codedErrorResponse } from "../../utils/codedErrorResponse";

const verifier = "OpenAttestationDidSignedDidIdentityProof";

const unexpectedErrorHandler = codedErrorResponse({
  verifier,
  unexpectedErrorCode: OpenAttestationDidSignedDidIdentityProofCode.UNEXPECTED_ERROR,
});

export const verify: IssuerIdentityVerifier = async ({ document, issuerIndex }) => {
  try {
    if (!utils.isSignedWrappedV2Document(document))
      throw new CodedError(
        "Only v2 is supported now",
        OpenAttestationDidSignedDidIdentityProofCode.UNSUPPORTED,
        "UNSUPPORTED"
      );
    const merkleRoot = `0x${document.signature.merkleRoot}`;
    if (typeof issuerIndex === "undefined") throw new Error("issuerIndex undefined for V2 document");
    const issuer = getData(document).issuers[issuerIndex];
    if (!document.proof)
      throw new CodedError(
        "`proof` is missing from document",
        OpenAttestationDidSignedDidIdentityProofCode.MALFORMED_DOCUMENT,
        "MALFORMED_DOCUMENT"
      );
    const { did, verified } = await verifySignature({
      merkleRoot,
      identityProof: issuer.identityProof,
      proof: document.proof,
      did: issuer.id,
    });
    return { verifier, identifier: did, status: verified ? "VALID" : "INVALID" };
  } catch (e) {
    return unexpectedErrorHandler(e);
  }
};

export const OpenAttestationDidSignedDidIdentityProof = {
  verify,
};
