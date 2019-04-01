const proxyquire = require("proxyquire");
const sinon = require("sinon");

const verifyHash = sinon.stub();
const verifyIdentity = sinon.stub();
const verifyIssued = sinon.stub();
const verifyRevoked = sinon.stub();

const verify = proxyquire("./index", {
  "./hash/hash": { verifyHash },
  "./identity/identity": { verifyIdentity },
  "./issued/issued": { verifyIssued },
  "./unrevoked/unrevoked": { verifyRevoked }
});

const whenAllTestPasses = () => {
  const valid = true;
  verifyHash.resolves({ valid });
  verifyIdentity.resolves({ valid });
  verifyIssued.resolves({ valid });
  verifyRevoked.resolves({ valid });
};

const whenIdentityTestFail = () => {
  const valid = true;
  verifyHash.resolves({ valid });
  verifyIdentity.resolves({ valid: false });
  verifyIssued.resolves({ valid });
  verifyRevoked.resolves({ valid });
};

describe("verify", () => {
  beforeEach(() => {
    verifyHash.reset();
    verifyIdentity.reset();
    verifyIssued.reset();
    verifyRevoked.reset();
  });

  it("returns valid as true when all test passes", async () => {
    whenAllTestPasses();
    const summary = await verify("DOCUMENT");
    expect(summary).to.eql({
      hash: { valid: true },
      identity: { valid: true },
      issued: { valid: true },
      revoked: { valid: true },
      valid: true
    });
  });

  it("returns valid as false when any test passes", async () => {
    whenIdentityTestFail();
    const summary = await verify("DOCUMENT");
    expect(summary).to.eql({
      hash: { valid: true },
      identity: { valid: false },
      issued: { valid: true },
      revoked: { valid: true },
      valid: false
    });
  });
});
