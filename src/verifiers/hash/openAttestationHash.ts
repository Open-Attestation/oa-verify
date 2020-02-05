import { verifySignature } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../types/core";
import { OpenAttestationHashCode } from "../../types/error";

const name = "OpenAttestationHash";
const type: VerificationFragmentType = "DOCUMENT_INTEGRITY";
export const openAttestationHash: Verifier = {
  skip: () => {
    throw new Error("This verifier is never skipped");
  },
  test: () => true,
  verify: async document => {
    const hash = await verifySignature(document);
    if (!hash) {
      return {
        type,
        name,
        data: hash,
        reason: {
          code: OpenAttestationHashCode.DOCUMENT_TAMPERED,
          codeString: OpenAttestationHashCode[OpenAttestationHashCode.DOCUMENT_TAMPERED],
          message: "Certificate has been tampered with"
        },
        status: "INVALID"
      };
    }
    return {
      type,
      name,
      data: hash,
      status: "VALID"
    };
  }
};
