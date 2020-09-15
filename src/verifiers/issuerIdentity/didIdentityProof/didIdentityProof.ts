import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidSignedDidIdentityProofCode } from "../../../types/error";
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
      code: OpenAttestationDidSignedDidIdentityProofCode.SKIPPED,
      codeString: OpenAttestationDidSignedDidIdentityProofCode[OpenAttestationDidSignedDidIdentityProofCode.SKIPPED],
      message: `Document is not using DID as top level identifier`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  if (!utils.isWrappedV2Document(document)) return false;
  const { issuers } = getData(document) as any; // TODO Casting to any first to prevent change at the OA level
  if (issuers.some((issuer: any) => issuer.identityProof?.type === "DID")) return true;
  return false;
};

interface SignatureVerificationFragment {
  status: "VALID" | "INVALID" | "SKIPPED";
  did?: string;
}

const verify: VerifierType["verify"] = async (_document) => {
  try {
    if (!utils.isWrappedV2Document(_document)) throw new Error("Only v2 is supported now");
    const document = _document as any; // TODO Casting to any first to prevent change at the OA level
    const data: any = getData(document);
    const merkleRoot = `0x${document.signature.merkleRoot}`;
    const signatureVerificationDeferred: Promise<SignatureVerificationFragment>[] = data.issuers.map(
      async (issuer: any) => {
        if (issuer.identityProof.type === "DID" || issuer.identityProof.type === "DNS-DID") {
          const { did, verified } = await verifySignature({
            merkleRoot,
            identityProof: issuer.identityProof,
            proof: document.proof,
            did: issuer.id,
          });
          return { did, status: verified ? "VALID" : "INVALID" };
        }
        return { status: "SKIPPED" };
      }
    );
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
        code: OpenAttestationDidSignedDidIdentityProofCode.UNEXPECTED_ERROR,
        codeString:
          OpenAttestationDidSignedDidIdentityProofCode[OpenAttestationDidSignedDidIdentityProofCode.UNEXPECTED_ERROR],
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
