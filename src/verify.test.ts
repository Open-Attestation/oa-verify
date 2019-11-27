/* eslint-disable import/first */
const mockVerifyHash = jest.fn();
const mockVerifyIssued = jest.fn();
const mockVerifyRevoked = jest.fn();

jest.useFakeTimers();

jest.doMock("./hash/hash", () => ({
  verifyHash: mockVerifyHash
}));

jest.doMock("./issued/verify", () => ({
  verifyIssued: mockVerifyIssued
}));

jest.doMock("./revoked/verify", () => ({
  verifyRevoked: mockVerifyRevoked
}));

import verify, { verifyWithIndividualChecks } from "./index";
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
  mockVerifyIssued.mockResolvedValue({ issuedOnAll: !valid });
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

  it("returns valid as false when any test fails", async () => {
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

describe("verifyWithIndividualChecks", () => {
  beforeEach(() => {
    mockVerifyHash.mockReset();
    mockVerifyIssued.mockReset();
    mockVerifyRevoked.mockReset();
  });

  it("returns valid as true when all test passes", async () => {
    whenAllTestPasses();
    const checkPromises = verifyWithIndividualChecks(document);
    const [hash, issued, revoked, valid] = await Promise.all(checkPromises);
    const summary = { hash, issued, revoked, valid };
    expect(summary).toEqual({
      hash: { checksumMatch: true },
      issued: { issuedOnAll: true },
      revoked: { revokedOnAny: false },
      valid: true
    });
  });

  it("returns valid as false immediately when any test fails", async () => {
    mockVerifyHash.mockResolvedValue({ checksumMatch: true });
    mockVerifyIssued.mockImplementation(
      () =>
        new Promise(res => setTimeout(() => res({ issuedOnAll: false }), 1000))
    );
    mockVerifyRevoked.mockImplementation(
      () =>
        new Promise(res => setTimeout(() => res({ revokedOnAny: false }), 1500))
    );

    let hasResolvedRevoked = false;
    const [hash, issued, revoked, valid] = verifyWithIndividualChecks(document);
    revoked.then(() => {
      hasResolvedRevoked = true;
    });

    expect(await hash).toEqual({ checksumMatch: true });
    expect(hasResolvedRevoked).toBe(false);

    jest.advanceTimersByTime(1000);

    expect(await issued).toEqual({ issuedOnAll: false }); // Since issued check is falsy, document is overall invalid
    expect(await valid).toBe(false); // Return the overall validity early
    expect(hasResolvedRevoked).toBe(false); // The result of this is inconsequential to the overal validity

    jest.runAllTimers();

    expect(await revoked).toEqual({ revokedOnAny: false });
    expect(hasResolvedRevoked).toBe(true);
  });
});
