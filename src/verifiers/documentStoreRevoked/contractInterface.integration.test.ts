import { constants } from "ethers";

import { isRevoked, isRevokedOnDocumentStore, isRevokedOnTokenRegistry } from "./contractInterface";
import {
  getDocumentStoreSmartContract,
  getTokenRegistrySmartContract
} from "../../common/smartContract/documentToSmartContracts";
import { documentRopstenRevokedWithToken } from "../../../test/fixtures/v2/documentRopstenRevokedWithToken";
import { documentRopstenRevokedWithDocumentStore } from "../../../test/fixtures/v2/documentRopstenRevokedWithDocumentStore";
import { documentRopstenWithNonDeployedDocumentStore } from "../../../test/fixtures/v2/documentRopstenWithNonDeployedDocumentStore";
import { documentRopstenValidWithToken } from "../../../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenValidWithCertificateStore } from "../../../test/fixtures/v2/documentRopstenValidWithCertificateStore";

const TOKEN_WITH_OWNER = "0x30cc3db1f2b26e25d63a67b6f232c4cf2acd1402f632847a4857e73516a0762f";
const TOKEN_WITH_SMART_CONTRACT = "0x30cc3db1f2b26e25d63a67b6f232c4cf2acd1402f632847a4857e73516a0762e";
const TOKEN_UNMINTED = constants.AddressZero;

describe("isRevokedOnTokenRegistry", () => {
  it("returns false if token has valid owner", async () => {
    const smartContract = getTokenRegistrySmartContract(documentRopstenRevokedWithToken, { network: "ropsten" });
    const issued = await isRevokedOnTokenRegistry(smartContract[0], TOKEN_WITH_OWNER);
    expect(issued).toBe(false);
  });

  it("returns true if owner of token is the smart contract itself", async () => {
    const smartContract = getTokenRegistrySmartContract(documentRopstenRevokedWithToken, { network: "ropsten" });
    const issued = await isRevokedOnTokenRegistry(smartContract[0], TOKEN_WITH_SMART_CONTRACT);
    expect(issued).toBe(true);
  });

  it("allow errors to bubble if token is not minted", async () => {
    const smartContract = getTokenRegistrySmartContract(documentRopstenRevokedWithToken, { network: "ropsten" });
    await expect(isRevokedOnTokenRegistry(smartContract[0], TOKEN_UNMINTED)).rejects.toThrow(
      'call revert exception (address="0x48399Fb88bcD031C556F53e93F690EEC07963Af3", args=["0x0000000000000000000000000000000000000000"], method="ownerOf(uint256)", errorSignature="Error(string)", errorArgs=[["ERC721: owner query for nonexistent token"]], reason=["ERC721: owner query for nonexistent token"], transaction={"to":{},"data":"0x6352211e0000000000000000000000000000000000000000000000000000000000000000"}, version=4.0.40)'
    );
  });
});

const DOCUMENT_REVOKED = "0x3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e452";
const DOCUMENT_UNREVOKED = "0x3d29524b18c3efe1cbad07e1ba9aa80c496cbf0b6255d6f331ca9b540e17e453";

describe("isRevokedOnDocumentStore", () => {
  it("returns true if document is revoked on documentStore", async () => {
    const smartContract = getDocumentStoreSmartContract(documentRopstenRevokedWithDocumentStore, {
      network: "ropsten"
    });
    const revoked = await isRevokedOnDocumentStore(smartContract[0], DOCUMENT_REVOKED);
    expect(revoked).toBe(true);
  });

  it("returns false if document is not issued on documentStore", async () => {
    const smartContract = getDocumentStoreSmartContract(documentRopstenRevokedWithDocumentStore, {
      network: "ropsten"
    });
    const issued = await isRevokedOnDocumentStore(smartContract[0], DOCUMENT_UNREVOKED);
    expect(issued).toBe(false);
  });

  it("allows error to bubble up if documentStore is not deployed", async () => {
    const smartContract = getDocumentStoreSmartContract(documentRopstenWithNonDeployedDocumentStore, {
      network: "ropsten"
    });
    await expect(isRevokedOnDocumentStore(smartContract[0], DOCUMENT_UNREVOKED)).rejects.toThrow(
      'contract not deployed (contractAddress="0x0000000000000000000000000000000000000000", operation="getDeployed", version=4.0.40)'
    );
  });
});

describe("isRevoked", () => {
  it("works for tokenRegistry", async () => {
    const smartContract = getTokenRegistrySmartContract(documentRopstenValidWithToken, { network: "ropsten" });
    const issued = await isRevoked(
      smartContract[0],
      "0x1b2c07f3d77078b44e65eae4c7f5d17fefaf0f73fb3f338fdb410912a8c4c4b7"
    );
    expect(issued).toBe(false);
  });

  it("works for documentStore", async () => {
    const smartContract = getDocumentStoreSmartContract(documentRopstenValidWithCertificateStore, {
      network: "ropsten"
    });
    const revoked = await isRevoked(smartContract[0], DOCUMENT_REVOKED);
    expect(revoked).toBe(true);
  });
});
