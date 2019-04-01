const verify = require("./index");

const certificateValid = require("../test/fixtures/certificateMainnetValid.json");
const certificateTampered = require("../test/fixtures/tampered-certificate.json");

describe("verify(integration)", () => {
  it("returns false if certificate is invalid", async () => {
    const results = await verify(certificateTampered);

    expect(results).to.be.eql({
      hash: { valid: false },
      identity: {
        valid: false,
        identities: {
          "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990": undefined
        }
      },
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
  }).timeout(5000);

  it("returns true if certificate is valid", async () => {
    const results = await verify(certificateValid);

    expect(results).to.be.eql({
      hash: { valid: true },
      identity: {
        valid: true,
        identities: {
          "0x007d40224f6562461633ccfbaffd359ebb2fc9ba":
            "Government Technology Agency of Singapore (GovTech)"
        }
      },
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
  }).timeout(5000);
});
