const { getData } = require("@govtechsg/open-attestation");
const documentStore = require("./documentStore");
const tokenRegistry = require("./tokenRegistry");

jest.mock("./documentStore");
jest.mock("./tokenRegistry");

// Given a list of issuers, convert to smart contract
const mapIssuersToSmartContracts = issuers =>
  issuers.map(issuer => {
    if (issuer.tokenRegistry) {
      return {
        type: "TOKEN_REGISTRY",
        address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
        instance: "<INSTANCE>"
      };
    } else if (issuer.certificateStore) {
      return {
        type: "DOCUMENT_STORE",
        address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
        instance: "<INSTANCE>"
      };
    } else if (issuer.documentStore) {
      return {
        type: "DOCUMENT_STORE",
        address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
        instance: "<INSTANCE>"
      };
    } else {
      throw new Error("Issuer does not have a smart contract");
    }
  });

it.only("works", () => {
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
  const output = [
    {
      type: "DOCUMENT_STORE",
      address: "0xc36484efa1544c32ffed2e80a1ea9f0dfc517495",
      instance: "<INSTANCE>"
    },
    {
      type: "TOKEN_REGISTRY",
      address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
      instance: "<INSTANCE>"
    }
  ];
  const result = mapIssuersToSmartContracts(issuers);

  console.log(result);
});
