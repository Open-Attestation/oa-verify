import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidCode } from "../../../types/error";
import { verifySignature } from "../../../did/verifier";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";

const name = "OpenAttestationDidIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDidCode.SKIPPED,
      codeString: OpenAttestationDidCode[OpenAttestationDidCode.SKIPPED],
      message: `Document is not using DID as top level identifier`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  if (!utils.isWrappedV2Document(document)) return false;
  const { issuers } = getData(document);
  return issuers.some((issuer) => issuer.identityProof?.type === "DID");
};

interface SignatureVerificationFragment {
  status: string;
  did?: string;
}

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document) => {
    if (!utils.isSignedWrappedV2Document(document)) throw new Error("Only v2 is supported now");
    const data = getData(document);
    const merkleRoot = `0x${document.signature.merkleRoot}`;
    const signatureVerificationDeferred: Promise<SignatureVerificationFragment>[] = data.issuers.map(async (issuer) => {
      if (issuer.identityProof?.type === "DID") {
        const did = issuer.id;
        if (!did) throw new CodedError("id is missing in issuer", OpenAttestationDidCode.DID_MISSING, "DID_MISSING");
        const key = issuer.identityProof?.key;
        if (!key)
          throw new CodedError(
            "Key is not present",
            OpenAttestationDidCode.MALFORMED_IDENTITY_PROOF,
            "MALFORMED_IDENTITY_PROOF"
          );
        const correspondingProof = document.proof.find((p) => p.verificationMethod.toLowerCase() === key.toLowerCase());
        if (!correspondingProof) return { status: "INVALID", reason: "`id` is missing from issuer" };

        const { verified } = await verifySignature({
          merkleRoot,
          key,
          signature: correspondingProof.signature,
          did,
        });
        return { did, status: verified ? "VALID" : "INVALID" };
      }
      throw new CodedError(
        "Issuer is not using DID identityProof type",
        OpenAttestationDidCode.INVALID_ISSUERS,
        OpenAttestationDidCode[OpenAttestationDidCode.INVALID_ISSUERS]
      );
    });
    const signatureVerifications = await Promise.all(signatureVerificationDeferred);
    const signedOnAll =
      signatureVerifications.some((i) => i.status === "VALID") &&
      signatureVerifications.every((i) => i.status === "VALID");

    return {
      name,
      type,
      data: signatureVerifications,
      status: signedOnAll ? "VALID" : "INVALID",
    };
  },
  {
    name,
    type,
    unexpectedErrorCode: OpenAttestationDidCode.UNEXPECTED_ERROR,
    unexpectedErrorString: OpenAttestationDidCode[OpenAttestationDidCode.UNEXPECTED_ERROR],
  }
);

export const openAttestationDidIdentityProof: VerifierType = {
  skip,
  test,
  verify,
};
