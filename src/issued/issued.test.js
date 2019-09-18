const mockDocumentStore = jest.fn();
const mockGetData = jest.fn();

jest.mock("../common/documentStore", () => ({
  execute: mockDocumentStore
}));
jest.mock("@govtechsg/open-attestation", () => ({
  getData: mockGetData
}));

const {
  getIssued,
  getIssuedOnAll,
  getIssuedSummary,
  verifyIssued
} = require("./issued");

describe("verify/issued", () => {
  beforeEach(() => {
    mockDocumentStore.mockReset();
    mockGetData.mockReset();
  });
  describe("getIssued", () => {
    it("returns true if document is issued", async () => {
      mockDocumentStore.mockResolvedValueOnce(true);
      const isIssued = await getIssued(
        "DocumentStoreAdd",
        "MerkleRoot",
        "network"
      );
      expect(mockDocumentStore.mock.calls[0]).toEqual([
        {
          args: ["0xMerkleRoot"],
          method: "isIssued",
          network: "network",
          contractAddress: "DocumentStoreAdd"
        }
      ]);
      expect(isIssued).toBe(true);
    });

    it("returns false if document is not issued", async () => {
      mockDocumentStore.mockResolvedValueOnce(false);
      const isIssued = await getIssued(
        "DocumentStoreAdd",
        "MerkleRoot",
        "network"
      );
      expect(mockDocumentStore.mock.calls[0]).toEqual([
        {
          args: ["0xMerkleRoot"],
          method: "isIssued",
          network: "network",
          contractAddress: "DocumentStoreAdd"
        }
      ]);
      expect(isIssued).toBe(false);
    });

    it("returns false if mockDocumentStore throws", async () => {
      mockDocumentStore.mockRejectedValue(new Error("An Error"));
      const isIssued = await getIssued(
        "DocumentStoreAdd",
        "MerkleRoot",
        "network"
      );
      expect(mockDocumentStore.mock.calls[0]).toEqual([
        {
          args: ["0xMerkleRoot"],
          method: "isIssued",
          network: "network",
          contractAddress: "DocumentStoreAdd"
        }
      ]);

      expect(isIssued).toBe(false);
    });
  });

  describe("getIssuedOnAll", () => {
    it("returns issued status for all store", async () => {
      mockDocumentStore
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const isIssued = await getIssuedOnAll(
        ["Store1", "Store2"],
        "MerkleRoot",
        "network"
      );
      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "Store1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "Store2"
          }
        ]
      ]);
      expect(isIssued).toEqual({
        Store1: true,
        Store2: false
      });
    });
  });

  describe("getIssuedSummary", () => {
    it("returns true for documents issued on all stores", async () => {
      mockDocumentStore.mockResolvedValue(true);
      const isIssued = await getIssuedSummary(
        ["Store1", "Store2"],
        "MerkleRoot",
        "network"
      );
      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "Store1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "Store2"
          }
        ]
      ]);
      expect(isIssued).toEqual({
        valid: true,
        issued: {
          Store1: true,
          Store2: true
        }
      });
    });

    it("returns false when documents is not issued on any stores", async () => {
      mockDocumentStore
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
      const isIssued = await getIssuedSummary(
        ["Store1", "Store2"],
        "MerkleRoot",
        "network"
      );
      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "Store1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "Store2"
          }
        ]
      ]);
      expect(isIssued).toEqual({
        valid: false,
        issued: {
          Store1: false,
          Store2: true
        }
      });
    });
  });

  describe("verifyIssued", () => {
    it("returns the summary of the issued check, given a document", async () => {
      // Mocks OA mockGetData
      mockGetData.mockReturnValue({
        issuers: [
          { documentStore: "CertStore1" },
          { documentStore: "CertStore2" },
          { documentStore: "DocStore1" },
          { documentStore: "DocStore2" }
        ]
      });
      mockDocumentStore.mockResolvedValue(true);
      const documentRaw = {
        signature: {
          merkleRoot: "MerkleRoot"
        }
      };

      const verifySummary = await verifyIssued(documentRaw, "network");
      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "CertStore1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "CertStore2"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "DocStore1"
          }
        ],
        [
          {
            args: ["0xMerkleRoot"],
            method: "isIssued",
            network: "network",
            contractAddress: "DocStore2"
          }
        ]
      ]);
      expect(verifySummary).toEqual({
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
