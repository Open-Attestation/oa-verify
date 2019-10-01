/**
 * @jest-environment node
 */

import verify from "./index";
import { documentMainnetValid } from "../test/fixtures/documentMainnetValid";
import { documentTampered } from "../test/fixtures/tampered-document";
import { documentRopstenValid } from "../test/fixtures/documentRopstenValid";
import { tokenRopstenValid } from "../test/fixtures/tokenRopstenValid";
import { tokenRopstenInvalid } from "../test/fixtures/tokenRopstenInvalid";

describe("verify(integration)", () => {
  it("returns false if document is invalid", async () => {
    const results = await verify(documentTampered, "ropsten");

    expect(results).toEqual(
      expect.objectContaining({
        hash: { checksumMatch: false },
        issued: {
          issuedOnAll: false,
          details: [
            {
              address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
              error: expect.stringMatching("exception"),
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
      })
    );
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

    expect(results).toEqual(
      expect.objectContaining({
        hash: { checksumMatch: true },
        issued: {
          issuedOnAll: false,
          details: [
            {
              address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
              error: expect.stringMatching("revert"),
              issued: false
            }
          ]
        },
        revoked: {
          revokedOnAny: true,
          details: [
            {
              address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
              error: expect.stringMatching("revert"),
              revoked: true
            }
          ]
        },
        valid: false
      })
    );
  });
});
