import { OpenAttestationDidSignedDocumentStatus } from "./didSignedDocumentStatus";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
// import { Wallet, utils } from "ethers";

// it("use for signing message", () => {
//   // key below is not used, don't freak out. Corresponds to 0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89
//   const priv = "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655";
//   const wallet = new Wallet(priv);
//   console.log(wallet.signMessage(utils.arrayify("0x69fe778652b6a94959bc16400440c3a3dae4ce744622430e705939fafb23d01f")));
// });

// TODO Temporarily passing in this option, until make the entire option optional in another PR
const options = {
  network: "ropsten",
};

describe("skip", () => {
  it("should return skip message", async () => {
    const message = await OpenAttestationDidSignedDocumentStatus.skip(undefined as any, undefined as any);
    expect(message).toEqual({
      status: "SKIPPED",
      type: "DOCUMENT_STATUS",
      name: "OpenAttestationDidSignedDocumentStatus",
      reason: {
        code: 0,
        codeString: "SKIPPED",
        message: "Document was not signed by DID directly",
      },
    });
  });
});

describe("test", () => {
  describe("v2", () => {
    it("should return false for documents not signed by DID", () => {
      expect(OpenAttestationDidSignedDocumentStatus.test(documentRopstenValidWithDocumentStore, options)).toBe(false);
      expect(OpenAttestationDidSignedDocumentStatus.test(documentRopstenNotIssuedWithTokenRegistry, options)).toBe(
        false
      );
    });
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {
      expect(OpenAttestationDidSignedDocumentStatus.test(documentDidSigned, options)).toBe(true);
    });
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {
      expect(OpenAttestationDidSignedDocumentStatus.test(documentDnsDidSigned, options)).toBe(true);
    });
  });
  describe.skip("v3", () => {
    it("should return false for documents not signed by DID", () => {});
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {});
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {});
  });
});

describe("verify", () => {
  describe("v2", () => {
    it("should pass for documents using `DID` and is correctly signed", async () => {
      const res = await OpenAttestationDidSignedDocumentStatus.verify(documentDidSigned, options);
      expect(res).toEqual({
        name: "OpenAttestationDidSignedDocumentStatus",
        type: "DOCUMENT_STATUS",
        data: {
          issuedOnAll: true,
          revokedOnAny: false,
          details: { issuance: [{ did: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89", issued: true }] },
        },
        status: "VALID",
      });
    });
    it("should pass for documents using `DID-DNS` and is correctly signed", async () => {
      const res = await OpenAttestationDidSignedDocumentStatus.verify(documentDnsDidSigned, options);
      expect(res).toEqual({
        name: "OpenAttestationDidSignedDocumentStatus",
        type: "DOCUMENT_STATUS",
        data: {
          issuedOnAll: true,
          revokedOnAny: false,
          details: { issuance: [{ did: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89", issued: true }] },
        },
        status: "VALID",
      });
    });
    it("should fail when revocation block is missing", () => {});
    it("should fail when key does not match did", () => {});
    it("should fail when revocation is not set to NONE (for now)", () => {});
    it("should fail when proof is missing", () => {});
    it("should fail when did resolver fails for some reasons", () => {});
    it("should fail when corresponding proof to key is not found in proof", () => {});
  });
});
