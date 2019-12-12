import { constants } from "ethers";
import { isIssued, isIssuedOnDocumentStore, isIssuedOnTokenRegistry } from "./contractInterface";
import {
  getDocumentStoreSmartContract,
  getTokenRegistrySmartContract
} from "../../common/smartContract/documentToSmartContracts";
import { documentRopstenRevokedWithToken } from "../../../test/fixtures/v2/documentRopstenRevokedWithToken";
import { documentRopstenValidWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenWithNonDeployedDocumentStore } from "../../../test/fixtures/v2/documentRopstenWithNonDeployedDocumentStore";
import { documentRopstenValidWithToken } from "../../../test/fixtures/v2/documentRopstenValidWithToken";

describe("isIssuedOnTokenRegistry", () => {
  it("returns true if token is created on tokenRegistry", async () => {
    const smartContract = getTokenRegistrySmartContract(documentRopstenRevokedWithToken, { network: "ropsten" });
    const issued = await isIssuedOnTokenRegistry(
      smartContract[0],
      "0x30cc3db1f2b26e25d63a67b6f232c4cf2acd1402f632847a4857e73516a0762f"
    );
    expect(issued).toBe(true);
  });

  it("allows error to bubble if token is nonexistent on tokenRegistry", async () => {
    const smartContract = getTokenRegistrySmartContract(documentRopstenRevokedWithToken, { network: "ropsten" });
    await expect(isIssuedOnTokenRegistry(smartContract[0], constants.HashZero)).rejects.toThrow(
      'call revert exception (address="0x48399Fb88bcD031C556F53e93F690EEC07963Af3", args=["0x0000000000000000000000000000000000000000000000000000000000000000"], method="ownerOf(uint256)", errorSignature="Error(string)", errorArgs=[["ERC721: owner query for nonexistent token"]], reason=["ERC721: owner query for nonexistent token"], transaction={"to":{},"data":"0x6352211e0000000000000000000000000000000000000000000000000000000000000000"}, version=4.0.40)'
    );
  });
});

describe("isIssuedOnDocumentStore", () => {
  it("returns true if document is issued on documentStore", async () => {
    const smartContract = getDocumentStoreSmartContract(documentRopstenValidWithCertificateStore, {
      network: "ropsten"
    });
    const issued = await isIssuedOnDocumentStore(
      smartContract[0],
      "0x55609b30ae4182bc8621d398b5a8e50ec4dfca4dbce4719bef82f8041829bf23"
    );
    expect(issued).toBe(true);
  });

  it("returns false if document is not issued on documentStore", async () => {
    const smartContract = getDocumentStoreSmartContract(documentRopstenValidWithCertificateStore, {
      network: "ropsten"
    });
    const issued = await isIssuedOnDocumentStore(smartContract[0], constants.HashZero);
    expect(issued).toBe(false);
  });

  it("allows error to bubble if documentStore is not deployed", async () => {
    const smartContract = getDocumentStoreSmartContract(documentRopstenWithNonDeployedDocumentStore, {
      network: "ropsten"
    });
    await expect(isIssuedOnDocumentStore(smartContract[0], constants.HashZero)).rejects.toThrow(
      'contract not deployed (contractAddress="0x0000000000000000000000000000000000000000", operation="getDeployed", version=4.0.40)'
    );
  });
});

describe("isIssued", () => {
  it("works for tokenRegistry", async () => {
    const smartContract = getTokenRegistrySmartContract(documentRopstenValidWithToken, { network: "ropsten" });
    const issued = await isIssued(
      smartContract[0],
      "0x1b2c07f3d77078b44e65eae4c7f5d17fefaf0f73fb3f338fdb410912a8c4c4b7"
    );
    expect(issued).toBe(true);
  });

  it("works for documentStore", async () => {
    const smartContract = getDocumentStoreSmartContract(documentRopstenValidWithCertificateStore, {
      network: "ropsten"
    });
    const issued = await isIssued(
      smartContract[0],
      "0x55609b30ae4182bc8621d398b5a8e50ec4dfca4dbce4719bef82f8041829bf23"
    );
    expect(issued).toBe(true);
  });

  it("throws for unsupported smart contract types", () => {
    const smartContract = { type: "UNSUPPORTED_TYPE" };
    // @ts-ignore
    expect(() => isIssued(smartContract, constants.HashZero)).toThrow("Smart contract type not supported");
  });
});
