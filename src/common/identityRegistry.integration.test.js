const { getIdentity } = require("./identityRegistry");

describe("identityRegistry(integration)", () => {
  describe("getIdentity", () => {
    it("returns identity if found", async () => {
      const res = await getIdentity(
        "0x007d40224f6562461633ccfbaffd359ebb2fc9ba"
      );
      expect(res).to.eql("Government Technology Agency of Singapore (GovTech)");
    });

    it("returns identity if found (in another case)", async () => {
      const res = await getIdentity(
        "0x007D40224f6562461633ccfbaffd359ebb2fc9bA"
      );
      expect(res).to.eql("Government Technology Agency of Singapore (GovTech)");
    });

    it("returns undefined if not found", async () => {
      const res = await getIdentity(
        "0x0000000000000000000000000000000000000000"
      );
      expect(res).to.eql(undefined);
    });
  });
});
