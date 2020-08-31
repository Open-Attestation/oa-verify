import { OpenAttestationDnsDid } from "./dnsDid";

describe("skip", () => {
  it("should return skip message", () => {});
});

describe("test", () => {
  describe("v2", () => {
    it("should return false for documents not using DNS as top level identifier with DID as intermediate identifier", () => {});
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {});
  });
  describe("v3", () => {
    it("should return false for documents not using DNS as top level identifier with DID as intermediate identifier", () => {});
    it("should return true for documents where any issuer is using the `DNS-DID` identity proof", () => {});
  });
});

describe("verify", () => {
  describe("v2", () => {
    it("should pass for documents using `DNS-DID` and both signature and dns claim is correct", () => {});
    it("should fail for documents using `DNS-DID` and did signature is not correct", () => {});
    it("should fail for documents using `DNS-DID` and dns does not have did entry", () => {});
  });
  describe("v3", () => {
    it("should pass for documents using `DNS-DID` and both signature and dns claim is correct", () => {});
    it("should fail for documents using `DNS-DID` and did signature is not correct", () => {});
    it("should fail for documents using `DNS-DID` and dns does not have did entry", () => {});
  });
});
