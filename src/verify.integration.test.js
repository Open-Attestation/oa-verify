/**
 * @jest-environment node
 */

const verify = require("./index");

const documentMainnetValid = require("../test/fixtures/documentMainnetValid.json");
const documentTampered = require("../test/fixtures/tampered-document.json");
const documentRopstenValid = require("../test/fixtures/documentRopstenValid.json");
const tokenRopstenValid = require("../test/fixtures/tokenRopstenValid.json");
const tokenRopstenInvalid = require("../test/fixtures/tokenRopstenInvalid.json");

describe("verify(integration)", () => {
  it("returns false if document is invalid", async () => {
    const results = await verify(documentTampered, "ropsten");

    expect(results).toEqual({
      hash: { checksumMatch: false },
      issued: {
        issuedOnAll: false,
        details: [
          {
            address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
            error:
              'call exception (address="0x20bc9C354A18C8178A713B9BcCFFaC2152b53990", method="isIssued(bytes32)", args=["0x85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b"], version=4.0.37)',
            issued: false
          }
        ]
      },
      revoked: {
        revokedOnAny: false,
        details: [
          {
            address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
            revoked: false
          }
        ]
      },
      valid: false
    });
  });

  it("returns true if Mainnet document is valid", async () => {
    const results = await verify(documentMainnetValid);

    expect(results).toEqual({
      hash: { checksumMatch: true },
      issued: {
        issuedOnAll: true,
        details: [
          {
            address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
            issued: true
          }
        ]
      },
      revoked: {
        revokedOnAny: false,
        details: [
          {
            address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
            revoked: false
          }
        ]
      },
      valid: true
    });
  });

  it("returns true if Ropsten document is valid", async () => {
    const results = await verify(documentRopstenValid, "ropsten");

    expect(results).toEqual({
      hash: { checksumMatch: true },
      issued: {
        issuedOnAll: true,
        details: [
          {
            address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
            issued: true
          }
        ]
      },
      revoked: {
        revokedOnAny: false,
        details: [
          {
            address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
            revoked: false
          }
        ]
      },
      valid: true
    });
  });

  it("returns true if Ropsten token is valid", async () => {
    const results = await verify(tokenRopstenValid, "ropsten");

    expect(results).toEqual({
      hash: { checksumMatch: true },
      issued: {
        issuedOnAll: true,
        details: [
          {
            address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
            issued: true
          }
        ]
      },
      revoked: {
        revokedOnAny: false,
        details: [
          {
            address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
            revoked: false
          }
        ]
      },
      valid: true
    });
  });

  it("returns false if Ropsten token is invalid", async () => {
    const results = await verify(tokenRopstenInvalid, "ropsten");

    expect(results).toEqual({
      hash: { checksumMatch: true },
      issued: {
        issuedOnAll: false,
        details: [
          {
            address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
            error:
              'call revert exception (address="0x48399Fb88bcD031C556F53e93F690EEC07963Af3", args=["0x1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef"], method="ownerOf(uint256)", errorSignature="Error(string)", errorArgs=[["ERC721: owner query for nonexistent token"]], reason=["ERC721: owner query for nonexistent token"], transaction={"to":{},"data":"0x6352211e1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef"}, version=4.0.37)',
            issued: false
          }
        ]
      },
      revoked: {
        revokedOnAny: true,
        details: [
          {
            address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
            error:
              'call revert exception (address="0x48399Fb88bcD031C556F53e93F690EEC07963Af3", args=["0x1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef"], method="ownerOf(uint256)", errorSignature="Error(string)", errorArgs=[["ERC721: owner query for nonexistent token"]], reason=["ERC721: owner query for nonexistent token"], transaction={"to":{},"data":"0x6352211e1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef"}, version=4.0.37)',
            revoked: true
          }
        ]
      },
      valid: false
    });
  });
});
