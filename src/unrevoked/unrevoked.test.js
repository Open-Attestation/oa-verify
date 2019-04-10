const openAttestation = require("@govtechsg/open-attestation");

const mockGetData = jest.fn();
const mockDocumentStore = jest.fn();

jest.mock("../common/documentStore", () => mockDocumentStore);

openAttestation.getData = mockGetData;

const {
  getRevoked,
  getRevokedByStore,
  getRevokedOnAllStore,
  verifyRevoked,
  getIntermediateHashes,
  getIssuedSummary
} = require("./unrevoked");

describe("verify/revoked", () => {
  beforeEach(() => {
    mockGetData.mockReset();
    mockDocumentStore.mockReset();
  });
  describe("getIntermediateHashes", () => {
    it("returns array with single hash if no proof is present", () => {
      const targetHash =
        "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7";
      const expected = [
        "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7"
      ];

      expect(getIntermediateHashes(targetHash)).toEqual(expected);
      expect(getIntermediateHashes(targetHash, [])).toEqual(expected);
    });

    it.skip("returns array of target hash, intermediate hashes up to merkle root when given target hash and proofs", () => {
      const targetHash =
        "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7";
      const proofs = [
        "2bb9dd186994f38084ee68e06be848b9d43077c30q7684c300d81df343c7858cf",
        "ed8bdba60a24af04bcdcd88b939251f3843e03839164fdd2dd502aaeef3bfb99"
      ];
      const expected = [
        "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7",
        "fe0958c4b90e768cecb50cea207f3af034580703e9ed74ef460c1a31dd1b4d6c",
        "fcfce0e79adc002c1fd78a2a02c768c0fdc00e5b96f1da8ef80bed02876e18d1"
      ];
      
      expect(getIntermediateHashes(targetHash, proofs)).toEqual(expected);
    });
  });

  describe("getRevoked", () => {
    it("returns true when the document is revoked", async () => {
      mockDocumentStore.mockResolvedValue(true);
      const revoked = await getRevoked("Store1", "ab12", "network");
      expect(revoked).toBe(true);
      expect(mockDocumentStore.mock.calls[0][0]).toEqual({
        storeAddress: "Store1",
        method: "isRevoked",
        args: ["0xab12"],
        network: "network"
      });
    });

    it("returns false when the document is not revoked", async () => {
      mockDocumentStore.mockResolvedValue(false);
      const revoked = await getRevoked("Store1", "ab12", "network");
      expect(revoked).toBe(false);
      expect(mockDocumentStore.mock.calls[0][0]).toEqual({
        storeAddress: "Store1",
        method: "isRevoked",
        args: ["0xab12"],
        network: "network"
      });
    });

    it("returns true when api throws", async () => {
      mockDocumentStore.mockRejectedValue(new Error());
      const revoked = await getRevoked("Store1", "ab12", "network");
      expect(revoked).toBe(true);
      expect(mockDocumentStore.mock.calls[0][0]).toEqual({
        storeAddress: "Store1",
        method: "isRevoked",
        args: ["0xab12"],
        network: "network"
      });
    });
  });

  describe("getRevokedByStore", () => {
    it("returns false if all the hashes are not revoked on the store", async () => {
      mockDocumentStore.mockResolvedValue(false);
      const revoked = await getRevokedByStore(
        "s1",
        ["h1", "h2", "h3"],
        "network"
      );
      expect(revoked).toBe(false);
      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh1"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh2"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh3"],
            network: "network"
          }
        ]
      ]);
    });
    it("returns true if any of the hash is revoked on the store", async () => {
      mockDocumentStore
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const revoked = await getRevokedByStore(
        "s1",
        ["h1", "h2", "h3"],
        "network"
      );
      expect(revoked).toBe(true);
      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh1"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh2"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh3"],
            network: "network"
          }
        ]
      ]);
    });
  });

  describe("getRevokedOnAllStore", () => {
    it("returns object of the revoke status, mapped to individual store addresses", async () => {
      mockDocumentStore
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const revoked = await getRevokedOnAllStore(
        ["s1", "s2"],
        ["h1", "h2", "h3"],
        "network"
      );

      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh1"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh2"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: ["0xh3"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: ["0xh1"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: ["0xh2"],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: ["0xh3"],
            network: "network"
          }
        ]
      ]);
      expect(revoked).toEqual({ s1: false, s2: true });
    });
  });

  describe("getIssuedSummary", () => {
    it("returns true for summary if hashes are not revoked in any store", async () => {
      mockDocumentStore.mockResolvedValue(false);

      const summary = await getIssuedSummary(["s1", "s2"], ["h1", "h2", "h3"]);

      expect(summary).toEqual({
        valid: true,
        revoked: { s1: false, s2: false }
      });
    });

    it("returns false for summary if hashes are revoked on any store", async () => {
      mockDocumentStore
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const summary = await getIssuedSummary(["s1", "s2"], ["h1", "h2", "h3"]);

      expect(summary).toEqual({
        valid: false,
        revoked: { s1: false, s2: true }
      });
    });
  });

  describe("verifyRevoked", () => {
    it("returns correct summary for document not revoked", async () => {
      mockGetData.mockReturnValue({
        issuers: [{ certificateStore: "s1" }, { documentStore: "s2" }]
      });
      mockDocumentStore.mockResolvedValue(false);
      const document = {
        signature: {
          targetHash:
            "ddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389",
          proof: [
            "4512830b29bec8d37871589d6b6fb0130e9bbadfd9bf5053d677beec1b57bddb",
            "f15511cbfdede6ce7219ba6db142f6cf195b9d2ff4543d4c3c41a52feba00b88"
          ]
        }
      };
      const summary = await verifyRevoked(document, "network");
      expect(summary).toEqual({
        valid: true,
        revoked: { s1: false, s2: false }
      });
      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: [
              "0xddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: [
              "0x136dde231d4d77702786692a72869a1d81c3384787437a1eeccf2de8d5e4965f"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: [
              "0x779455a65491cc678fd5001b0aefd21726eb45c1dfaa1b7e69668e98e1ec791e"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: [
              "0xddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: [
              "0x136dde231d4d77702786692a72869a1d81c3384787437a1eeccf2de8d5e4965f"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: [
              "0x779455a65491cc678fd5001b0aefd21726eb45c1dfaa1b7e69668e98e1ec791e"
            ],
            network: "network"
          }
        ]
      ]);
    });

    it("returns correct summary for document that is revoked", async () => {
      mockGetData.mockReturnValue({
        issuers: [{ certificateStore: "s1" }, { documentStore: "s2" }]
      });
      mockDocumentStore
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const document = {
        signature: {
          targetHash:
            "ddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389",
          proof: [
            "4512830b29bec8d37871589d6b6fb0130e9bbadfd9bf5053d677beec1b57bddb",
            "f15511cbfdede6ce7219ba6db142f6cf195b9d2ff4543d4c3c41a52feba00b88"
          ]
        }
      };
      const summary = await verifyRevoked(document, "network");
      expect(summary).toEqual({
        valid: false,
        revoked: { s1: false, s2: true }
      });
      expect(mockDocumentStore.mock.calls).toEqual([
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: [
              "0xddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: [
              "0x136dde231d4d77702786692a72869a1d81c3384787437a1eeccf2de8d5e4965f"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s1",
            method: "isRevoked",
            args: [
              "0x779455a65491cc678fd5001b0aefd21726eb45c1dfaa1b7e69668e98e1ec791e"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: [
              "0xddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: [
              "0x136dde231d4d77702786692a72869a1d81c3384787437a1eeccf2de8d5e4965f"
            ],
            network: "network"
          }
        ],
        [
          {
            storeAddress: "s2",
            method: "isRevoked",
            args: [
              "0x779455a65491cc678fd5001b0aefd21726eb45c1dfaa1b7e69668e98e1ec791e"
            ],
            network: "network"
          }
        ]
      ]);
    });
  });
});
