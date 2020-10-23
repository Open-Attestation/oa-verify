import { verify } from "./dnsTxt";
import { documentRopstenValidWithDocumentStore } from "../../../../../test/fixtures/v3/documentRopstenValid";

const options = { network: "ropsten" };

describe("verify (v3)", () => {
  it("should be valid when document has valid issuer", async () => {
    const verificationFragment = await verify({
      document: {
        ...documentRopstenValidWithDocumentStore,
        data: {
          ...documentRopstenValidWithDocumentStore.data,
          issuer: {
            ...documentRopstenValidWithDocumentStore.data.issuer,
            identityProof: {
              ...documentRopstenValidWithDocumentStore.data.issuer.identityProof,
              location: "1d337929-6770-4a05-ace0-1f07c25c7615:string:example.openattestation.com",
            },
          },
        },
      },
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "smartContractAddress": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        },
        "identifier": "example.openattestation.com",
        "status": "VALID",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should return an invalid fragment when document identity does not match", async () => {
    const verificationFragment = await verify({
      document: documentRopstenValidWithDocumentStore,
      issuerIndex: 0,
      options,
    });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "smartContractAddress": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        },
        "identifier": "some.io",
        "status": "INVALID",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      }
    `);
  });

  it("should return an error fragment when document has no identity type", async () => {
    const verificationFragment = await verify({
      document: {
        ...documentRopstenValidWithDocumentStore,
        data: {
          ...documentRopstenValidWithDocumentStore.data,
          issuer: {
            ...documentRopstenValidWithDocumentStore.data.issuer,
            identityProof: {
              ...documentRopstenValidWithDocumentStore.data.issuer.identityProof,
              type: null as any,
            },
          },
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

  it("should return an error fragment when document has no identity location", async () => {
    const verificationFragment = await verify({
      document: {
        ...documentRopstenValidWithDocumentStore,
        data: {
          ...documentRopstenValidWithDocumentStore.data,
          issuer: {
            ...documentRopstenValidWithDocumentStore.data.issuer,
            identityProof: {
              ...documentRopstenValidWithDocumentStore.data.issuer.identityProof,
              location: null as any,
            },
          },
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
});
