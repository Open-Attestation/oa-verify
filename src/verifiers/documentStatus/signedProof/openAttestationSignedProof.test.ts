import { verificationBuilder } from "../../verificationBuilder";
import { openAttestationSignedProof } from "./openAttestationSignedProof";
import { documentSignedProofValid } from "../../../../test/fixtures/v2/documentSignedProofValid";
import { documentSignedProofInvalidProofType } from "../../../../test/fixtures/v2/documentSignedProofInvalidProofType";
import { documentSignedProofInvalidSignature } from "../../../../test/fixtures/v2/documentSignedProofInvalidSignature";
import { documentMainnetValidWithCertificateStore } from "../../../../test/fixtures/v2/documentMainnetValidWithCertificateStore";

const verify = verificationBuilder([openAttestationSignedProof]);

describe("OpenAttestationSignedProof", () => {
  describe("SKIPPED", () => {
    it("should return a valid SKIPPED fragment when document does not have a proof a block", async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore error is valid, inoring for test purpose
      const fragment = await verify(documentMainnetValidWithCertificateStore, {
        network: "ropsten",
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationSignedProof",
          type: "DOCUMENT_STATUS",
          reason: {
            code: 4,
            codeString: "SKIPPED",
            message: "Document does not have a proof block",
          },
          status: "SKIPPED",
        },
      ]);
    });
  });
  describe("v2", () => {
    it("should return a valid fragment when document has valid signed proof", async () => {
      const fragment = await verify(documentSignedProofValid, {
        network: "ropsten",
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationSignedProof",
          type: "DOCUMENT_STATUS",
          status: "VALID",
        },
      ]);
    });
    it("should return an invalid fragment when document has an invalid proof signature", async () => {
      const fragment = await verify(documentSignedProofInvalidSignature, {
        network: "ropsten",
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationSignedProof",
          type: "DOCUMENT_STATUS",
          reason: {
            code: 1,
            codeString: "DOCUMENT_PROOF_INVALID",
            message: "Document proof is invalid",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return an invalid fragment when document proof uses an unsupported proof type", async () => {
      const fragment = await verify(documentSignedProofInvalidProofType, {
        network: "ropsten",
      });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationSignedProof",
          type: "DOCUMENT_STATUS",
          data: new Error(`Proof type: notSupported is not supported.`),
          reason: {
            code: 2,
            codeString: "DOCUMENT_PROOF_ERROR",
            message: `Proof type: notSupported is not supported.`,
          },
          status: "ERROR",
        },
      ]);
    });
  });
});
