/* eslint-disable import/first */
const mockVerifyHash = jest.fn();
const mockVerifyIssued = jest.fn();
const mockVerifyRevoked = jest.fn();

jest.doMock("./hash/hash", () => ({
  verifyHash: mockVerifyHash
}));

jest.doMock("./issued/verify", () => ({
  verifyIssued: mockVerifyIssued
}));

jest.doMock("./revoked/verify", () => ({
  verifyRevoked: mockVerifyRevoked
}));

import verify from "./index";
import { document } from "../test/fixtures/document";

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
    const summary = await verify(document);
    expect(summary).toEqual({
      hash: { checksumMatch: true },
      issued: { issuedOnAll: true },
      revoked: { revokedOnAny: false },
      valid: true
    });
  });

  it("returns valid as false when any test passes", async () => {
    whenIssueTestFail();
    const summary = await verify(document);
    expect(summary).toEqual({
      hash: { checksumMatch: true },
      issued: { issuedOnAll: false },
      revoked: { revokedOnAny: false },
      valid: false
    });
  });
});
