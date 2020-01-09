import { openAttestationW3CDID } from "./openAttestationW3CDID";
import { documentRopstenValidWithIssuerDID } from "../../test/fixtures/v3/documentRopstenValidWithIssuerDID";

/**
 * Note tests are quite slow due to external service reliance / internet connectivity.
 * Interaction with public universal resolver and eth networks currently required.
 * @todo
 *  - local units / mock out requests
 */
jest.setTimeout(30000);

describe("OpenAttestationW3CDID verify v3 VALID document", () => {
  it("should return a valid fragment when document has valid identity using W3CDID on ropsten", async () => {
    const fragment = await openAttestationW3CDID.verify(documentRopstenValidWithIssuerDID, {
      network: "ropsten"
    });

    expect(fragment.type).toStrictEqual("ISSUER_IDENTITY");
    expect(fragment.name).toStrictEqual("OpenAttestationW3CDID");
    expect(fragment.status).toStrictEqual("VALID");
    expect(fragment.data).toStrictEqual({
      "@context": "https://w3id.org/did/v1",
      id: "did:ethr:ropsten:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
      authentication: [
        {
          type: "Secp256k1SignatureAuthentication2018",
          publicKey: ["did:ethr:ropsten:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#owner"]
        }
      ],
      publicKey: [
        {
          id: "did:ethr:ropsten:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#owner",
          type: "Secp256k1VerificationKey2018",
          ethereumAddress: "0xb26b4941941c51a4885e5b7d3a1b861e54405f90",
          owner: "did:ethr:ropsten:0xB26B4941941C51a4885E5B7D3A1B861E54405f90"
        }
      ]
    });
  });
});
describe("OpenAttestationW3CDID verify v3 ERROR document", () => {
  it("should return an error fragment when document DID does not match the issuer account", async () => {
    const fragment = await openAttestationW3CDID.verify(
      {
        ...documentRopstenValidWithIssuerDID,
        data: {
          ...documentRopstenValidWithIssuerDID.data,
          issuer: {
            ...documentRopstenValidWithIssuerDID.data.issuer,
            identityProof: {
              ...documentRopstenValidWithIssuerDID.data.issuer.identityProof,
              location:
                "1d337929-6770-4a05-ace0-1f07c25c7615:string:did:ethr:ropsten:0xB26B4941941C51a4885E5B7D3A1B861E54400000"
            }
          }
        }
      },
      {
        network: "ropsten"
      }
    );

    const errorMsg = "this DID does not appear to have issued the document";
    expect(fragment.type).toStrictEqual("ISSUER_IDENTITY");
    expect(fragment.name).toStrictEqual("OpenAttestationW3CDID");
    expect(fragment.status).toStrictEqual("ERROR");
    expect(String(fragment.data)).toContain(errorMsg);
  });
  it("should return an error fragment when document has not been issued", async () => {
    const fragment = await openAttestationW3CDID.verify(
      {
        ...documentRopstenValidWithIssuerDID,
        signature: {
          ...documentRopstenValidWithIssuerDID.signature,
          merkleRoot: "00000288dfdb20e7f9a62329adf1f3ad8eed0345a2c517ee7af3e9e88d02a5cd"
        }
      },
      {
        network: "ropsten"
      }
    );

    const errorMsg = "Document has not been issued...";
    expect(fragment.type).toStrictEqual("ISSUER_IDENTITY");
    expect(fragment.name).toStrictEqual("OpenAttestationW3CDID");
    expect(fragment.status).toStrictEqual("ERROR");
    expect(String(fragment.data)).toContain(errorMsg);
  });
  it("should return an error fragment when no supported auth in didDoc, unsupported did-auth", async () => {
    const fragment = await openAttestationW3CDID.verify(
      {
        ...documentRopstenValidWithIssuerDID,
        data: {
          ...documentRopstenValidWithIssuerDID.data,
          issuer: {
            ...documentRopstenValidWithIssuerDID.data.issuer,
            identityProof: {
              ...documentRopstenValidWithIssuerDID.data.issuer.identityProof,
              // Change to sov did-method
              location: "1d337929-6770-4a05-ace0-1f07c25c7615:string:did:sov:WRfXPg8dantKVubE3HX8pw"
            }
          }
        }
      },
      {
        network: "ropsten"
      }
    );

    const errorMsg = "Issuer DID cannot be authenticated, no supported auth in didDoc";
    expect(fragment.type).toStrictEqual("ISSUER_IDENTITY");
    expect(fragment.name).toStrictEqual("OpenAttestationW3CDID");
    expect(fragment.status).toStrictEqual("ERROR");
    expect(String(fragment.data)).toContain(errorMsg);
    expect(String(fragment.message)).toContain(errorMsg);
  });
  it("should return an error fragment when an unrecognized did-method presented, returning a 404 from the uni resolver", async () => {
    const fragment = await openAttestationW3CDID.verify(
      {
        ...documentRopstenValidWithIssuerDID,
        data: {
          ...documentRopstenValidWithIssuerDID.data,
          issuer: {
            ...documentRopstenValidWithIssuerDID.data.issuer,
            identityProof: {
              ...documentRopstenValidWithIssuerDID.data.issuer.identityProof,
              // Change to sov did-method
              location: "1d337929-6770-4a05-ace0-1f07c25c7615:string:did:nodidmethod:1234"
            }
          }
        }
      },
      {
        network: "ropsten"
      }
    );

    const errorMsg = "404";
    expect(fragment.type).toStrictEqual("ISSUER_IDENTITY");
    expect(fragment.name).toStrictEqual("OpenAttestationW3CDID");
    expect(fragment.status).toStrictEqual("ERROR");
    expect(String(fragment.data)).toContain(errorMsg);
    expect(String(fragment.message)).toContain(errorMsg);
  });
  it("should return an error fragment when a malformed, using hyphens, did presented, returning a 500 currently from uni resolver", async () => {
    const fragment = await openAttestationW3CDID.verify(
      {
        ...documentRopstenValidWithIssuerDID,
        data: {
          ...documentRopstenValidWithIssuerDID.data,
          issuer: {
            ...documentRopstenValidWithIssuerDID.data.issuer,
            identityProof: {
              ...documentRopstenValidWithIssuerDID.data.issuer.identityProof,
              location: "1d337929-6770-4a05-ace0-1f07c25c7615:string:did-hyphens-ethr-0x1234"
            }
          }
        }
      },
      {
        network: "ropsten"
      }
    );

    const errorMsg = "500";
    expect(fragment.type).toStrictEqual("ISSUER_IDENTITY");
    expect(fragment.name).toStrictEqual("OpenAttestationW3CDID");
    expect(fragment.status).toStrictEqual("ERROR");
    expect(String(fragment.data)).toContain(errorMsg);
    expect(String(fragment.message)).toContain(errorMsg);
  });
  it("should return an error fragment when a malformed, random string, did presented, returning a 500 currently from uni resolver", async () => {
    const fragment = await openAttestationW3CDID.verify(
      {
        ...documentRopstenValidWithIssuerDID,
        data: {
          ...documentRopstenValidWithIssuerDID.data,
          issuer: {
            ...documentRopstenValidWithIssuerDID.data.issuer,
            identityProof: {
              ...documentRopstenValidWithIssuerDID.data.issuer.identityProof,
              location: "1d337929-6770-4a05-ace0-1f07c25c7615:string:didhyphensethr0x1234"
            }
          }
        }
      },
      {
        network: "ropsten"
      }
    );

    const errorMsg = "500";
    expect(fragment.type).toStrictEqual("ISSUER_IDENTITY");
    expect(fragment.name).toStrictEqual("OpenAttestationW3CDID");
    expect(fragment.status).toStrictEqual("ERROR");
    expect(String(fragment.data)).toContain(errorMsg);
    expect(String(fragment.message)).toContain(errorMsg);
  });
  it("should return an error fragment when an empty did presented, returning a 404 from uni resolver", async () => {
    const fragment = await openAttestationW3CDID.verify(
      {
        ...documentRopstenValidWithIssuerDID,
        data: {
          ...documentRopstenValidWithIssuerDID.data,
          issuer: {
            ...documentRopstenValidWithIssuerDID.data.issuer,
            identityProof: {
              ...documentRopstenValidWithIssuerDID.data.issuer.identityProof,
              location: "1d337929-6770-4a05-ace0-1f07c25c7615:string:"
            }
          }
        }
      },
      {
        network: "ropsten"
      }
    );

    const errorMsg = "404";
    expect(fragment.type).toStrictEqual("ISSUER_IDENTITY");
    expect(fragment.name).toStrictEqual("OpenAttestationW3CDID");
    expect(fragment.status).toStrictEqual("ERROR");
    expect(String(fragment.data)).toContain(errorMsg);
    expect(String(fragment.message)).toContain(errorMsg);
  });
});
describe("OpenAttestationW3CDID test v3 VALID document", () => {
  it("should return true if identityProof type is W3C-DID", () => {
    expect(
      openAttestationW3CDID.test(documentRopstenValidWithIssuerDID, {
        network: "ropsten"
      })
    ).toStrictEqual(true);
  });
});
describe("OpenAttestationW3CDID test v3 INVALID document", () => {
  it("should return false if identityProof type is not W3C-DID", () => {
    const document = {
      ...documentRopstenValidWithIssuerDID,
      data: {
        ...documentRopstenValidWithIssuerDID.data,
        issuer: {
          ...documentRopstenValidWithIssuerDID.data.issuer,
          identityProof: {
            ...documentRopstenValidWithIssuerDID.data.issuer.identityProof,
            type: "whatever"
          }
        }
      }
    };
    expect(
      openAttestationW3CDID.test(document, {
        network: "ropsten"
      })
    ).toStrictEqual(false);
  });
});
