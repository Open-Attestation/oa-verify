const mockVerifyHash = jest.fn();
const mockVerifyIssued = jest.fn();
const mockVerifyRevoked = jest.fn();

jest.mock("./hash/hash", () => ({
  verifyHash: mockVerifyHash
}));

jest.mock("./issued/issued", () => ({
  verifyIssued: mockVerifyIssued
}));

jest.mock("./unrevoked/unrevoked", () => ({
  verifyRevoked: mockVerifyRevoked
}));

const verify = require("./index");

const whenAllTestPasses = () => {
  const valid = true;
  mockVerifyHash.mockResolvedValue({ valid });
  mockVerifyIssued.mockResolvedValue({ valid });
  mockVerifyRevoked.mockResolvedValue({ valid });
};

const whenIssueTestFail = () => {
  const valid = true;
  mockVerifyHash.mockResolvedValue({ valid });
  mockVerifyIssued.mockResolvedValue({ valid: false });
  mockVerifyRevoked.mockResolvedValue({ valid });
};

describe("verify", () => {
  beforeEach(() => {
    mockVerifyHash.mockReset();
    mockVerifyIssued.mockReset();
    mockVerifyRevoked.mockReset();
  });

  it("returns valid as true when all test passes", async () => {
    whenAllTestPasses();
    const summary = await verify("DOCUMENT");
    expect(summary).toEqual({
      hash: { valid: true },
      issued: { valid: true },
      revoked: { valid: true },
      valid: true
    });
  });

  it("returns valid as false when any test passes", async () => {
    whenIssueTestFail();
    const summary = await verify("DOCUMENT");
    expect(summary).toEqual({
      hash: { valid: true },
      issued: { valid: false },
      revoked: { valid: true },
      valid: false
    });
  });
});
