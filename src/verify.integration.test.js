/**
 * @jest-environment node
 */

const verify = require("./index");

const documentMainnetValid = require("../test/fixtures/documentMainnetValid.json");
const documentTampered = require("../test/fixtures/tampered-document.json");
const documentRopstenValid = require("../test/fixtures/documentRopstenValid.json");

describe("verify(integration)", () => {
  it("returns false if document is invalid", async () => {
    const results = await verify(documentTampered);

    expect(results).toEqual({
      hash: { valid: false },
      issued: {
        valid: false,
        issued: { "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990": false }
      },
      revoked: {
        valid: false,
        revoked: { "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990": true }
      },
      valid: false
    });
  });

  it("returns true if Mainnet document is valid", async () => {
    const results = await verify(documentMainnetValid);

    expect(results).toEqual({
      hash: { valid: true },
      issued: {
        valid: true,
        issued: { "0x007d40224f6562461633ccfbaffd359ebb2fc9ba": true }
      },
      revoked: {
        valid: true,
        revoked: { "0x007d40224f6562461633ccfbaffd359ebb2fc9ba": false }
      },
      valid: true
    });
  });

  it("returns true if Ropsten document is valid", async () => {
    const results = await verify(documentRopstenValid, "ropsten");

    expect(results).toEqual({
      hash: { valid: true },
      issued: {
        valid: true,
        issued: { "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495": true }
      },
      revoked: {
        valid: true,
        revoked: { "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495": false }
      },
      valid: true
    });
  });
});
