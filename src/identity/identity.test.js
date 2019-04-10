const mockGetIdentity = jest.fn();
const mockGetData = jest.fn();

jest.mock("../common/identityRegistry", () => ({
  getIdentity: mockGetIdentity
}));
jest.mock("@govtechsg/open-attestation", () => ({ getData: mockGetData }));

const {
  getIdentities,
  isAllIdentityValid,
  getIdentitySummary,
  verifyIdentity
} = require("./identity");

describe("verify/identity", () => {
  describe("getIdentities", () => {
    it("returns object of identities where the identifier is the key", async () => {
      mockGetIdentity
        .mockResolvedValueOnce("Foo-ID")
        .mockResolvedValueOnce(undefined);
      const identities = await getIdentities(["Foo", "Bar"]);
      expect(mockGetIdentity.mock.calls).toEqual([["Foo"], ["Bar"]]);
      expect(identities).toEqual({
        Foo: "Foo-ID",
        Bar: undefined
      });
    });
  });

  describe("isAllIdentityValid", () => {
    it("returns false if any identifier does not resolve", async () => {
      const identities = {
        Foo: "Foo-ID",
        Bar: undefined
      };
      const valid = isAllIdentityValid(identities);
      expect(valid).toBe(false);
    });

    it("returns true if all identifiers resolves", async () => {
      const identities = {
        Foo: "Foo-ID",
        Bar: "Bar-ID"
      };
      const valid = isAllIdentityValid(identities);
      expect(valid).toBe(true);
    });
  });

  describe("getIdentitySummary", () => {
    it("returns summary with invalid status if any identifier does not resolve", async () => {
      mockGetIdentity
        .mockResolvedValueOnce("Foo-ID")
        .mockResolvedValueOnce(undefined);
      const summary = await getIdentitySummary(["Foo", "Bar"]);
      expect(summary).toEqual({
        valid: false,
        identities: { Foo: "Foo-ID", Bar: undefined }
      });
    });

    it("returns summary with vallid status if all identifier resolves", async () => {
      mockGetIdentity
        .mockResolvedValueOnce("Foo-ID")
        .mockResolvedValueOnce("Bar-ID");
      const summary = await getIdentitySummary(["Foo", "Bar"]);
      expect(summary).toEqual({
        valid: true,
        identities: { Foo: "Foo-ID", Bar: "Bar-ID" }
      });
    });
  });

  describe("verifyIdentity", () => {
    it("returns the identity summary of the document", async () => {
      mockGetData.mockReturnValue({
        issuers: [
          { certificateStore: "CertStore1" },
          { certificateStore: "CertStore2" },
          { documentStore: "DocStore1" },
          { documentStore: "DocStore2" }
        ]
      });
      mockGetIdentity
        .mockResolvedValueOnce("Foo-ID")
        .mockResolvedValueOnce("Bar-ID")
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce("Moo-ID");

      const document = "DOCUMENT";
      const summary = await verifyIdentity(document);
      expect(mockGetData.mock.calls[0]).toEqual(["DOCUMENT"]);
      expect(summary).toEqual({
        valid: false,
        identities: {
          CertStore1: "Foo-ID",
          CertStore2: "Bar-ID",
          DocStore1: undefined,
          DocStore2: "Moo-ID"
        }
      });
    });
  });
});
