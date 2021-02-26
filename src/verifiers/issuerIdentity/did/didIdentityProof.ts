import { v2, v3, WrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier, VerificationFragment, VerifierOptions } from "../../../types/core";
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
      message: `Document is not using DID as top level identifier or has not been wrapped`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  if (utils.isWrappedV2Document(document)) {
    const { issuers } = getData(document);
    return issuers.some((issuer) => issuer.identityProof?.type === v2.IdentityProofType.Did);
  }
  if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.identityProof.type === v3.IdentityProofType.Did;
  }
  return false;
};

interface SignatureVerificationFragment {
  status: string;
  did?: string;
}

const verifyV2 = async (document: v2.WrappedDocument, options: VerifierOptions): Promise<VerificationFragment> => {
  if (!utils.isSignedWrappedV2Document(document))
    throw new CodedError("Document is not signed", OpenAttestationDidCode.UNSIGNED, "UNSIGNED");
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
        resolver: options.resolver,
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
};

const verifyV3 = async (document: v3.WrappedDocument, options: VerifierOptions): Promise<VerificationFragment> => {
  if (!utils.isSignedWrappedV3Document(document))
    throw new CodedError("Document is not signed", OpenAttestationDidCode.UNSIGNED, "UNSIGNED");

  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const { key, signature } = document.proof;
  const did = document.openAttestationMetadata.identityProof.identifier;

  const verificationStatus = await verifySignature({
    did,
    merkleRoot,
    key,
    signature,
    resolver: options.resolver,
  });

  return {
    name,
    type,
    data: verificationStatus,
    status: verificationStatus.verified ? "VALID" : "INVALID",
  };
};

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document, options) => {
    if (utils.isWrappedV2Document(document)) return verifyV2(document, options);
    if (utils.isWrappedV3Document(document)) return verifyV3(document, options);
    throw new CodedError(
      "Document does not match either v2 or v3 formats",
      OpenAttestationDidCode.UNRECOGNIZED_DOCUMENT,
      OpenAttestationDidCode[OpenAttestationDidCode.UNRECOGNIZED_DOCUMENT]
    );
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
