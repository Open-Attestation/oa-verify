import { providers } from "ethers";
import { documentHederaValidWithDocumentStore } from "../../../../test/fixtures/v2/documentHederaValidWithDocumentStore";
import { openAttestationDnsTxtIdentityProof } from "./openAttestationDnsTxt";

class CustomJsonRpcProvider extends providers.JsonRpcProvider {
  async detectNetwork() {
    return {
      name: "hedera",
      chainId: 296,
    };
  }
}

const provider = new CustomJsonRpcProvider("https://testnet-public.mirrornode.hedera.com");

// Construct the options object with the provider
const options = {
  network: "hedera",
  provider: provider,
};

jest.mock("ethers", () => {
  const originalModule = jest.requireActual("ethers");
  return {
    ...originalModule,
    providers: {
      ...originalModule.providers,
      JsonRpcProvider: class extends originalModule.providers.JsonRpcProvider {
        async detectNetwork() {
          return {
            name: "hedera",
            chainId: 296,
          };
        }
      },
    },
  };
});

describe("verify", () => {
  describe("v2", () => {
    it("should return a valid fragment when document has valid identity and uses document store", async () => {
      const fragment = await openAttestationDnsTxtIdentityProof.verify(documentHederaValidWithDocumentStore, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Array [
            Object {
              "location": "trustlv.org",
              "status": "VALID",
              "value": "0x222B69788e2e9B7FB93a3a0fE258D4604Dc7df21",
            },
          ],
          "name": "OpenAttestationDnsTxtIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
  });
});
