import { verify } from "./dnsTxt";
import { documentRopstenValidWithToken } from "../../../../../test/fixtures/v2/documentRopstenValidWithToken";
import { documentDidSigned } from "../../../../../test/fixtures/v2/documentDidSigned";

const options = { network: "ropsten" };

describe("verify (v2)", () => {
  it("should fail when data is malformed", async () => {
    const verificationFragment = await verify({
      document: { ...documentRopstenValidWithToken, data: undefined as any },
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "reason": Object {
          "code": 0,
          "codeString": "UNEXPECTED_ERROR",
          "message": "Cannot read property 'issuers' of undefined",
        },
        "status": "ERROR",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should pass with valid issuer (token registry)", async () => {
    const verificationFragment = await verify({
      document: documentRopstenValidWithToken,
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "smartContractAddress": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
        },
        "identifier": "example.tradetrust.io",
        "status": "VALID",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should pass with valid issuer (document store)", async () => {
    const verificationFragment = await verify({
      document: {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              documentStore: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: {
                type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
                location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io",
              },
            },
          ],
        },
      },
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "smartContractAddress": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
        },
        "identifier": "example.tradetrust.io",
        "status": "VALID",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should pass with valid issuer (certificate store)", async () => {
    const verificationFragment = await verify({
      document: {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              certificateStore:
                "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: {
                type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
                location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io",
              },
            },
          ],
        },
      },
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "smartContractAddress": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
        },
        "identifier": "example.tradetrust.io",
        "status": "VALID",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should fail when smart contract is not found on DNS", async () => {
    const verificationFragment = await verify({
      document: {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              ...documentRopstenValidWithToken.data.issuers[0],
              tokenRegistry: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xabcd",
            },
          ],
        },
      },
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "smartContractAddress": "0xabcd",
        },
        "identifier": "example.tradetrust.io",
        "status": "INVALID",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should fail when location is missing from identityProof", async () => {
    const verificationFragment = await verify({
      document: {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              ...documentRopstenValidWithToken.data.issuers[0],
              identityProof: {
                type: "DNS-TXT",
                location: undefined as any,
              },
            },
          ],
        },
      },
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "reason": Object {
          "code": 0,
          "codeString": "UNEXPECTED_ERROR",
          "message": "Location is missing",
        },
        "status": "ERROR",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should fail when identityProof is missing", async () => {
    const verificationFragment = await verify({
      document: {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              tokenRegistry: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: undefined,
            },
          ],
        },
      },
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "reason": Object {
          "code": 0,
          "codeString": "UNEXPECTED_ERROR",
          "message": "Identity type not supported",
        },
        "status": "ERROR",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should fail for other types of identifier", async () => {
    const verificationFragment = await verify({
      document: documentDidSigned,
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "reason": Object {
          "code": 0,
          "codeString": "UNEXPECTED_ERROR",
          "message": "Identity type not supported",
        },
        "status": "ERROR",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });
});
