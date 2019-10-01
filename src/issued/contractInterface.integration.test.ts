import { constants } from "ethers";
import {
  isIssued,
  isIssuedOnDocumentStore,
  isIssuedOnTokenRegistry
} from "./contractInterface";
import { issuerToSmartContract } from "../common/smartContract/issuerToSmartContract";

describe("isIssuedOnTokenRegistry", () => {
  it("returns true if token is created on tokenRegistry", async () => {
    const smartContract = issuerToSmartContract(
      { tokenRegistry: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3" },
      "ropsten"
    );
    const issued = await isIssuedOnTokenRegistry(
      smartContract,
      "0x30cc3db1f2b26e25d63a67b6f232c4cf2acd1402f632847a4857e73516a0762f"
    );
    expect(issued).toBe(true);
  });

  it("allows error to bubble if token is nonexistent on tokenRegistry", async () => {
    const smartContract = issuerToSmartContract(
      { tokenRegistry: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3" },
      "ropsten"
    );
    await expect(
      isIssuedOnTokenRegistry(smartContract, constants.HashZero)
    ).rejects.toThrow();
  });
});

describe("isIssuedOnDocumentStore", () => {
  it("returns true if document is issued on documentStore", async () => {
    const smartContract = issuerToSmartContract(
      { documentStore: "0x008486e2b14Cb1B5231DbA10B2170271af3196d6" },
      "ropsten"
    );
    const issued = await isIssuedOnDocumentStore(
      smartContract,
      "0x85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b"
    );
    expect(issued).toBe(true);
  });

  it("returns false if document is not issued on documentStore", async () => {
    const hash = constants.HashZero;
    const smartContract = issuerToSmartContract(
      { documentStore: "0x008486e2b14Cb1B5231DbA10B2170271af3196d6" },
      "ropsten"
    );
    const issued = await isIssuedOnDocumentStore(smartContract, hash);
    expect(issued).toBe(false);
  });

  it("allows error to bubble if documentStore is not deployed", async () => {
    const smartContract = issuerToSmartContract(
      { documentStore: constants.AddressZero },
      "ropsten"
    );
    await expect(
      isIssuedOnDocumentStore(smartContract, constants.HashZero)
    ).rejects.toThrow();
  });
});

describe("isIssued", () => {
  it("works for tokenRegistry", async () => {
    const smartContract = issuerToSmartContract(
      { tokenRegistry: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3" },
      "ropsten"
    );
    const hash =
      "0x30cc3db1f2b26e25d63a67b6f232c4cf2acd1402f632847a4857e73516a0762f";
    const issued = await isIssued(smartContract, hash);
    expect(issued).toBe(true);
  });

  it("works for documentStore", async () => {
    const hash =
      "0x85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b";
    const smartContract = issuerToSmartContract(
      { documentStore: "0x008486e2b14Cb1B5231DbA10B2170271af3196d6" },
      "ropsten"
    );
    const issued = await isIssued(smartContract, hash);
    expect(issued).toBe(true);
  });

  it("throws for unsupported smart contract types", () => {
    const smartContract = { type: "UNSUPPORTED_TYPE" };
    // @ts-ignore
    expect(() => isIssued(smartContract, constants.HashZero)).toThrow(
      "Smart contract type not supported"
    );
  });
});
