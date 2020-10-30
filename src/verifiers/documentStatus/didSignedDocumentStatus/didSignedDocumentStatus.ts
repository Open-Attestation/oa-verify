import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidSignedDocumentStatusCode } from "../../../types/error";
import { verifySignature, DidVerificationStatus } from "../../../did/verifier";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";

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

const test: VerifierType["test"] = (document) => {
  if (!utils.isSignedWrappedV2Document(document)) return false;
  if (document.proof.some((proof) => proof.type === "OpenAttestationSignature2018")) return true;
  return false;
};

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document) => {
    if (!utils.isSignedWrappedV2Document(document)) throw new Error("Only signed v2 is supported now");
    const data = getData(document);
    const merkleRoot = `0x${document.signature.merkleRoot}`;
    data.issuers.forEach((issuer) => {
      if (!(issuer.identityProof?.type === "DID" || issuer.identityProof?.type === "DNS-DID"))
        throw new CodedError(
          "All issuers must use DID or DNS-DID identityProof type.",
          OpenAttestationDidSignedDocumentStatusCode.INVALID_ISSUERS,
          OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.INVALID_ISSUERS]
        );
    });
    const { issuers } = data;

    // If revocation block does not exist, throw error to prevent case where revocation method is revoked
    const revocation: (v2.Revocation | undefined)[] = issuers.map((issuer) => issuer.revocation);
    if (revocation.some((r) => typeof r?.type === "undefined"))
      throw new CodedError(
        "revocation block not found for an issuer",
        OpenAttestationDidSignedDocumentStatusCode.MISSING_REVOCATION,
        "MISSING_REVOCATION"
      );

    // Support for the NONE method only
    const revokedOnAny = !revocation.every((r) => r?.type === "NONE");

    // Check that all the issuers have signed on the document
    if (!document.proof)
      throw new CodedError(
        "Document is not signed. Proofs are missing.",
        OpenAttestationDidSignedDocumentStatusCode.UNSIGNED,
        "UNSIGNED"
      );
    const signatureVerificationDeferred: Promise<DidVerificationStatus>[] = issuers.map((issuer) =>
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
  },
  {
    name,
    type,
    unexpectedErrorCode: OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR,
    unexpectedErrorString:
      OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR],
  }
);

export const OpenAttestationDidSignedDocumentStatus: VerifierType = {
  skip,
  test,
  verify,
};
