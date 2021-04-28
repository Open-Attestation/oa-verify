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

const test: VerifierType["test"] = (document) => {
  return utils.isWrappedV3Document(document) || utils.isWrappedV2Document(document);
};

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
