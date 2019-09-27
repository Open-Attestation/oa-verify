const documentToSmartContracts = require("./documentToSmartContracts");
const issuerToSmartContract = require("./issuerToSmartContract");
const sampleDocument = require("../../../test/fixtures/document.json");

jest.mock("./issuerToSmartContract");

it("returns an array of smart contract resolved from the issuers of the document", () => {
  const network = "ropsten";
  const expectedValue = [
    {
      type: "DOCUMENT_STORE",
      address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
      instance: "DOCUMENT_STORE_INSTANCE"
    }
  ];
  issuerToSmartContract.mockReturnValue(expectedValue[0]);
  const results = documentToSmartContracts(sampleDocument, network);
  expect(issuerToSmartContract.mock.calls[0]).toEqual([
    {
      name: "Singapore Examination and Assessment Board",
      url: "https://www.seab.gov.sg/",
      certificateStore: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990"
    },
    network
  ]);
  expect(results).toEqual(expectedValue);
});
