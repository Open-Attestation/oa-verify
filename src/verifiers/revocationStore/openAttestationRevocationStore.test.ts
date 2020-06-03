import { openAttestationRevocationStore } from "./openAttestationRevocationStore";
import { verificationBuilder } from "../verificationBuilder";
import { documentRopstenValidWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenValidWithDocumentStore";
import { documentRopstenRevocationStoreNotRevoked, documentRopstenRevocationStoreRevoked } from "./revocationStore";

const verify = verificationBuilder([openAttestationRevocationStore]);
describe("OpenAttestationRevocationStore", () => {
  describe("v2", () => {
    it("should return a skipped fragment when document store is used", async () => {
      const fragment = await verify(documentRopstenValidWithDocumentStore, { network: "ropsten" });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationRevocationStore",
          type: "DOCUMENT_STATUS",
          reason: {
            code: 4,
            codeString: "SKIPPED",
            message: 'Document issuers doesn\'t have "revocationStore"',
          },
          status: "SKIPPED",
        },
      ]);
    });
    it("should return a valid fragment when revocation store is used and the document is not revoked", async () => {
      const fragment = await verify(documentRopstenRevocationStoreNotRevoked, { network: "ropsten" });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationRevocationStore",
          type: "DOCUMENT_STATUS",
          status: "VALID",
          data: {
            details: [
              {
                address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                revoked: false,
              },
            ],
            revokedOnAny: false,
          },
        },
      ]);
    });
    it("should return a invalid fragment when revocation store is used and the document is not revoked", async () => {
      const fragment = await verify(documentRopstenRevocationStoreRevoked, { network: "ropsten" });
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationRevocationStore",
          type: "DOCUMENT_STATUS",
          reason: {
            code: 1,
            codeString: "DOCUMENT_REVOKED",
            message:
              "Certificate 0x856924fa2cf3374bf64697eb0dcf38d0251ff18aedae2bbc193398e8bb11fbd1 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
          },
          status: "INVALID",
          data: {
            details: [
              {
                address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                reason: {
                  code: 1,
                  codeString: "DOCUMENT_REVOKED",
                  message:
                    "Certificate 0x856924fa2cf3374bf64697eb0dcf38d0251ff18aedae2bbc193398e8bb11fbd1 has been revoked under contract 0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
                },
                revoked: true,
              },
            ],
            revokedOnAny: true,
          },
        },
      ]);
    });
  });
});
