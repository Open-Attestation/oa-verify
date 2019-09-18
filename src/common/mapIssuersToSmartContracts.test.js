const mapIssuersToSmartContracts = require("./mapIssuersToSmartContracts");

jest.mock("./contractInstance", () => () => "CONTRACT_INSTANCE");

it("mapIssuersToSmartContracts maps issuer to respective smart contract base on keys for smart contract", () => {
  const issuers = [
    {
      name: "Org A",
      certificateStore: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495"
    },
    {
      name: "Org B",
      tokenRegistry: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3"
    }
  ];
  const exepectedOutput = [
    {
      type: "DOCUMENT_STORE",
      address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
      instance: "CONTRACT_INSTANCE"
    },
    {
      type: "TOKEN_REGISTRY",
      address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
      instance: "CONTRACT_INSTANCE"
    }
  ];
  const result = mapIssuersToSmartContracts(issuers);
  expect(result).toEqual(exepectedOutput);
});
