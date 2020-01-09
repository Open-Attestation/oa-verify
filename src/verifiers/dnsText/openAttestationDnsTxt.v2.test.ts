import { openAttestationDnsTxt } from "./openAttestationDnsTxt";
import { documentRopstenValidWithToken } from "../../../test/fixtures/v2/documentRopstenValidWithToken";
import { verificationBuilder } from "../verificationBuilder";

const verify = verificationBuilder([openAttestationDnsTxt]);
describe("OpenAttestationDnsTxt v2 document", () => {
  describe("with one issuer", () => {
    it("should return a valid fragment when document has valid identity", async () => {
      const fragment = await verify(documentRopstenValidWithToken, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          type: "ISSUER_IDENTITY",
          name: "OpenAttestationDnsTxt",
          data: [
            {
              location: "example.tradetrust.io",
              status: "VALID",
              value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
            }
          ],
          status: "VALID"
        }
      ]);
    });
    it("should return a valid fragment when document has valid identity and uses document store", async () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
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

      const fragment = await verify(document, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          type: "ISSUER_IDENTITY",
          name: "OpenAttestationDnsTxt",
          data: [
            {
              location: "example.tradetrust.io",
              status: "VALID",
              value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
            }
          ],
          status: "VALID"
        }
      ]);
    });
    it("should return a valid fragment when document has valid identity and uses certificate store", async () => {
      const document = {
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
                location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io"
              }
            }
          ]
        }
      };

      const fragment = await verify(document, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          type: "ISSUER_IDENTITY",
          name: "OpenAttestationDnsTxt",
          data: [
            {
              location: "example.tradetrust.io",
              status: "VALID",
              value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
            }
          ],
          status: "VALID"
        }
      ]);
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
      const fragment = await verify(document, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          type: "ISSUER_IDENTITY",
          name: "OpenAttestationDnsTxt",
          data: [
            {
              location: "example.tradetrust.io",
              status: "INVALID",
              value: "0xabcd"
            }
          ],
          reason: {
            code: 1,
            codeString: "INVALID_IDENTITY",
            message: "Certificate issuer identity for 0xabcd is invalid"
          },
          status: "INVALID"
        }
      ]);
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
      const fragment = await verify(document, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          type: "ISSUER_IDENTITY",
          name: "OpenAttestationDnsTxt",
          data: new Error("Location is missing"),
          reason: {
            code: 0,
            codeString: "UNEXPECTED_ERROR",
            message: "Location is missing"
          },
          status: "ERROR"
        }
      ]);
    });
    it("should return a skipped fragment if issuer has a tokenRegistry but does not provide identity proof", async () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              tokenRegistry: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: undefined
            }
          ]
        }
      };
      expect(
        await verify(document, {
          network: "ropsten"
        })
      ).toStrictEqual([
        {
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" / "tokenRegistry" property or doesn\'t use DNS-TXT type'
          },
          name: "OpenAttestationDnsTxt",
          status: "SKIPPED",
          type: "ISSUER_IDENTITY"
        }
      ]);
    });
    it("should return a skipped fragment if issuer has a document store but does not provide identity proof", async () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              documentStore: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: undefined
            }
          ]
        }
      };
      expect(
        await verify(document, {
          network: "ropsten"
        })
      ).toStrictEqual([
        {
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" / "tokenRegistry" property or doesn\'t use DNS-TXT type'
          },
          name: "OpenAttestationDnsTxt",
          status: "SKIPPED",
          type: "ISSUER_IDENTITY"
        }
      ]);
    });
    it("should return a skipped if issuer has a tokenRegistry but does not use DNS-TXT as identity proof", async () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              tokenRegistry: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: {
                type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:OTHER-METHOD",
                location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io"
              }
            }
          ]
        }
      };
      expect(
        await verify(document, {
          network: "ropsten"
        })
      ).toStrictEqual([
        {
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" / "tokenRegistry" property or doesn\'t use DNS-TXT type'
          },
          name: "OpenAttestationDnsTxt",
          status: "SKIPPED",
          type: "ISSUER_IDENTITY"
        }
      ]);
    });
    it("should return a skipped if issuer has a documentStore but does not use DNS-TXT as identity proof", async () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              documentStore: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              identityProof: {
                type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:OTHER-METHOD",
                location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io"
              }
            }
          ]
        }
      };
      expect(
        await verify(document, {
          network: "ropsten"
        })
      ).toStrictEqual([
        {
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" / "tokenRegistry" property or doesn\'t use DNS-TXT type'
          },
          name: "OpenAttestationDnsTxt",
          status: "SKIPPED",
          type: "ISSUER_IDENTITY"
        }
      ]);
    });
  });

  describe("with multiple issuers", () => {
    it("should return a valid fragment when document has one issuer with document store/valid identity and a second issuer without identity", async () => {
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
        await verify(document, {
          network: "ropsten"
        })
      ).toStrictEqual([
        {
          type: "ISSUER_IDENTITY",
          name: "OpenAttestationDnsTxt",
          data: [
            {
              status: "SKIPPED"
            },
            {
              location: "example.tradetrust.io",
              status: "VALID",
              value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
            }
          ],
          status: "VALID"
        }
      ]);
    });
    it("should return an invalid fragment when document has one issuer with document store/valid identity and a second issuer with invalid identity", async () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            {
              name: "2433e228-5bee-4863-9b98-2337f4f90306:string:DEMO STORE",
              documentStore: "1d337929-6770-4a05-ace0-1f07c25c7615:string:0xabcd",
              identityProof: {
                type: "1350e9f5-920b-496d-b95c-2a2793f5bff6:string:DNS-TXT",
                location: "291a5524-f1c6-45f8-aebc-d691cf020fdd:string:example.tradetrust.io"
              }
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
        await verify(document, {
          network: "ropsten"
        })
      ).toStrictEqual([
        {
          type: "ISSUER_IDENTITY",
          name: "OpenAttestationDnsTxt",
          data: [
            {
              location: "example.tradetrust.io",
              status: "INVALID",
              value: "0xabcd"
            },
            {
              location: "example.tradetrust.io",
              status: "VALID",
              value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
            }
          ],
          reason: {
            code: 1,
            codeString: "INVALID_IDENTITY",
            message: "Certificate issuer identity for 0xabcd is invalid"
          },
          status: "INVALID"
        }
      ]);
    });
    it("should return a valid fragment when document has one issuer with token registry/valid identity and a second issuer without identity", async () => {
      const document = {
        ...documentRopstenValidWithToken,
        data: {
          ...documentRopstenValidWithToken.data,
          issuers: [
            documentRopstenValidWithToken.data.issuers[0],
            {
              ...documentRopstenValidWithToken.data.issuers[0],
              identityProof: undefined
            }
          ]
        }
      };

      const fragment = await verify(document, {
        network: "ropsten"
      });
      expect(fragment).toStrictEqual([
        {
          type: "ISSUER_IDENTITY",
          name: "OpenAttestationDnsTxt",
          data: [
            {
              location: "example.tradetrust.io",
              status: "VALID",
              value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
            },
            {
              status: "SKIPPED"
            }
          ],
          status: "VALID"
        }
      ]);
    });
    it("should return skipped fragment if no issuer has a tokenRegistry or documentStore", async () => {
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
        await verify(document, {
          network: "ropsten"
        })
      ).toStrictEqual([
        {
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message:
              'Document issuers doesn\'t have "documentStore" / "tokenRegistry" property or doesn\'t use DNS-TXT type'
          },
          name: "OpenAttestationDnsTxt",
          status: "SKIPPED",
          type: "ISSUER_IDENTITY"
        }
      ]);
    });
  });
});
