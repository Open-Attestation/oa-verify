import { verifySignature, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationHashCode } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { doc } from "prettier";

const name = "OpenAttestationHash";
const type: VerificationFragmentType = "DOCUMENT_INTEGRITY";
export const openAttestationHash: Verifier = {
  skip: () => {
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
  },
  test: (document) => {
    if (utils.isWrappedV3Document(document)) {
      return true;
    }
    if (utils.isWrappedV2Document(document)) {
      return !!document?.signature?.merkleRoot && !!document?.signature?.targetHash && !!document.data;
    }
    return false;
  },
  verify: withCodedErrorHandler(
    async (document) => {
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
          status: "INVALID",
        };
      }
      return {
        type,
        name,
        data: hash,
        status: "VALID",
      };
    },
    {
      name,
      type,
      unexpectedErrorCode: OpenAttestationHashCode.UNEXPECTED_ERROR,
      unexpectedErrorString: OpenAttestationHashCode[OpenAttestationHashCode.UNEXPECTED_ERROR],
    }
  ),
};
