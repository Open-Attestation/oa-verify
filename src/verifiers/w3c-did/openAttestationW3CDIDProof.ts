import * as ethers from "ethers";
import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { Verifier } from "../../types/core";
import { OpenAttestationDocumentSignedCode } from "../../types/error";

const name = "openAttestationW3CDIDProof";
const type = "DOCUMENT_STATUS";

export const openAttestationW3CDIDProof: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
>  = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationDocumentSignedCode.SKIPPED,
        codeString: OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode.SKIPPED],
        message: `Document does not have a proof block`
      }
    });
  },
  test: document => {
    return Object.keys(document).includes("proof");
  },
  verify: async document => {
    try {
      if (!document.proof) throw new Error(`No proof was found in document.`); // Optional param, silence undefined type error
      // Note that proof.verificationMethod currently only supports a publicKey, no URLs ie. DIDs 
      const { proof, signature } = document;
      let proofValid = false;

      if (proof.type === "EcdsaSecp256k1Signature2019") {
        // Existing targetHash is being signed
        const msg = signature.targetHash;
        const recoverAddress = ethers.utils.verifyMessage(msg, proof.signature);
        proofValid = recoverAddress.toLowerCase() === proof.verificationMethod.toLowerCase();
      } else {
        throw new Error(`Proof type: ${proof.type} is not supported.`);
      }
      if (proofValid) {
        const status = "VALID";
        return { name, type, status };
      } else {
        const status = "INVALID";
        const message = "Certificate proof is invalid";
        const reason = {
          code: OpenAttestationDocumentSignedCode.DOCUMENT_PROOF_INVALID,
          codeString: OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode.DOCUMENT_PROOF_INVALID],
          message
        };
        return { name, type, status, reason };
      }
    } catch (e) {
      const data = e;
      const { message } = e;
      const status = "ERROR";
      const reason = {
        code: OpenAttestationDocumentSignedCode.DOCUMENT_PROOF_ERROR,
        codeString: OpenAttestationDocumentSignedCode[OpenAttestationDocumentSignedCode.DOCUMENT_PROOF_ERROR],
        message
      };
      return { name, type, data, reason, status };
    }
  }
};
