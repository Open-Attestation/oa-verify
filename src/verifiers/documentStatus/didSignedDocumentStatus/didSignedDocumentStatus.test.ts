import { OpenAttestationDidSignedDocumentStatus } from "./didSignedDocumentStatus";

describe("skip", () => {
  it("should return skip message", () => {});
});

describe("test", () => {
  describe("v2", () => {
    it("should return false for documents not signed by DID", () => {});
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {});
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {});
  });
  describe("v3", () => {
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
  describe("v3", () => {
    it("should pass for documents using `DID` and is correctly signed", () => {});
    it("should pass for documents using `DID-DNS` and is correctly signed", () => {});
    it("should fail for documents using `DID` and is incorrectly signed", () => {});
    it("should fail for documents using `DID-DNS` and is incorrectly signed", () => {});
  });
});
