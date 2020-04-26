import { openAttestationW3CDIDProof } from "./openAttestationW3CDIDProof";
import { documentRopstenValidWithDIDSignedProofBlock } from "../../../test/fixtures/v2/documentRopstenValidWithDIDSignedProofBlock";

describe("openAttestationW3CDIDProof", () => {
  // TODO create a verifier and call it to test this => check dns verifier test
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
        data: {
          "@context": "https://w3id.org/did/v1",
          id: "did:ethr:ropsten:0xd130e6b130D9E940a724f894b316E79F9e58C648",
          authentication: [
            {
              type: "Secp256k1SignatureAuthentication2018",
              publicKey: ["did:ethr:ropsten:0xd130e6b130D9E940a724f894b316E79F9e58C648#owner"]
            }
          ],
          publicKey: [
            {
              id: "did:ethr:ropsten:0xd130e6b130D9E940a724f894b316E79F9e58C648#owner",
              type: "Secp256k1VerificationKey2018",
              ethereumAddress: "0xd130e6b130d9e940a724f894b316e79f9e58c648",
              owner: "did:ethr:ropsten:0xd130e6b130D9E940a724f894b316E79F9e58C648"
            }
          ]
        },
        status: "VALID"
      });
    });
    it("should return an invalid fragment when document has an invalid proof signature", async () => {
      const fragment = await openAttestationW3CDIDProof.verify(
        {
          ...documentRopstenValidWithDIDSignedProofBlock,
          proof: {
            ...documentRopstenValidWithDIDSignedProofBlock.proof,
            signature:
              "0x0004f62545319df30ce9722ff8ee5f9ab66ae365a5ff99dd1ef620200425201c6ed87e95b20728b60f0dad54f0e87eafef6e257f29de4f055db0ac95b8143b1e1b"
          }
        },
        {
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
    it("should return an invalid fragment when document proof uses an unsupported authentication method (did-method)", async () => {
      const fragment = await openAttestationW3CDIDProof.verify(
        {
          ...documentRopstenValidWithDIDSignedProofBlock,
          proof: {
            ...documentRopstenValidWithDIDSignedProofBlock.proof,
            verificationMethod: "did:sov:WRfXPg8dantKVubE3HX8pw"
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        data: new Error("Issuer DID cannot be authenticated, no supported auth in didDoc."),
        reason: {
          code: 2,
          codeString: "DOCUMENT_PROOF_ERROR",
          message: "Issuer DID cannot be authenticated, no supported auth in didDoc."
        },
        status: "ERROR"
      });
    });
    it("should return an invalid fragment when document proof uses an unsupported proof type", async () => {
      const type = "notSupported";
      const fragment = await openAttestationW3CDIDProof.verify(
        {
          ...documentRopstenValidWithDIDSignedProofBlock,
          proof: {
            ...documentRopstenValidWithDIDSignedProofBlock.proof,
            type
          }
        },
        {
          network: "ropsten"
        }
      );
      expect(fragment).toStrictEqual({
        name: "openAttestationW3CDIDProof",
        type: "DOCUMENT_STATUS",
        data: new Error(`Proof type: ${type} is not supported.`),
        reason: {
          code: 2,
          codeString: "DOCUMENT_PROOF_ERROR",
          message: `Proof type: ${type} is not supported.`
        },
        status: "ERROR"
      });
    });
  });
});
