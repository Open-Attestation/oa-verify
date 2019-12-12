import * as ethers from "ethers";
import { contractInstance } from "./contractInstance";

jest.mock("../../config", () => ({ INFURA_API_KEY: "INFURA_API_KEY" }));
jest.mock("ethers");

it("creates a ethers.Contract instance with the right provider", () => {
  contractInstance({
    abi: "ABI",
    network: "NETWORK",
    contractAddress: "0x0A"
  });

  // @ts-ignore
  expect(ethers.providers.InfuraProvider.mock.calls[0]).toEqual(["NETWORK", "INFURA_API_KEY"]);

  // @ts-ignore
  expect(ethers.Contract.mock.calls[0][0]).toEqual("0x0A");
  // @ts-ignore
  expect(ethers.Contract.mock.calls[0][1]).toEqual("ABI");
});
