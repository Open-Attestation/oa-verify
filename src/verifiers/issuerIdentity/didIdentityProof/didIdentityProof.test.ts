import { OpenAttestationDidSignedDidIdentityProof } from "./didIdentityProof";

describe("skip", () => {
  it("should return skip message", () => {});
});

describe("test", () => {
  describe("v2", () => {
    it("should return false for documents not using DID as top level identifier", () => {});
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {});
    it("should return true for documents where any issuer is using the `DNS-CONTRACT` identity proof", () => {});
  });
  describe("v3", () => {
    it("should return false for documents not using DID as top level identifier", () => {});
    it("should return true for documents where any issuer is using the `DID` identity proof", () => {});
    it("should return true for documents where any issuer is using the `DNS-CONTRACT` identity proof", () => {});
  });
});

describe("verify", () => {
  describe("v2", () => {
    it("should pass for documents using `DID` and did signature is correct", () => {});
    it("should pass for documents using `DID-CONTRACT` and documentStore is correctly signed", () => {});
    it("should fail for documents using `DID` and did signature is not correct", () => {});
    it("should fail for documents using `DID-CONTRACT` and documentStore is incorrectly signed", () => {});
  });
  describe("v3", () => {
    it("should pass for documents using `DID` and did signature is correct", () => {});
    it("should pass for documents using `DID-CONTRACT` and documentStore is correctly signed", () => {});
    it("should fail for documents using `DID` and did signature is not correct", () => {});
    it("should fail for documents using `DID-CONTRACT` and documentStore is incorrectly signed", () => {});
  });
});
