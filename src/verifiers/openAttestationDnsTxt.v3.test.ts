import { openAttestationDnsTxt } from "./openAttestationDnsTxt";
import { documentRopstenValidWithDocumentStore } from "../../test/fixtures/v3/documentRopstenValid";

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
              location: "1d337929-6770-4a05-ace0-1f07c25c7615:string:example.openattestation.com"
            }
          }
        }
      },
      {
        network: "ropsten"
      }
    );
    expect(fragment).toStrictEqual({
      type: "ISSUER_IDENTITY",
      name: "OpenAttestationDnsTxt",
      data: {
        dns: "example.openattestation.com",
        identified: true,
        smartContract: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3"
      },
      status: "VALID"
    });
  });
  it("should return an invalid fragment when document identity does not match", async () => {
    const fragment = await openAttestationDnsTxt.verify(documentRopstenValidWithDocumentStore, {
      network: "ropsten"
    });
    expect(fragment).toStrictEqual({
      type: "ISSUER_IDENTITY",
      name: "OpenAttestationDnsTxt",
      data: { location: "some.io", value: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3", type: "DNS-TXT" },
      message: "Certificate issuer identity is invalid",
      status: "INVALID"
    });
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
            type: null
          }
        }
      }
    };
    // @ts-ignore valid error, need to ignore
    const fragment = await openAttestationDnsTxt.verify(document, {
      network: "ropsten"
    });
    expect(fragment).toStrictEqual({
      type: "ISSUER_IDENTITY",
      name: "OpenAttestationDnsTxt",
      data: new Error("Identity type not supported"),
      message: "Identity type not supported",
      status: "ERROR"
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
            location: null
          }
        }
      }
    };
    // @ts-ignore valid error, need to ignore
    const fragment = await openAttestationDnsTxt.verify(document, {
      network: "ropsten"
    });
    expect(fragment).toStrictEqual({
      type: "ISSUER_IDENTITY",
      name: "OpenAttestationDnsTxt",
      data: new Error("Location is missing"),
      message: "Location is missing",
      status: "ERROR"
    });
  });

  describe("test", () => {
    it("should return true if identityProof type is DNS-TXT", () => {
      expect(
        openAttestationDnsTxt.test(documentRopstenValidWithDocumentStore, {
          network: "ropsten"
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
              type: "whatever"
            }
          }
        }
      };
      expect(
        openAttestationDnsTxt.test(document, {
          network: "ropsten"
        })
      ).toStrictEqual(false);
    });
  });
});
