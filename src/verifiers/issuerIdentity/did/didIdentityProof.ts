import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidCode } from "../../../types/error";
import { verifySignature } from "../../../did/verifier";
import { withCodedErrorHandler } from "../../../common/errorHandler";

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
        if (!document.proof) return { status: "INVALID", reason: "`proof` is missing from the document" };
        const { did, verified } = await verifySignature({
          merkleRoot,
          identityProof: issuer.identityProof,
          proof: document.proof,
          did: issuer.id,
        });
        return { did, status: verified ? "VALID" : "INVALID" };
      }
      return {
        status: "INVALID",
        reason: {
          message: "Issuer is not using DID identityProof type",
          code: OpenAttestationDidCode.INVALID_ISSUERS,
          codeString: OpenAttestationDidCode[OpenAttestationDidCode.INVALID_ISSUERS],
        },
      };
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
