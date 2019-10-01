const {
  verifyIssued,
  isIssuedOnAll,
  issuedStatusOnContracts
} = require("./verify");
const { isIssued } = require("./contractInterface");

jest.mock("./contractInterface");

beforeEach(() => {
  isIssued.mockClear();
});

describe("issuedStatusOnContracts", () => {
  it("returns issued status on all smart contracts provided", async () => {
    isIssued.mockResolvedValueOnce(true);
    isIssued.mockResolvedValueOnce(false);
    const smartContracts = [
      { address: "0x0A", foo: "bar" },
      { address: "0x0B", foo: "bar" }
    ];
    const issuedStatus = await issuedStatusOnContracts(smartContracts, "HASH");
    expect(issuedStatus).toEqual([
      { address: "0x0A", issued: true },
      { address: "0x0B", issued: false }
    ]);
  });

  it("throws if any smart contract call failed", async () => {
    isIssued.mockResolvedValueOnce(true);
    isIssued.mockRejectedValueOnce(new Error("Some failure"));
    const smartContracts = [
      { address: "0x0A", foo: "bar" },
      { address: "0x0B", foo: "bar" }
    ];
    const issuedStatus = await issuedStatusOnContracts(smartContracts, "HASH");
    expect(issuedStatus).toEqual([
      { address: "0x0A", issued: true },
      { address: "0x0B", issued: false, error: "Some failure" }
    ]);
  });
});

describe("isIssuedOnAll", () => {
  it("returns true if all the smart contract's issued status is true", () => {
    const status = [
      { address: "0x0A", issued: true },
      { address: "0x0B", issued: true }
    ];
    expect(isIssuedOnAll(status)).toBe(true);
  });

  it("returns false if no smart contract is present", () => {
    const status = [];
    expect(isIssuedOnAll(status)).toBe(false);
  });

  it("returns false if any issued status is false", () => {
    const status = [
      { address: "0x0A", issued: true },
      { address: "0x0B", issued: false }
    ];
    expect(isIssuedOnAll(status)).toBe(false);
  });
});

describe("verifyIssued", () => {
  it("returns valid summary of the status if document is issued on all smart contracts", async () => {
    isIssued.mockResolvedValueOnce(true);
    isIssued.mockResolvedValueOnce(true);
    const smartContracts = [
      { address: "0x0A", foo: "bar" },
      { address: "0x0B", foo: "bar" }
    ];
    const summary = await verifyIssued(
      { signature: { merkleRoot: "MERKLE_ROOT" } },
      smartContracts
    );
    expect(summary).toEqual({
      issuedOnAll: true,
      details: [
        { address: "0x0A", issued: true },
        { address: "0x0B", issued: true }
      ]
    });
    expect(isIssued.mock.calls).toEqual([
      [{ address: "0x0A", foo: "bar" }, "0xMERKLE_ROOT"],
      [{ address: "0x0B", foo: "bar" }, "0xMERKLE_ROOT"]
    ]);
  });

  it("returns invalid summary of the status if document is not issued on all smart contracts", async () => {
    isIssued.mockResolvedValueOnce(true);
    isIssued.mockResolvedValueOnce(false);
    const smartContracts = [
      { address: "0x0A", foo: "bar" },
      { address: "0x0B", foo: "bar" }
    ];
    const summary = await verifyIssued(
      { signature: { merkleRoot: "MERKLE_ROOT" } },
      smartContracts
    );
    expect(summary).toEqual({
      issuedOnAll: false,
      details: [
        { address: "0x0A", issued: true },
        { address: "0x0B", issued: false }
      ]
    });
    expect(isIssued.mock.calls).toEqual([
      [{ address: "0x0A", foo: "bar" }, "0xMERKLE_ROOT"],
      [{ address: "0x0B", foo: "bar" }, "0xMERKLE_ROOT"]
    ]);
  });
});
