import { OpenAttestationDidSignedDocumentStatus } from "./didSignedDocumentStatus";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidSigned } from "../../../../test/fixtures/v2/documentDnsDidSigned";
import { documentRopstenNotIssuedWithTokenRegistry } from "../../../../test/fixtures/v2/documentRopstenNotIssuedWithTokenRegistry";
import { getData, sign } from "@govtechsg/open-attestation";
import { Wallet, utils } from "ethers";

// const pub = "0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89";
// const priv = "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655";
// const signature =
//   "0xc2d684525e4e6230a5488a120f78e1246fb4e526366120352f6d57e474fff9d67693d6389cc7e7d829a3e0923cfa69730f2541599fdb0f04e5213e3e28ddfaf21b";
// const wallet = new Wallet(priv);

// // Specific for Secp256k1VerificationKey2018
// const verifySignature = (message: string, signature: string, signingAddress: string) => {
//   const messageBytes = utils.arrayify(message);
//   return utils.verifyMessage(messageBytes, signature).toLowerCase() === signingAddress.toLowerCase();
// };

// describe("verifySignature", () => {
//   it("should return true for correctly signed message", async () => {
//     const wallet = Wallet.createRandom();
//     const { address } = wallet;
//     const message = "0x9f9118b68d1e0311987b2f7f6c382dd623e25d6ee2c20eec5e0963fe631e234c";
//     const signature = await wallet.signMessage(utils.arrayify(message));
//     const verified = await verifySignature(message, signature, address);
//     expect(verified).toBe(true);
//   });
//   it("should return false for incorrectly signed message", async () => {
//     const message = "0x9f9118b68d1e0311987b2f7f6c382dd623e25d6ee2c20eec5e0963fe631e234c";
//     const address = "0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89";
//     const signature =
//       "0xc2d684525e4e6230a5488a120f78e1246fb4e526366120352f6d57e474fff9d67693d6389cc7e7d829a3e0923cfa69730f2541599fdb0f04e5213e3e28ddfaf21c";
//     const verified = await verifySignature(message, signature, address);
//     expect(verified).toBe(false);
//   });
// });

// it("works", () => {
//   // console.log(JSON.stringify(getData(documentRopstenValidWithDocumentStore), null, 2));
//   // wallet.signMessage(utils.arrayify("0x"))
//   // console.log(wallet.signMessage(utils.arrayify("0x9f9118b68d1e0311987b2f7f6c382dd623e25d6ee2c20eec5e0963fe631e234c")));
//   console.log(
//     utils.verifyMessage(utils.arrayify("0x9f9118b68d1e0311987b2f7f6c382dd623e25d6ee2c20eec5e0963fe631e234c"), signature)
//   );
// });

// Temporarily passing in this option, until make the entire option optional in another PR
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
    it("should pass for documents using `DID` and is correctly signed", () => {});
    it("should pass for documents using `DID-DNS` and is correctly signed", () => {});
    it("should fail for documents using `DID` and is incorrectly signed", () => {});
    it("should fail for documents using `DID-DNS` and is incorrectly signed", () => {});
  });
  describe.skip("v3", () => {
    it("should pass for documents using `DID` and is correctly signed", () => {});
    it("should pass for documents using `DID-DNS` and is correctly signed", () => {});
    it("should fail for documents using `DID` and is incorrectly signed", () => {});
    it("should fail for documents using `DID-DNS` and is incorrectly signed", () => {});
  });
});
