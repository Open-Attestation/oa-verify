import { utils, verifySignature } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationHashCode } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { OpenAttestationHashVerificationFragment } from "./openAttestationHash.type";

const name = "OpenAttestationHash";
const type: VerificationFragmentType = "DOCUMENT_INTEGRITY";

type VerifierType = Verifier<OpenAttestationHashVerificationFragment>;

const skip: VerifierType["skip"] = () => {
  return Promise.resolve({
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationHashCode.SKIPPED,
      codeString: OpenAttestationHashCode[OpenAttestationHashCode.SKIPPED],
      message: `Document does not have merkle root, target hash or data.`,
    },
  });
};

// Check if document isWrappedDocument (regardless of V2 or V3) - isWrappedV3Document/isWrappedV2Document
// Has to have merkle root and target hash and data
const test: VerifierType["test"] = (document) => {
  return utils.isWrappedV3Document(document) || utils.isWrappedV2Document(document);
};

// Verify that the signature is correct - verifySignature
const verify: VerifierType["verify"] = async (document) => {
  const hash = await verifySignature(document);
  if (!hash) {
    return {
      type,
      name,
      data: hash,
      reason: {
        code: OpenAttestationHashCode.DOCUMENT_TAMPERED,
        codeString: OpenAttestationHashCode[OpenAttestationHashCode.DOCUMENT_TAMPERED],
        message: "Document has been tampered with",
      },
      status: "INVALID" as const,
    };
  }
  return {
    type,
    name,
    data: hash,
    status: "VALID" as const,
  };
};

// Checks if document structure is valid and if document is signed properly
export const openAttestationHash: VerifierType = {
  skip,
  test,
  verify: withCodedErrorHandler(verify, {
    name,
    type,
    unexpectedErrorCode: OpenAttestationHashCode.UNEXPECTED_ERROR,
    unexpectedErrorString: OpenAttestationHashCode[OpenAttestationHashCode.UNEXPECTED_ERROR],
  }),
};
