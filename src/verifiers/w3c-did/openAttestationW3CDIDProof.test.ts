import { openAttestationW3CDIDProof } from "./openAttestationW3CDIDProof";
import { documentRopstenValidWithDIDSignedProofBlock } from "../../../test/fixtures/v2/documentRopstenValidWithDIDSignedProofBlock";
import { documentRopstenInvalidProofType } from "../../../test/fixtures/v2/documentRopstenInvalidProofType";
import { documentRopstenInvalidProofSignature } from "../../../test/fixtures/v2/documentRopstenInvalidProofSignature";

describe("openAttestationW3CDIDProof", () => {
  describe("test", () => {
    it("should return true when v2 document has a proof block", () => {
      const test = openAttestationW3CDIDProof.test(documentRopstenValidWithDIDSignedProofBlock, {
        network: "ropsten"
      });
      expect(test).toStrictEqual(true);
    });
  });
  describe("v2", () => {
    it("should return a valid fragment when document has valid signed proof", async () => {
      const fragment = await openAttestationW3CDIDProof.verify(documentRopstenValidWithDIDSignedProofBlock, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        status: "VALID"
      });
    });
    it("should return an invalid fragment when document has an invalid proof signature", async () => {
      const fragment = await openAttestationW3CDIDProof.verify(documentRopstenInvalidProofSignature, {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        reason: {
          code: 1,
          codeString: "DOCUMENT_PROOF_INVALID",
          message: "Certificate proof is invalid"
        },
        status: "INVALID"
      });
    });
    it("should return an invalid fragment when document proof uses an unsupported proof type", async () => {
      const fragment = await openAttestationW3CDIDProof.verify(documentRopstenInvalidProofType,
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        data: new Error(`Proof type: notSupported is not supported.`),
        reason: {
          code: 2,
          codeString: "DOCUMENT_PROOF_ERROR",
          message: `Proof type: notSupported is not supported.`
        },
        status: "ERROR"
      });
    });
  });
});
