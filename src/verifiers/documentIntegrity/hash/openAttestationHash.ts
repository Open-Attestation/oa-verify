import { verifySignature } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationHashCode } from "../../../types/error";

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
    return !!document?.signature?.merkleRoot && !!document?.signature?.targetHash && !!document.data;
  },
  verify: async (document) => {
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
};
