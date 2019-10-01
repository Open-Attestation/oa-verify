/**
 * @jest-environment node
 */
import { documentStore } from "./documentStore";

describe("documentStoreApi(integration)", () => {
  it("should reject if the contract is not deployed", async () => {
    await expect(
      documentStore({
        storeAddress: "0x0000000000000000000000000000000000000000",
        method: "isIssued",
        args: [
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ],
        network: "homestead"
      })
    ).rejects.toThrow("contract not deployed");
  });

  it("should reject for args not conforming to ABI", async () => {
    await expect(
      documentStore({
        storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
        method: "isIssued",
        args: ["0000"],
        network: "homestead"
      })
    ).rejects.toThrow("invalid input argument");
  });

  it("should reject for undefined function", async () => {
    await expect(
      documentStore({
        storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
        method: "foobar",
        args: [
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ],
        network: "homestead"
      })
    ).rejects.toThrow("Cannot read property 'apply' of undefined");
  });

  it("should works for isIssued", async () => {
    const issuedStatus = await documentStore({
      storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      method: "isIssued",
      args: [
        "0x1a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6"
      ],
      network: "homestead"
    });
    expect(issuedStatus).toBe(true);

    const notIssuedStatus = await documentStore({
      storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      method: "isIssued",
      args: [
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      network: "homestead"
    });
    expect(notIssuedStatus).toBe(false);
  });

  it("should works for isRevoked", async () => {
    const revokedStatus = await documentStore({
      storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      method: "isRevoked",
      args: [
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ],
      network: "homestead"
    });
    expect(revokedStatus).toBe(true);

    const notRevokedStatus = await documentStore({
      storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      method: "isRevoked",
      args: [
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      network: "homestead"
    });
    expect(notRevokedStatus).toBe(false);
  });
});
