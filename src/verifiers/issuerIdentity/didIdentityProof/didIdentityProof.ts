import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidIdentityProofCode } from "../../../types/error";
import { verifySignature } from "../../../did/verifier";

const name = "OpenAttestationDidSignedDidIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDidIdentityProofCode.SKIPPED,
      codeString: OpenAttestationDidIdentityProofCode[OpenAttestationDidIdentityProofCode.SKIPPED],
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

const verify: VerifierType["verify"] = async (document) => {
  try {
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
      return { status: "SKIPPED" };
    });
    const signatureVerifications = await Promise.all(signatureVerificationDeferred);
    const signedOnAll =
      signatureVerifications.some((i) => i.status === "VALID") &&
      signatureVerifications.every((i) => i.status === "VALID" || i.status === "SKIPPED");

    return {
      name,
      type,
      data: signatureVerifications,
      status: signedOnAll ? "VALID" : "INVALID",
    };
  } catch (e) {
    return {
      name,
      type,
      data: e,
      reason: {
        message: e.message,
        code: OpenAttestationDidIdentityProofCode.UNEXPECTED_ERROR,
        codeString:
          OpenAttestationDidIdentityProofCode[OpenAttestationDidIdentityProofCode.UNEXPECTED_ERROR],
      },
      status: "ERROR",
    };
  }
};

export const OpenAttestationDidSignedDidIdentityProof: VerifierType = {
  skip,
  test,
  verify,
};
