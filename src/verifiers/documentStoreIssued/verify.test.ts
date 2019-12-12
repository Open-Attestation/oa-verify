import { Contract } from "ethers";
import { v3 } from "@govtechsg/open-attestation";
import { isIssuedOnAll, issuedStatusOnContracts, verifyIssued } from "./verify";
import { isIssued } from "./contractInterface";
import { OpenAttestationContract } from "../../types/core";

jest.mock("./contractInterface");

beforeEach(() => {
  // @ts-ignore
  isIssued.mockClear();
});

// @ts-ignore force contract creation
const contract: Contract = {};

describe("issuedStatusOnContracts", () => {
  it("returns issued status on all smart contracts provided", async () => {
    // @ts-ignore
    isIssued.mockResolvedValueOnce(true);
    // @ts-ignore
    isIssued.mockResolvedValueOnce(false);
    const smartContracts: OpenAttestationContract[] = [
      { address: "0x0A", type: v3.Method.DocumentStore, instance: contract },
      { address: "0x0B", type: v3.Method.DocumentStore, instance: contract }
    ];
    const issuedStatus = await issuedStatusOnContracts(smartContracts, "HASH");
    expect(issuedStatus).toEqual([
      { address: "0x0A", issued: true },
      { address: "0x0B", issued: false }
    ]);
  });

  it("throws if any smart contract call failed", async () => {
    // @ts-ignore
    isIssued.mockResolvedValueOnce(true);
    // @ts-ignore
    isIssued.mockRejectedValueOnce(new Error("Some failure"));
    const smartContracts: OpenAttestationContract[] = [
      { address: "0x0A", type: v3.Method.DocumentStore, instance: contract },
      { address: "0x0B", type: v3.Method.DocumentStore, instance: contract }
    ];

    const issuedStatus = await issuedStatusOnContracts(smartContracts, "HASH");
    expect(issuedStatus).toEqual([
      { address: "0x0A", issued: true },
      { address: "0x0B", issued: false, error: "Some failure" }
    ]);
  });
});

describe("isIssuedOnAll", () => {
  it("returns true if all the smart contract's issued status is true", () => {
    const status = [
      { address: "0x0A", issued: true },
      { address: "0x0B", issued: true }
    ];
    expect(isIssuedOnAll(status)).toBe(true);
  });

  it("returns false if no smart contract is present", () => {
    expect(isIssuedOnAll([])).toBe(false);
  });

  it("returns false if any issued status is false", () => {
    const contractWithStatus = [
      { address: "0x0A", issued: true },
      { address: "0x0B", issued: false }
    ];
    expect(isIssuedOnAll(contractWithStatus)).toBe(false);
  });
});

describe("verifyIssued", () => {
  it("returns valid summary of the status if document is issued on all smart contracts", async () => {
    // @ts-ignore
    isIssued.mockResolvedValueOnce(true);
    // @ts-ignore
    isIssued.mockResolvedValueOnce(true);
    const smartContracts: OpenAttestationContract[] = [
      { address: "0x0A", type: v3.Method.DocumentStore, instance: contract },
      { address: "0x0B", type: v3.Method.DocumentStore, instance: contract }
    ];
    const summary = await verifyIssued(
      {
        version: "version",
        schema: "schema",
        data: {
          issuers: []
        },
        signature: {
          merkleRoot: "MERKLE_ROOT",
          type: "SHA3MerkleProof",
          targetHash: "",
          proof: []
        }
      },
      smartContracts
    );
    expect(summary).toEqual({
      issuedOnAll: true,
      details: [
        { address: "0x0A", issued: true },
        { address: "0x0B", issued: true }
      ]
    });
    // @ts-ignore
    expect(isIssued.mock.calls).toEqual([
      [{ address: "0x0A", type: v3.Method.DocumentStore, instance: contract }, "0xMERKLE_ROOT"],
      [{ address: "0x0B", type: v3.Method.DocumentStore, instance: contract }, "0xMERKLE_ROOT"]
    ]);
  });

  it("returns invalid summary of the status if document is not issued on all smart contracts", async () => {
    // @ts-ignore
    isIssued.mockResolvedValueOnce(true);
    // @ts-ignore
    isIssued.mockResolvedValueOnce(false);
    const smartContracts: OpenAttestationContract[] = [
      { address: "0x0A", type: v3.Method.DocumentStore, instance: contract },
      { address: "0x0B", type: v3.Method.DocumentStore, instance: contract }
    ];
    const summary = await verifyIssued(
      {
        version: "version",
        schema: "schema",
        data: { issuers: [] },
        signature: {
          merkleRoot: "MERKLE_ROOT",
          type: "SHA3MerkleProof",
          targetHash: "",
          proof: []
        }
      },
      smartContracts
    );
    expect(summary).toEqual({
      issuedOnAll: false,
      details: [
        { address: "0x0A", issued: true },
        { address: "0x0B", issued: false }
      ]
    });
    // @ts-ignore
    expect(isIssued.mock.calls).toEqual([
      [{ address: "0x0A", type: v3.Method.DocumentStore, instance: contract }, "0xMERKLE_ROOT"],
      [{ address: "0x0B", type: v3.Method.DocumentStore, instance: contract }, "0xMERKLE_ROOT"]
    ]);
  });
});
