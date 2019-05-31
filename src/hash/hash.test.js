const { verifyHash } = require("./hash");
const document = require("../../test/fixtures/document.json");
const documentTampered = require("../../test/fixtures/tampered-document.json");

describe("verify/hash", () => {
  describe("verifyHash", () => {
    it("should return true for untampered document", () => {
      expect(verifyHash(document)).toEqual({ valid: true });
    });
    it("should return false for tampered document", () => {
      expect(verifyHash(documentTampered)).toEqual({ valid: false });
    });
  });
});
