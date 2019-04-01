const sinon = require("sinon");
const proxyquire = require("proxyquire");

const documentStore = sinon.stub();
const getData = sinon.stub();
const {
  getIssued,
  getIssuedOnAll,
  getIssuedSummary,
  verifyIssued
} = proxyquire("./issued", {
  "../common/documentStore": documentStore,
  "@govtechsg/open-attestation": { getData }
});

describe("verify/issued", () => {
  beforeEach(() => {
    documentStore.reset();
    getData.reset();
  });
  describe("getIssued", () => {
    it("returns true if certificate is issued", async () => {
      documentStore.resolves(true);
      const isIssued = await getIssued("DocumentStoreAdd", "MerkleRoot");
      expect(documentStore.args[0]).to.eql([
        "DocumentStoreAdd",
        "isIssued",
        "0xMerkleRoot"
      ]);
      expect(isIssued).to.eql(true);
    });

    it("returns false if certificate is not issued", async () => {
      documentStore.resolves(false);
      const isIssued = await getIssued("DocumentStoreAdd", "MerkleRoot");
      expect(documentStore.args[0]).to.eql([
        "DocumentStoreAdd",
        "isIssued",
        "0xMerkleRoot"
      ]);
      expect(isIssued).to.eql(false);
    });

    it("returns false if documentStore throws", async () => {
      documentStore.rejects(new Error("An Error"));
      const isIssued = await getIssued("DocumentStoreAdd", "MerkleRoot");
      expect(documentStore.args[0]).to.eql([
        "DocumentStoreAdd",
        "isIssued",
        "0xMerkleRoot"
      ]);
      expect(isIssued).to.eql(false);
    });
  });

  describe("getIssuedOnAll", () => {
    it("returns issued status for all store", async () => {
      documentStore.onCall(0).resolves(true);
      documentStore.onCall(1).resolves(false);

      const isIssued = await getIssuedOnAll(["Store1", "Store2"], "MerkleRoot");
      expect(documentStore.args).to.eql([
        ["Store1", "isIssued", "0xMerkleRoot"],
        ["Store2", "isIssued", "0xMerkleRoot"]
      ]);
      expect(isIssued).to.eql({
        Store1: true,
        Store2: false
      });
    });
  });

  describe("getIssuedSummary", () => {
    it("returns true for certificates issued on all stores", async () => {
      documentStore.resolves(true);
      const isIssued = await getIssuedSummary(
        ["Store1", "Store2"],
        "MerkleRoot"
      );
      expect(documentStore.args).to.eql([
        ["Store1", "isIssued", "0xMerkleRoot"],
        ["Store2", "isIssued", "0xMerkleRoot"]
      ]);
      expect(isIssued).to.eql({
        valid: true,
        issued: {
          Store1: true,
          Store2: true
        }
      });
    });

    it("returns false when certificates is not issued on any stores", async () => {
      documentStore.onCall(0).resolves(false);
      documentStore.onCall(1).resolves(true);
      const isIssued = await getIssuedSummary(
        ["Store1", "Store2"],
        "MerkleRoot"
      );
      expect(documentStore.args).to.eql([
        ["Store1", "isIssued", "0xMerkleRoot"],
        ["Store2", "isIssued", "0xMerkleRoot"]
      ]);
      expect(isIssued).to.eql({
        valid: false,
        issued: {
          Store1: false,
          Store2: true
        }
      });
    });
  });

  describe("verifyIssued", () => {
    it("returns the summary of the issued check, given a certificate", async () => {
      // Mocks OA getData
      getData.returns({
        issuers: [
          { certificateStore: "CertStore1" },
          { certificateStore: "CertStore2" },
          { documentStore: "DocStore1" },
          { documentStore: "DocStore2" }
        ]
      });
      documentStore.resolves(true);
      const documentRaw = {
        signature: {
          merkleRoot: "MerkleRoot"
        }
      };

      const verifySummary = await verifyIssued(documentRaw);
      expect(documentStore.args).to.eql([
        ["CertStore1", "isIssued", "0xMerkleRoot"],
        ["CertStore2", "isIssued", "0xMerkleRoot"],
        ["DocStore1", "isIssued", "0xMerkleRoot"],
        ["DocStore2", "isIssued", "0xMerkleRoot"]
      ]);
      expect(verifySummary).to.eql({
        valid: true,
        issued: {
          CertStore1: true,
          CertStore2: true,
          DocStore1: true,
          DocStore2: true
        }
      });
    });
  });
});
