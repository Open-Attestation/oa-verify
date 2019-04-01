const proxyquire = require("proxyquire");
const sinon = require("sinon");

const getIdentity = sinon.stub();
const getData = sinon.stub();
const {
  getIdentities,
  isAllIdentityValid,
  getIdentitySummary,
  verifyIdentity
} = proxyquire("./identity", {
  "../common/identityRegistry": { getIdentity },
  "@govtechsg/open-attestation": { getData }
});

describe("verify/identity", () => {
  beforeEach(() => {
    getIdentity.reset();
  });

  describe("getIdentities", () => {
    it("returns object of identities where the identifier is the key", async () => {
      getIdentity.onCall(0).resolves("Foo-ID");
      getIdentity.onCall(1).resolves(undefined);
      const identities = await getIdentities(["Foo", "Bar"]);
      expect(getIdentity.args).to.eql([["Foo"], ["Bar"]]);
      expect(identities).to.eql({
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
      expect(valid).to.eql(false);
    });

    it("returns true if all identifiers resolves", async () => {
      const identities = {
        Foo: "Foo-ID",
        Bar: "Bar-ID"
      };
      const valid = isAllIdentityValid(identities);
      expect(valid).to.eql(true);
    });
  });

  describe("getIdentitySummary", () => {
    it("returns summary with invalid status if any identifier does not resolve", async () => {
      getIdentity.onCall(0).resolves("Foo-ID");
      getIdentity.onCall(1).resolves(undefined);
      const summary = await getIdentitySummary(["Foo", "Bar"]);
      expect(summary).to.eql({
        valid: false,
        identities: { Foo: "Foo-ID", Bar: undefined }
      });
    });

    it("returns summary with vallid status if all identifier resolves", async () => {
      getIdentity.onCall(0).resolves("Foo-ID");
      getIdentity.onCall(1).resolves("Bar-ID");
      const summary = await getIdentitySummary(["Foo", "Bar"]);
      expect(summary).to.eql({
        valid: true,
        identities: { Foo: "Foo-ID", Bar: "Bar-ID" }
      });
    });
  });

  describe("verifyIdentity", () => {
    it("returns the identity summary of the document", async () => {
      getData.returns({
        issuers: [
          { certificateStore: "CertStore1" },
          { certificateStore: "CertStore2" },
          { documentStore: "DocStore1" },
          { documentStore: "DocStore2" }
        ]
      });
      getIdentity.onCall(0).resolves("Foo-ID");
      getIdentity.onCall(1).resolves("Bar-ID");
      getIdentity.onCall(2).resolves(undefined);
      getIdentity.onCall(3).resolves("Moo-ID");

      const document = "DOCUMENT";
      const summary = await verifyIdentity(document);
      expect(getData.args[0]).to.eql(["DOCUMENT"]);
      expect(summary).to.eql({
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
