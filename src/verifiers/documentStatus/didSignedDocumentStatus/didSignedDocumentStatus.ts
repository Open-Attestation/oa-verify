import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidSignedDocumentStatusCode } from "../../../types/error";
import { verifySignature, DidVerificationStatus } from "../../../did/verifier";

const name = "OpenAttestationDidSignedDocumentStatus";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDidSignedDocumentStatusCode.SKIPPED,
      codeString: OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.SKIPPED],
      message: `Document was not signed by DID directly`,
    },
  };
};

const test: VerifierType["test"] = (_document) => {
  if (!utils.isWrappedV2Document(_document)) return false;
  const document = _document as any; // TODO Casting to any first to prevent change at the OA level
  if (
    document.proof &&
    Array.isArray(document.proof) && // TODO, remove when removing for proof block with one element
    document.proof.some((proof: any) => proof.type === "OpenAttestationSignature2018")
  )
    return true;
  return false;
};

interface Revocation {
  type: string;
}

const verify: VerifierType["verify"] = async (_document) => {
  try {
    if (!utils.isWrappedV2Document(_document)) throw new Error("Only v2 is supported now");
    const document = _document as any; // TODO Casting to any first to prevent change at the OA level
    const data: any = getData(document);
    const merkleRoot = `0x${document.signature.merkleRoot}`;
    const issuers = data.issuers.filter(
      (issuer: any) => issuer.identityProof.type === "DID" || issuer.identityProof.type === "DNS-DID"
    );

    // If revocation block does not exist, throw error to prevent case where revocation method is revoked
    const revocation: (Revocation | undefined)[] = issuers.map((issuer: any) => issuer.revocation);
    if (revocation.some((r) => typeof r?.type === "undefined"))
      throw new Error("revocation block not found for an issuer");
    // Support for the NONE method only
    const revokedOnAny = !revocation.every((r) => r?.type === "NONE");

    // Check that all the issuers have signed on the document
    if (!document.proof) throw new Error("Document is not signed. Proofs are missing.");
    const signatureVerificationDeferred: DidVerificationStatus[] = issuers.map((issuer: any) =>
      verifySignature({ merkleRoot, identityProof: issuer.identityProof, proof: document.proof, did: issuer.id })
    );
    const issuance = await (await Promise.all(signatureVerificationDeferred)).map(({ verified, reason, did }) => ({
      issued: verified,
      did,
      ...(reason && { reason }),
    }));
    const issuedOnAll = issuance.every((i) => i.issued);

    return {
      name,
      type,
      data: {
        issuedOnAll,
        revokedOnAny,
        details: {
          issuance,
        },
      },
      status: issuedOnAll && !revokedOnAny ? "VALID" : "INVALID",
    };
  } catch (e) {
    return {
      name,
      type,
      data: e,
      reason: {
        message: e.message,
        code: OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR,
        codeString:
          OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR],
      },
      status: "ERROR",
    };
  }
};

export const OpenAttestationDidSignedDocumentStatus: VerifierType = {
  skip,
  test,
  verify,
};
