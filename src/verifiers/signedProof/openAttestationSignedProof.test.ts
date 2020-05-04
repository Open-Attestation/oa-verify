import { verificationBuilder } from "../verificationBuilder";
import { openAttestationSignedProof } from "./openAttestationSignedProof";
import { documentSignedProofValid } from "../../../test/fixtures/v2/documentSignedProofValid";
import { documentSignedProofInvalidProofType } from "../../../test/fixtures/v2/documentSignedProofInvalidProofType";
import { documentSignedProofInvalidSignature } from "../../../test/fixtures/v2/documentSignedProofInvalidSignature";
const verify = verificationBuilder([openAttestationSignedProof]);

describe("OpenAttestationSignedProof", () => {
  describe("v2", () => {
    it("should return a valid fragment when document has valid signed proof", async () => {
      const fragment = await verify(documentSignedProofValid, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationSignedProof",
          type: "DOCUMENT_STATUS",
          status: "VALID"
        }
      ]);
    });
    it("should return an invalid fragment when document has an invalid proof signature", async () => {
      const fragment = await verify(documentSignedProofInvalidSignature, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationSignedProof",
          type: "DOCUMENT_STATUS",
          reason: {
            code: 1,
            codeString: "DOCUMENT_PROOF_INVALID",
            message: "Certificate proof is invalid"
          },
          status: "INVALID"
        }
      ]);
    });
    it("should return an invalid fragment when document proof uses an unsupported proof type", async () => {
      const fragment = await verify(documentSignedProofInvalidProofType, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationSignedProof",
          type: "DOCUMENT_STATUS",
          data: new Error(`Proof type: notSupported is not supported.`),
          reason: {
            code: 2,
            codeString: "DOCUMENT_PROOF_ERROR",
            message: `Proof type: notSupported is not supported.`
          },
          status: "ERROR"
        }
      ]);
    });
  });
});
