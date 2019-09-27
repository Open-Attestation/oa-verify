const mockVerifyHash = jest.fn();
const mockVerifyIssued = jest.fn();
const mockVerifyRevoked = jest.fn();

jest.mock("./hash/hash", () => ({
  verifyHash: mockVerifyHash
}));

jest.mock("./issued/verify", () => ({
  verifyIssued: mockVerifyIssued
}));

jest.mock("./revoked/verify", () => ({
  verifyRevoked: mockVerifyRevoked
}));

const verify = require("./index");

const whenAllTestPasses = () => {
  const valid = true;
  mockVerifyHash.mockResolvedValue({ checksumMatch: valid });
  mockVerifyIssued.mockResolvedValue({ issuedOnAll: valid });
  mockVerifyRevoked.mockResolvedValue({ revokedOnAny: !valid });
};

const whenIssueTestFail = () => {
  const valid = true;
  mockVerifyHash.mockResolvedValue({ checksumMatch: valid });
  mockVerifyIssued.mockResolvedValue({ issuedOnAll: false });
  mockVerifyRevoked.mockResolvedValue({ revokedOnAny: !valid });
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
      hash: { checksumMatch: true },
      issued: { issuedOnAll: true },
      revoked: { revokedOnAny: false },
      valid: true
    });
  });

  it("returns valid as false when any test passes", async () => {
    whenIssueTestFail();
    const summary = await verify("DOCUMENT");
    expect(summary).toEqual({
      hash: { checksumMatch: true },
      issued: { issuedOnAll: false },
      revoked: { revokedOnAny: false },
      valid: false
    });
  });
});
