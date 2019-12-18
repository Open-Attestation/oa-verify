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

import { verifyWithIndividualChecks } from "./index";
import { document } from "../test/fixtures/v2/document";

describe("verifyWithIndividualChecks", () => {
  beforeEach(() => {
    mockVerifyHash.mockReset();
    mockVerifyIssued.mockReset();
    mockVerifyRevoked.mockReset();
  });

  it("returns valid as true only after all tests have passed", async () => {
    mockVerifyHash.mockResolvedValue({ checksumMatch: true });
    mockVerifyIssued.mockImplementation(
      () =>
        new Promise(res => setTimeout(() => res({ issuedOnAll: true }), 1000))
    );
    mockVerifyRevoked.mockImplementation(
      () =>
        new Promise(res => setTimeout(() => res({ revokedOnAny: false }), 1500))
    );

    let hasResolvedValid = false;
    const [hash, issued, revoked, valid] = verifyWithIndividualChecks(document);
    valid.then(() => {
      hasResolvedValid = true;
    });

    expect(await hash).toEqual({ checksumMatch: true });
    expect(hasResolvedValid).toBe(false);

    jest.advanceTimersByTime(1000);

    expect(await issued).toEqual({ issuedOnAll: true });
    expect(hasResolvedValid).toBe(false);

    jest.runAllTimers();

    expect(await revoked).toEqual({ revokedOnAny: false });
    expect(await valid).toBe(true);
    expect(hasResolvedValid).toBe(true);
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
