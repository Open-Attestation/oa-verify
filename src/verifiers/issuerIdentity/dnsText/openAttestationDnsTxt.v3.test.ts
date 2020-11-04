import { openAttestationDnsTxt } from "./openAttestationDnsTxt";
import { documentRopstenValidWithDocumentStore } from "../../../../test/fixtures/v3/documentRopstenValid";

describe("OpenAttestationDnsTxt v3 document", () => {
  it("should return a valid fragment when document has valid identity", async () => {
    const fragment = await openAttestationDnsTxt.verify(
      {
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
      {
        network: "ropsten",
      }
    );
    expect(fragment).toMatchInlineSnapshot(`
      Object {
        "location": "example.openattestation.com",
        "name": "OpenAttestationDnsTxt",
        "status": "VALID",
        "type": "ISSUER_IDENTITY",
        "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
      }
    `);
  });
  it("should return an invalid fragment when document identity does not match", async () => {
    const fragment = await openAttestationDnsTxt.verify(documentRopstenValidWithDocumentStore, {
      network: "ropsten",
    });
    expect(fragment).toMatchInlineSnapshot(`
      Object {
        "location": "some.io",
        "name": "OpenAttestationDnsTxt",
        "reason": Object {
          "code": 4,
          "codeString": "MATCHING_RECORD_NOT_FOUND",
          "message": "Matching DNS record not found for 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        },
        "status": "INVALID",
        "type": "ISSUER_IDENTITY",
        "value": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
      }
    `);
  });
  it("should return an error fragment when document has no identity type", async () => {
    const document = {
      ...documentRopstenValidWithDocumentStore,
      data: {
        ...documentRopstenValidWithDocumentStore.data,
        issuer: {
          ...documentRopstenValidWithDocumentStore.data.issuer,
          identityProof: {
            ...documentRopstenValidWithDocumentStore.data.issuer.identityProof,
            type: null,
          },
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore valid error, need to ignore
    const fragment = await openAttestationDnsTxt.verify(document, {
      network: "ropsten",
    });
    expect(fragment).toStrictEqual({
      type: "ISSUER_IDENTITY",
      name: "OpenAttestationDnsTxt",
      data: new Error("Identity type not supported"),
      reason: {
        code: 0,
        codeString: "UNEXPECTED_ERROR",
        message: "Identity type not supported",
      },
      status: "ERROR",
    });
  });
  it("should return an error fragment when document has no identity location", async () => {
    const document = {
      ...documentRopstenValidWithDocumentStore,
      data: {
        ...documentRopstenValidWithDocumentStore.data,
        issuer: {
          ...documentRopstenValidWithDocumentStore.data.issuer,
          identityProof: {
            ...documentRopstenValidWithDocumentStore.data.issuer.identityProof,
            location: null,
          },
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore valid error, need to ignore
    const fragment = await openAttestationDnsTxt.verify(document, {
      network: "ropsten",
    });
    expect(fragment).toStrictEqual({
      type: "ISSUER_IDENTITY",
      name: "OpenAttestationDnsTxt",
      data: new Error("Location is missing"),
      reason: {
        code: 0,
        codeString: "UNEXPECTED_ERROR",
        message: "Location is missing",
      },
      status: "ERROR",
    });
  });

  describe("test", () => {
    it("should return true if identityProof type is DNS-TXT", () => {
      expect(
        openAttestationDnsTxt.test(documentRopstenValidWithDocumentStore, {
          network: "ropsten",
        })
      ).toStrictEqual(true);
    });
    it("should return false if identityProof type is not DNS-TXT", () => {
      const document = {
        ...documentRopstenValidWithDocumentStore,
        data: {
          ...documentRopstenValidWithDocumentStore.data,
          issuer: {
            ...documentRopstenValidWithDocumentStore.data.issuer,
            identityProof: {
              ...documentRopstenValidWithDocumentStore.data.issuer.identityProof,
              type: "whatever",
            },
          },
        },
      };
      expect(
        openAttestationDnsTxt.test(document, {
          network: "ropsten",
        })
      ).toStrictEqual(false);
    });
  });
});
