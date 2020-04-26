import * as ethers from "ethers";
import { v2, WrappedDocumentWithProof } from "@govtechsg/open-attestation";
import { resolveDID } from "./resolveDID";
import { Verifier } from "../../types/core";
import { PublicKey, Authentication } from "../../types/w3c-did";
import { SUPPORTED_DID_AUTH, ETHR_DID_METHOD, SUPPORTED_PROOF_TYPES } from "../../config";
import { OpenAttestationDocumentSignedCode } from "../../types/error";

const name = "openAttestationW3CDIDProof";
const type = "DOCUMENT_STATUS";

export const openAttestationW3CDIDProof: Verifier<WrappedDocumentWithProof<v2.OpenAttestationDocument>> = {
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
      const { proof, signature } = document;
      const didDoc = await resolveDID(proof.verificationMethod);

      // Confirm this type of proof is currently supported
      if (!SUPPORTED_PROOF_TYPES.includes(proof.type)) throw new Error(`Proof type: ${proof.type} is not supported.`);

      // If the didDoc has an auth method we currently support
      const supportedAuth = didDoc?.authentication?.filter((auth: Authentication) =>
        SUPPORTED_DID_AUTH.includes(auth.type)
      );
      if (!supportedAuth?.length) throw new Error("Issuer DID cannot be authenticated, no supported auth in didDoc.");

      // Get the correct pub key from the ver method
      const pubKey: any = didDoc.publicKey.find(key => key.id === proof.verificationMethod);
      // The exact verification may vary based on did-method (did:<method>:<namespace uuid>)
      const didMethod = proof.verificationMethod.split(":")[1];
      let proofValid = false;
      if (didMethod === ETHR_DID_METHOD) {
        // Existing targetHash is being signed
        const msg = signature.targetHash;
        const { ethereumAddress } = pubKey;
        const recoverAddress = ethers.utils.verifyMessage(msg, proof.signature);
        proofValid = recoverAddress?.toLowerCase() === ethereumAddress?.toLowerCase();
      } else {
        throw new Error(`${didMethod} is currently not supported...`);
      }
      if (proofValid) {
        const data = didDoc;
        const status = "VALID";
        return { name, type, data, status };
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
