import { Contract } from "ethers";
import { isRevoked } from "./contractInterface";
import {
  getIntermediateHashes,
  isAnyHashRevokedOnStore,
  isRevokedOnAny,
  revokedStatusOnContracts,
  verifyRevoked
} from "./verify";

jest.mock("./contractInterface");

beforeEach(() => {
  // @ts-ignore
  isRevoked.mockClear();
});

// @ts-ignore force contract creation
const contract: Contract = "CONTRACT_INSTANCE";

const TOKEN_REGISTRY_CONTRACT = {
  address: "0x0A",
  type: "TOKEN_REGISTRY",
  instance: contract
};

const DOCUMENT_STORE_CONTRACT = {
  address: "0x0B",
  type: "DOCUMENT_STORE",
  instance: contract
};

const INTERMEDIATE_HASHES = ["0x0a", "0x0b", "0x0c"];

describe("isAnyHashRevokedOnStore", () => {
  it("returns false if none of the hash are revoked", async () => {
    // @ts-ignore
    isRevoked.mockResolvedValue(false);
    const revoked = await isAnyHashRevokedOnStore(
      TOKEN_REGISTRY_CONTRACT,
      INTERMEDIATE_HASHES
    );
    expect(revoked).toBe(false);
  });

  it("returns true if any of the hashes is revoked", async () => {
    // @ts-ignore
    isRevoked.mockResolvedValueOnce(false);
    // @ts-ignore
    isRevoked.mockResolvedValueOnce(true);
    // @ts-ignore
    isRevoked.mockResolvedValueOnce(false);
    const revoked = await isAnyHashRevokedOnStore(
      TOKEN_REGISTRY_CONTRACT,
      INTERMEDIATE_HASHES
    );
    expect(revoked).toBe(true);
  });
});

describe("revokedStatusOnContracts", () => {
  it("returns a mapping of smart contract to revoke status", async () => {
    // @ts-ignore
    isRevoked.mockResolvedValue(false);
    const smartContracts = [TOKEN_REGISTRY_CONTRACT, DOCUMENT_STORE_CONTRACT];
    const revokedStatus = await revokedStatusOnContracts(
      smartContracts,
      INTERMEDIATE_HASHES
    );
    expect(revokedStatus).toEqual([
      { address: "0x0A", revoked: false },
      { address: "0x0B", revoked: false }
    ]);
    // @ts-ignore
    expect(isRevoked.mock.calls).toEqual([
      [
        {
          address: "0x0A",
          instance: "CONTRACT_INSTANCE",
          type: "TOKEN_REGISTRY"
        },
        "0x0a"
      ],
      [
        {
          address: "0x0A",
          instance: "CONTRACT_INSTANCE",
          type: "TOKEN_REGISTRY"
        },
        "0x0b"
      ],
      [
        {
          address: "0x0A",
          instance: "CONTRACT_INSTANCE",
          type: "TOKEN_REGISTRY"
        },
        "0x0c"
      ],
      [
        {
          address: "0x0B",
          instance: "CONTRACT_INSTANCE",
          type: "DOCUMENT_STORE"
        },
        "0x0a"
      ],
      [
        {
          address: "0x0B",
          instance: "CONTRACT_INSTANCE",
          type: "DOCUMENT_STORE"
        },
        "0x0b"
      ],
      [
        {
          address: "0x0B",
          instance: "CONTRACT_INSTANCE",
          type: "DOCUMENT_STORE"
        },
        "0x0c"
      ]
    ]);
  });

  it("should return empty array if no smart contract is provided", async () => {
    const revokedStatus = await revokedStatusOnContracts(
      [],
      INTERMEDIATE_HASHES
    );
    expect(revokedStatus).toEqual([]);
  });

  it("results includes error if contract call fails", async () => {
    // @ts-ignore
    isRevoked.mockResolvedValue(false);
    // @ts-ignore
    isRevoked.mockRejectedValueOnce(new Error("Some error"));
    const smartContracts = [TOKEN_REGISTRY_CONTRACT, DOCUMENT_STORE_CONTRACT];
    const revokedStatus = await revokedStatusOnContracts(
      smartContracts,
      INTERMEDIATE_HASHES
    );
    expect(revokedStatus).toEqual([
      { address: "0x0A", revoked: true, error: "Some error" },
      { address: "0x0B", revoked: false }
    ]);
  });
});

describe("isRevokedOnAny", () => {
  it("returns false if all of the revoke status is false", () => {
    const status = [
      { address: "0x0A", revoked: false },
      { address: "0x0B", revoked: false }
    ];
    expect(isRevokedOnAny(status)).toBe(false);
  });

  it("returns true if any of the revoke status is true", () => {
    const status = [
      { address: "0x0A", revoked: false },
      { address: "0x0B", revoked: true }
    ];
    expect(isRevokedOnAny(status)).toBe(true);
  });
});

describe("getIntermediateHashes", () => {
  it("returns array with single hash if no proof is present", () => {
    const targetHash =
      "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7";
    const expected = [
      "0xf7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7"
    ];

    expect(getIntermediateHashes(targetHash)).toEqual(expected);
    expect(getIntermediateHashes(targetHash, [])).toEqual(expected);
  });

  it("returns array of target hash, intermediate hashes up to merkle root when given target hash and proofs", () => {
    const targetHash =
      "f7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7";
    const proofs = [
      "2bb9dd186994f38084ee68e06be848b9d43077c307684c300d81df343c7858cf",
      "ed8bdba60a24af04bcdcd88b939251f3843e03839164fdd2dd502aaeef3bfb99"
    ];
    const expected = [
      "0xf7432b3219b2aa4122e289f44901830fa32f224ee9dfce28565677f1d279b2c7",
      "0xfe0958c4b90e768cecb50cea207f3af034580703e9ed74ef460c1a31dd1b4d6c",
      "0xfcfce0e79adc002c1fd78a2a02c768c0fdc00e5b96f1da8ef80bed02876e18d1"
    ];

    expect(getIntermediateHashes(targetHash, proofs)).toEqual(expected);
  });
});

describe("verifyRevoked", () => {
  it("returns valid summary of the status if document is not revoked on any smart contracts", async () => {
    // @ts-ignore
    isRevoked.mockResolvedValue(false);
    const smartContracts = [
      { address: "0x0A", type: "type", instance: contract, foo: "bar" },
      { address: "0x0B", type: "type", instance: contract, foo: "bar" }
    ];
    const summary = await verifyRevoked(
      {
        schema: "schema",
        data: "data",
        signature: {
          merkleRoot: "MERKLE_ROOT",
          type: "SHA3MerkleProof",
          targetHash: "0d",
          proof: ["0a"]
        }
      },
      smartContracts
    );
    expect(summary).toEqual({
      revokedOnAny: false,
      details: [
        { address: "0x0A", revoked: false },
        { address: "0x0B", revoked: false }
      ]
    });
    // @ts-ignore
    expect(isRevoked.mock.calls).toEqual([
      [
        { address: "0x0A", type: "type", instance: contract, foo: "bar" },
        "0x0d"
      ],
      [
        { address: "0x0A", type: "type", instance: contract, foo: "bar" },
        "0x96851128a70d034965e58c4ef4681d4ffcf60ba27322aa9015cf340f2b242e3d"
      ],
      [
        { address: "0x0B", type: "type", instance: contract, foo: "bar" },
        "0x0d"
      ],
      [
        { address: "0x0B", type: "type", instance: contract, foo: "bar" },
        "0x96851128a70d034965e58c4ef4681d4ffcf60ba27322aa9015cf340f2b242e3d"
      ]
    ]);
  });

  it("returns invalid summary of the status if document is revoked on any smart contracts", async () => {
    // @ts-ignore
    isRevoked.mockResolvedValueOnce(false);
    // @ts-ignore
    isRevoked.mockResolvedValueOnce(true);
    const smartContracts = [
      { address: "0x0A", type: "type", instance: contract, foo: "bar" },
      { address: "0x0B", type: "type", instance: contract, foo: "bar" }
    ];
    const summary = await verifyRevoked(
      {
        schema: "schema",
        data: "data",
        signature: {
          merkleRoot: "MERKLE_ROOT",
          type: "SHA3MerkleProof",
          targetHash: "0d",
          proof: []
        }
      },
      smartContracts
    );
    expect(summary).toEqual({
      revokedOnAny: true,
      details: [
        { address: "0x0A", revoked: false },
        { address: "0x0B", revoked: true }
      ]
    });
    // @ts-ignore
    expect(isRevoked.mock.calls).toEqual([
      [
        { address: "0x0A", type: "type", instance: contract, foo: "bar" },
        "0x0d"
      ],
      [
        { address: "0x0B", type: "type", instance: contract, foo: "bar" },
        "0x0d"
      ]
    ]);
  });
});
