const documentStore = require("./documentStore");

describe("documentStoreApi(integration)", () => {
  it("should reject if the contract is not deployed", async () => {
    await expect(
      documentStore({
        storeAddress: "0x0000000000000000000000000000000000000000",
        method: "isIssued",
        args: [
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ]
      })
    ).to.eventually.be.rejectedWith("contract not deployed");
  }).timeout(10000);

  it("should reject for args not conforming to ABI", async () => {
    await expect(
      documentStore({
        storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
        method: "isIssued",
        args: ["0000"]
      })
    ).to.eventually.be.rejectedWith("invalid input argument");
  }).timeout(10000);

  it("should reject for undefined function", async () => {
    await expect(
      documentStore({
        storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
        method: "foobar",
        args: [
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ]
      })
    ).to.eventually.be.rejectedWith(
      "contract.functions[method] is not a function"
    );
  }).timeout(10000);

  it("should works for isIssued", async () => {
    const issuedStatus = await documentStore({
      storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      method: "isIssued",
      args: [
        "0x1a040999254caaf7a33cba67ec6a9b862da1dacf8a0d1e3bb76347060fc615d6"
      ]
    });
    expect(issuedStatus).to.be.eql(true);

    const notIssuedStatus = await documentStore({
      storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      method: "isIssued",
      args: [
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ]
    });
    expect(notIssuedStatus).to.be.eql(false);
  }).timeout(20000);

  it("should works for isRevoked", async () => {
    const revokedStatus = await documentStore({
      storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      method: "isRevoked",
      args: [
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
    });
    expect(revokedStatus).to.be.eql(true);

    const notRevokedStatus = await documentStore({
      storeAddress: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      method: "isRevoked",
      args: [
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ]
    });
    expect(notRevokedStatus).to.be.eql(false);
  }).timeout(20000);
});
