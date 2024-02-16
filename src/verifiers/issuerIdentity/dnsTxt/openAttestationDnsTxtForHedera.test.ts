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
                "value": "0x3DE43bfd3D771931E46CbBd4EDE0D3d95C85f81A",
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
