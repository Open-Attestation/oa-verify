const { constants } = require("ethers");
const {
  isRevokedOnTokenRegistry,
  isRevokedOnDocumentStore,
  isRevoked
} = require("./contractInterface");
const issuerToSmartContract = require("../common/smartContract/issuerToSmartContract");

const TOKEN_REGISTRY = "0x48399Fb88bcD031C556F53e93F690EEC07963Af3";
const TOKEN_WITH_OWNER =
  "0x30cc3db1f2b26e25d63a67b6f232c4cf2acd1402f632847a4857e73516a0762f";
const TOKEN_WITH_SMART_CONTRACT =
  "0x30cc3db1f2b26e25d63a67b6f232c4cf2acd1402f632847a4857e73516a0762e";
const TOKEN_UNMINTED = constants.AddressZero;

describe("isRevokedOnTokenRegistry", () => {
  it("returns false if token has valid owner", async () => {
    const smartContract = issuerToSmartContract(
      { tokenRegistry: TOKEN_REGISTRY },
      "ropsten"
    );
    const issued = await isRevokedOnTokenRegistry(
      smartContract,
      TOKEN_WITH_OWNER
    );
    expect(issued).toBe(false);
  });

  it("returns true if owner of token is the smart contract itself", async () => {
    const smartContract = issuerToSmartContract(
      { tokenRegistry: TOKEN_REGISTRY },
      "ropsten"
    );
    const issued = await isRevokedOnTokenRegistry(
      smartContract,
      TOKEN_WITH_SMART_CONTRACT
    );
    expect(issued).toBe(true);
  });

  it("returns true if token is not minted", async () => {
    const smartContract = issuerToSmartContract(
      { tokenRegistry: TOKEN_REGISTRY },
      "ropsten"
    );
    const issued = await isRevokedOnTokenRegistry(
      smartContract,
      TOKEN_UNMINTED
    );
    expect(issued).toBe(true);
  });
});

const DOCUMENT_STORE = "0x008486e2b14Cb1B5231DbA10B2170271af3196d6";
const DOCUMENT_REVOKED =
  "0x85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011a";
const DOCUMENT_UNREVOKED =
  "0x85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b";

describe("isRevokedOnDocumentStore", () => {
  it("returns true if document is revoked on documentStore", async () => {
    const smartContract = issuerToSmartContract(
      { documentStore: DOCUMENT_STORE },
      "ropsten"
    );
    const revoked = await isRevokedOnDocumentStore(
      smartContract,
      DOCUMENT_REVOKED
    );
    expect(revoked).toBe(true);
  });

  it("returns false if document is not issued on documentStore", async () => {
    const smartContract = issuerToSmartContract(
      { documentStore: DOCUMENT_STORE },
      "ropsten"
    );
    const issued = await isRevokedOnDocumentStore(
      smartContract,
      DOCUMENT_UNREVOKED
    );
    expect(issued).toBe(false);
  });
});

describe("isRevoked", () => {
  it("works for tokenRegistry", async () => {
    const smartContract = issuerToSmartContract(
      { tokenRegistry: TOKEN_REGISTRY },
      "ropsten"
    );
    const issued = await isRevoked(smartContract, TOKEN_WITH_OWNER);
    expect(issued).toBe(false);
  });

  it("works for documentStore", async () => {
    const smartContract = issuerToSmartContract(
      { documentStore: DOCUMENT_STORE },
      "ropsten"
    );
    const revoked = await isRevoked(smartContract, DOCUMENT_REVOKED);
    expect(revoked).toBe(true);
  });
});
