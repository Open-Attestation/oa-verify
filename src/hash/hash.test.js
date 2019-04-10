const { verifyHash } = require("./hash");
const certificate = require("../../test/fixtures/certificate.json");
const certificateTampered = require("../../test/fixtures/tampered-certificate.json");

describe("verify/hash", () => {
  describe("verifyHash", () => {
    it("should return true for untampered certificate", () => {
      expect(verifyHash(certificate)).toEqual({ valid: true });
    });
    it("should return false for tampered certificate", () => {
      expect(verifyHash(certificateTampered)).toEqual({ valid: false });
    });
  });
});
