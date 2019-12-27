import { verifySignature } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../types/core";

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
        message: "Certificate has been tampered with",
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
