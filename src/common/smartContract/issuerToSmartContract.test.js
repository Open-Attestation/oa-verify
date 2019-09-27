const issuerToSmartContract = require("./issuerToSmartContract");

jest.mock("./contractInstance", () => () => "CONTRACT_INSTANCE");

it("maps issuer with certificateStore to documentStore contract", () => {
  const issuer = {
    name: "Org A",
    certificateStore: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495"
  };
  const result = issuerToSmartContract(issuer);
  expect(result).toEqual({
    type: "DOCUMENT_STORE",
    address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
    instance: "CONTRACT_INSTANCE"
  });
});

it("maps issuer with documentStore to documentStore contract", () => {
  const issuer = {
    name: "Org A",
    documentStore: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495"
  };
  const result = issuerToSmartContract(issuer);
  expect(result).toEqual({
    type: "DOCUMENT_STORE",
    address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
    instance: "CONTRACT_INSTANCE"
  });
});

it("maps issuer with tokenRegistry to tokenRegistry contract", () => {
  const issuer = {
    name: "Org A",
    tokenRegistry: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495"
  };
  const result = issuerToSmartContract(issuer);
  expect(result).toEqual({
    type: "TOKEN_REGISTRY",
    address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
    instance: "CONTRACT_INSTANCE"
  });
});

it("throws if the issuer does not have a valid smart contract address defined", () => {
  const issuer = {
    name: "Org A",
    foo: "bar"
  };
  expect(() => issuerToSmartContract(issuer)).toThrow(
    "Issuer does not have a smart contract"
  );
});
