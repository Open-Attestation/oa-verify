import { openAttestationDnsTxt } from "./openAttestationDnsTxt";
import { documentRopstenValidWithToken } from "../../test/fixtures/v2/documentRopstenValidWithToken";

describe("OpenAttestationDnsTxt v2 document", () => {
  it("should return a valid fragment when document has valid identity", async () => {
    const fragment = await openAttestationDnsTxt.verify(documentRopstenValidWithToken, {
      network: "ropsten"
    });
    expect(fragment).toStrictEqual({
      type: "ISSUER_IDENTITY",
      name: "OpenAttestationDnsTxt",
      data: [
        {
          dns: "example.tradetrust.io",
          identified: true,
          smartContract: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
        }
      ],
      status: "VALID"
    });
  });
  it("should return an invalid fragment when document identity does not match", async () => {
    const document = {
      ...documentRopstenValidWithToken,
      data: {
        ...documentRopstenValidWithToken.data,
        issuers: [
          {
            ...documentRopstenValidWithToken.data.issuers[0],
            tokenRegistry: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xabcd"
          }
        ]
      }
    };
    const fragment = await openAttestationDnsTxt.verify(document, {
      network: "ropsten"
    });
    expect(fragment).toStrictEqual({
      type: "ISSUER_IDENTITY",
      name: "OpenAttestationDnsTxt",
      data: { location: "example.tradetrust.io", value: "0xabcd", type: "DNS-TXT" },
      message: "Certificate issuer identity is invalid",
      status: "INVALID"
    });
  });
  it("should return an error fragment when document has no identity type", async () => {
    const document = {
      ...documentRopstenValidWithToken,
      data: {
        ...documentRopstenValidWithToken.data,
        issuers: [
          {
            ...documentRopstenValidWithToken.data.issuers[0],
            identityProof: {
              ...documentRopstenValidWithToken.data.issuers[0].identityProof,
              type: null
            }
          }
        ]
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
      ...documentRopstenValidWithToken,
      data: {
        ...documentRopstenValidWithToken.data,
        issuers: [
          {
            ...documentRopstenValidWithToken.data.issuers[0],
            identityProof: {
              ...documentRopstenValidWithToken.data.issuers[0].identityProof,
              location: null
            }
          }
        ]
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
    it("should return true if at least one issuer has a documentStore", () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE"
            },
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              documentStore: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: {
                type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
                location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io"
              }
            }
          ]
        }
      };
      expect(
        openAttestationDnsTxt.test(document, {
          network: "ropsten"
        })
      ).toStrictEqual(true);
    });
    it("should return true if at least one issuer has a tokenRegistry", () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE"
            },
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              tokenRegistry: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: {
                type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
                location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io"
              }
            }
          ]
        }
      };
      expect(
        openAttestationDnsTxt.test(document, {
          network: "ropsten"
        })
      ).toStrictEqual(true);
    });
    it("should return false if no issuer has a tokenRegistry or documentStore", () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE"
            },
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              certificateStore: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
            }
          ]
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
