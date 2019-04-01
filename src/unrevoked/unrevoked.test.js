const proxyquire = require("proxyquire");
const sinon = require("sinon");
const { utils } = require("@govtechsg/open-attestation");

const getData = sinon.stub();
const documentStore = sinon.stub();

const {
  getRevoked,
  getRevokedByStore,
  getRevokedOnAllStore,
  verifyRevoked,
  getIntermediateHashes,
  getIssuedSummary
} = proxyquire("./unrevoked", {
  "../common/documentStore": documentStore,
  "@govtechsg/open-attestation": { utils, getData }
});

describe("verify/revoked", () => {
  beforeEach(() => {
    getData.reset();
    documentStore.reset();
  });
  describe("getIntermediateHashes", () => {
    it("returns array with single hash if no proof is present", () => {
      const targetHash =
        "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7";
      const expected = [
        "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7"
      ];

      expect(getIntermediateHashes(targetHash)).to.eql(expected);
      expect(getIntermediateHashes(targetHash, [])).to.eql(expected);
    });

    it("returns array of target hash, intermediate hashes up to merkle root when given target hash and proofs", () => {
      const targetHash =
        "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7";
      const proofs = [
        "2bb9dd186994f38084ee68e06be848b9d43077c307684c300d81df343c7858cf",
        "ed8bdba60a24af04bcdcd88b939251f3843e03839164fdd2dd502aaeef3bfb99"
      ];
      const expected = [
        "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7",
        "fe0958c4b90e768cecb50cea207f3af034580703e9ed74ef460c1a31dd1b4d6c",
        "fcfce0e79adc002c1fd78a2a02c768c0fdc00e5b96f1da8ef80bed02876e18d1"
      ];

      expect(getIntermediateHashes(targetHash, proofs)).to.eql(expected);
    });
  });

  describe("getRevoked", () => {
    it("returns true when the document is revoked", async () => {
      documentStore.resolves(true);
      const revoked = await getRevoked("Store1", "ab12");
      expect(revoked).to.eql(true);
      expect(documentStore.args[0]).to.eql(["Store1", "isRevoked", "0xab12"]);
    });

    it("returns false when the document is not revoked", async () => {
      documentStore.resolves(false);
      const revoked = await getRevoked("Store1", "ab12");
      expect(revoked).to.eql(false);
      expect(documentStore.args[0]).to.eql(["Store1", "isRevoked", "0xab12"]);
    });

    it("returns true when api throws", async () => {
      documentStore.rejects(new Error());
      const revoked = await getRevoked("Store1", "ab12");
      expect(revoked).to.eql(true);
      expect(documentStore.args[0]).to.eql(["Store1", "isRevoked", "0xab12"]);
    });
  });

  describe("getRevokedByStore", () => {
    it("returns false if all the hashes are not revoked on the store", async () => {
      documentStore.resolves(false);
      const revoked = await getRevokedByStore("s1", ["h1", "h2", "h3"]);
      expect(revoked).to.eql(false);
      expect(documentStore.args).to.eql([
        ["s1", "isRevoked", "0xh1"],
        ["s1", "isRevoked", "0xh2"],
        ["s1", "isRevoked", "0xh3"]
      ]);
    });
    it("returns true if any of the hash is revoked on the store", async () => {
      documentStore.resolves(false);
      documentStore.onCall(1).resolves(true);

      const revoked = await getRevokedByStore("s1", ["h1", "h2", "h3"]);
      expect(revoked).to.eql(true);
      expect(documentStore.args).to.eql([
        ["s1", "isRevoked", "0xh1"],
        ["s1", "isRevoked", "0xh2"],
        ["s1", "isRevoked", "0xh3"]
      ]);
    });
  });

  describe("getRevokedOnAllStore", () => {
    it("returns object of the revoke status, mapped to individual store addresses", async () => {
      documentStore.resolves(false);
      documentStore.onCall(3).resolves(true);

      const revoked = await getRevokedOnAllStore(
        ["s1", "s2"],
        ["h1", "h2", "h3"]
      );

      expect(documentStore.args).to.eql([
        ["s1", "isRevoked", "0xh1"],
        ["s1", "isRevoked", "0xh2"],
        ["s1", "isRevoked", "0xh3"],
        ["s2", "isRevoked", "0xh1"],
        ["s2", "isRevoked", "0xh2"],
        ["s2", "isRevoked", "0xh3"]
      ]);
      expect(revoked).to.eql({ s1: false, s2: true });
    });
  });

  describe("getIssuedSummary", () => {
    it("returns true for summary if hashes are not revoked in any store", async () => {
      documentStore.resolves(false);

      const summary = await getIssuedSummary(["s1", "s2"], ["h1", "h2", "h3"]);

      expect(summary).to.eql({
        valid: true,
        revoked: { s1: false, s2: false }
      });
    });

    it("returns false for summary if hashes are revoked on any store", async () => {
      documentStore.resolves(false);
      documentStore.onCall(3).resolves(true);

      const summary = await getIssuedSummary(["s1", "s2"], ["h1", "h2", "h3"]);

      expect(summary).to.eql({
        valid: false,
        revoked: { s1: false, s2: true }
      });
    });
  });

  describe("verifyRevoked", () => {
    it("returns correct summary for document not revoked", async () => {
      getData.returns({
        issuers: [{ certificateStore: "s1" }, { documentStore: "s2" }]
      });
      documentStore.resolves(false);
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
      const summary = await verifyRevoked(document);
      expect(summary).to.eql({
        valid: true,
        revoked: { s1: false, s2: false }
      });
      expect(documentStore.args).to.eql([
        [
          "s1",
          "isRevoked",
          "0xddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389"
        ],
        [
          "s1",
          "isRevoked",
          "0x136dde231d4d77702786692a72869a1d81c3384787437a1eeccf2de8d5e4965f"
        ],
        [
          "s1",
          "isRevoked",
          "0x779455a65491cc678fd5001b0aefd21726eb45c1dfaa1b7e69668e98e1ec791e"
        ],
        [
          "s2",
          "isRevoked",
          "0xddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389"
        ],
        [
          "s2",
          "isRevoked",
          "0x136dde231d4d77702786692a72869a1d81c3384787437a1eeccf2de8d5e4965f"
        ],
        [
          "s2",
          "isRevoked",
          "0x779455a65491cc678fd5001b0aefd21726eb45c1dfaa1b7e69668e98e1ec791e"
        ]
      ]);
    });

    it("returns correct summary for document that is revoked", async () => {
      getData.returns({
        issuers: [{ certificateStore: "s1" }, { documentStore: "s2" }]
      });
      documentStore.resolves(false);
      documentStore.onCall(3).resolves(true);

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
      const summary = await verifyRevoked(document);
      expect(summary).to.eql({
        valid: false,
        revoked: { s1: false, s2: true }
      });
      expect(documentStore.args).to.eql([
        [
          "s1",
          "isRevoked",
          "0xddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389"
        ],
        [
          "s1",
          "isRevoked",
          "0x136dde231d4d77702786692a72869a1d81c3384787437a1eeccf2de8d5e4965f"
        ],
        [
          "s1",
          "isRevoked",
          "0x779455a65491cc678fd5001b0aefd21726eb45c1dfaa1b7e69668e98e1ec791e"
        ],
        [
          "s2",
          "isRevoked",
          "0xddbfa940b715be88edd3f793483db4e717342ee78c9267f069a76aa51b882389"
        ],
        [
          "s2",
          "isRevoked",
          "0x136dde231d4d77702786692a72869a1d81c3384787437a1eeccf2de8d5e4965f"
        ],
        [
          "s2",
          "isRevoked",
          "0x779455a65491cc678fd5001b0aefd21726eb45c1dfaa1b7e69668e98e1ec791e"
        ]
      ]);
    });
  });
});
