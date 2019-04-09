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
      const isIssued = await getIssued(
        "DocumentStoreAdd",
        "MerkleRoot",
        "network"
      );
      expect(documentStore.args[0]).to.eql([
        {
          args: ["0xMerkleRoot"],
          method: "isIssued",
          network: "network",
          storeAddress: "DocumentStoreAdd"
        }
      ]);
      expect(isIssued).to.eql(true);
    });

    it("returns false if certificate is not issued", async () => {
      documentStore.resolves(false);
      const isIssued = await getIssued(
        "DocumentStoreAdd",
        "MerkleRoot",
        "network"
      );
      expect(documentStore.args[0]).to.eql([
        {
          args: ["0xMerkleRoot"],
          method: "isIssued",
          network: "network",
          storeAddress: "DocumentStoreAdd"
        }
      ]);
      expect(isIssued).to.eql(false);
    });

    it("returns false if documentStore throws", async () => {
      documentStore.rejects(new Error("An Error"));
      const isIssued = await getIssued(
        "DocumentStoreAdd",
        "MerkleRoot",
        "network"
      );
      expect(documentStore.args[0]).to.eql([
        {
          args: ["0xMerkleRoot"],
          method: "isIssued",
          network: "network",
          storeAddress: "DocumentStoreAdd"
        }
      ]);

      expect(isIssued).to.eql(false);
    });
  });

  describe("getIssuedOnAll", () => {
    it("returns issued status for all store", async () => {
      documentStore.onCall(0).resolves(true);
      documentStore.onCall(1).resolves(false);

      const isIssued = await getIssuedOnAll(
        ["Store1", "Store2"],
        "MerkleRoot",
        "network"
      );
      expect(documentStore.args).to.eql([
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "Store1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "Store2"
          }
        ]
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
        "MerkleRoot",
        "network"
      );
      expect(documentStore.args).to.eql([
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "Store1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "Store2"
          }
        ]
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
        "MerkleRoot",
        "network"
      );
      expect(documentStore.args).to.eql([
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "Store1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "Store2"
          }
        ]
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

      const verifySummary = await verifyIssued(documentRaw, "network");
      expect(documentStore.args).to.eql([
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "CertStore1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "CertStore2"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "DocStore1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            storeAddress: "DocStore2"
          }
        ]
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
