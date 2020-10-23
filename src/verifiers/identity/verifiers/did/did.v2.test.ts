import { verify } from "./did";
import { documentDidSigned } from "../../../../../test/fixtures/v2/documentDidSigned";
import { documentDidWrongSignature } from "../../../../../test/fixtures/v2/documentDidWrongSignature";
import { documentDidMixedTokenRegistry } from "../../../../../test/fixtures/v2/documentDidMixedTokenRegistry";

describe("verify (v2)", () => {
  it("should pass for documents using `DID` and did signature is correct", async () => {
    const verificationFragment = await verify({ document: documentDidSigned, issuerIndex: 0 });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "identifier": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        "status": "VALID",
        "verifier": "OpenAttestationDidIdentityProof",
      }
    `);
  });
  it("should fail for documents using `DID` and did signature is not correct", async () => {
    const verificationFragment = await verify({ document: documentDidWrongSignature, issuerIndex: 0 });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "identifier": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        "status": "INVALID",
        "verifier": "OpenAttestationDidIdentityProof",
      }
    `);
  });
  it("should throw for other types of document", async () => {
    const verificationFragment = await verify({ document: documentDidMixedTokenRegistry, issuerIndex: 1 });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "reason": Object {
          "code": 1,
          "codeString": "UNEXPECTED_ERROR",
          "message": "Key is not present",
        },
        "status": "ERROR",
        "verifier": "OpenAttestationDidIdentityProof",
      }
    `);
  });
});
