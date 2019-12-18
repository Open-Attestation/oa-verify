import { verifyHash } from "./hash";
import { document } from "../../test/fixtures/v2/document";
import { documentTampered } from "../../test/fixtures/v2/tampered-document";

describe("verify/hash", () => {
  describe("verifyHash", () => {
    it("should return true for untampered document", async () => {
      expect(await verifyHash(document)).toEqual({ checksumMatch: true });
    });
    it("should return false for tampered document", async () => {
      expect(await verifyHash(documentTampered)).toEqual({
        checksumMatch: false
      });
    });
  });
});
