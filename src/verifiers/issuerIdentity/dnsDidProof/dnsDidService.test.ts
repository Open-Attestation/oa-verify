import { getDnsDidRecords } from "./dnsDidService";

describe("getDnsDidRecords", () => {
  it("should return records if found", async () => {
    const records = await getDnsDidRecords("example.tradetrust.io");
    expect(records).toMatchInlineSnapshot(`
      Array [
        Object {
          "algorithm": "dns-did",
          "publicKey": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          "version": "1.0",
        },
      ]
    `);
  });

  it("should return zero records if found", async () => {
    const records = await getDnsDidRecords("tradetrust.io");
    expect(records).toMatchInlineSnapshot(`Array []`);
  });
});
