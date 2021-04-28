import { getData, utils, v2, v3 } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier, VerifierOptions } from "../../../types/core";
import { OpenAttestationDidCode } from "../../../types/error";
import {
  DidVerificationStatusArray,
  InvalidDidVerificationStatus,
  ValidDidVerificationStatus,
  ValidDidVerificationStatusArray,
  verifySignature,
} from "../../../did/verifier";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";
import { OpenAttestationDidIdentityProofVerificationFragment } from "./didIdentityProof.type";

const name = "OpenAttestationDidIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";

type VerifierType = Verifier<OpenAttestationDidIdentityProofVerificationFragment>;

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
  } else if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.identityProof.type === v3.IdentityProofType.Did;
  }
  return false;
};

const verifyV2 = async (
  document: v2.WrappedDocument,
  options: VerifierOptions
): Promise<OpenAttestationDidIdentityProofVerificationFragment> => {
  if (!utils.isSignedWrappedV2Document(document))
    throw new CodedError("Document is not signed", OpenAttestationDidCode.UNSIGNED, "UNSIGNED");
  const data = getData(document);
  const merkleRoot = `0x${document.signature.merkleRoot}`;
  const signatureVerificationDeferred = data.issuers.map(async (issuer) => {
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
      if (!correspondingProof)
        throw new CodedError(
          `No proof for ${key}`,
          OpenAttestationDidCode.MALFORMED_IDENTITY_PROOF,
          "MALFORMED_IDENTITY_PROOF"
        );

      return verifySignature({
        merkleRoot,
        key,
        signature: correspondingProof.signature,
        did,
        resolver: options.resolver,
      });
    }
    throw new CodedError(
      "Issuer is not using DID identityProof type",
      OpenAttestationDidCode.INVALID_ISSUERS,
      OpenAttestationDidCode[OpenAttestationDidCode.INVALID_ISSUERS]
    );
  });
  const signatureVerifications: DidVerificationStatusArray = await Promise.all(signatureVerificationDeferred);

  if (ValidDidVerificationStatusArray.guard(signatureVerifications)) {
    return {
      name,
      type,
      data: signatureVerifications,
      status: "VALID",
    };
  }

  const invalidSignature = signatureVerifications.find(InvalidDidVerificationStatus.guard);
  if (InvalidDidVerificationStatus.guard(invalidSignature)) {
    return {
      name,
      type,
      data: signatureVerifications,
      reason: invalidSignature.reason,
      status: "INVALID",
    };
  }
  throw new CodedError(
    "Unable to retrieve the reason of the failure",
    OpenAttestationDidCode.UNEXPECTED_ERROR,
    "UNEXPECTED_ERROR"
  );
};

const verifyV3 = async (
  document: v3.WrappedDocument,
  options: VerifierOptions
): Promise<OpenAttestationDidIdentityProofVerificationFragment> => {
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

  if (ValidDidVerificationStatus.guard(verificationStatus)) {
    return {
      name,
      type,
      data: verificationStatus,
      status: "VALID",
    };
  }
  return {
    name,
    type,
    data: verificationStatus,
    reason: verificationStatus.reason,
    status: "INVALID",
  };
};

const verify: VerifierType["verify"] = async (document, options) => {
  if (utils.isWrappedV2Document(document)) return verifyV2(document, options);
  else if (utils.isWrappedV3Document(document)) return verifyV3(document, options);
  throw new CodedError(
    "Document does not match either v2 or v3 formats. Consider using `utils.diagnose` from open-attestation to find out more.",
    OpenAttestationDidCode.UNRECOGNIZED_DOCUMENT,
    OpenAttestationDidCode[OpenAttestationDidCode.UNRECOGNIZED_DOCUMENT]
  );
};

export const openAttestationDidIdentityProof: VerifierType = {
  skip,
  test,
  verify: withCodedErrorHandler(verify, {
    name,
    type,
    unexpectedErrorCode: OpenAttestationDidCode.UNEXPECTED_ERROR,
    unexpectedErrorString: OpenAttestationDidCode[OpenAttestationDidCode.UNEXPECTED_ERROR],
  }),
};
