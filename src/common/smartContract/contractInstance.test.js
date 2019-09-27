const ethers = require("ethers");
const contractInstance = require("./contractInstance");

jest.mock("../../config", () => ({ INFURA_API_KEY: "INFURA_API_KEY" }));
jest.mock("ethers");

it("creates a ethers.Contract instance with the right provider", () => {
  contractInstance({
    abi: "ABI",
    network: "NETWORK",
    contractAddress: "0x0A"
  });

  expect(ethers.providers.InfuraProvider.mock.calls[0]).toEqual([
    "NETWORK",
    "INFURA_API_KEY"
  ]);

  expect(ethers.Contract.mock.calls[0][0]).toEqual("0x0A");
  expect(ethers.Contract.mock.calls[0][1]).toEqual("ABI");
});
