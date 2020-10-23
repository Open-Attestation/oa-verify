import { verify } from "./dnsDid";
import { documentDidSigned } from "../../../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidNoDnsTxt } from "../../../../../test/fixtures/v2/documentDnsDidNoDnsTxt";
import { documentDnsDidSigned } from "../../../../../test/fixtures/v2/documentDnsDidSigned";

describe("verify (v2)", () => {
  it("should pass for documents using `DID-DNS` and matching DNS record is present", async () => {
    const verificationFragment = await verify({ document: documentDnsDidSigned, issuerIndex: 0 });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        },
        "identifier": "example.tradetrust.io",
        "status": "VALID",
        "verifier": "OpenAttestationDnsDidIdentityProof",
      }
    `);
  });
  it("should fail for documents using `DID-DNS` but no DNS record", async () => {
    const verificationFragment = await verify({ document: documentDnsDidNoDnsTxt, issuerIndex: 0 });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        },
        "identifier": "example.com",
        "status": "INVALID",
        "verifier": "OpenAttestationDnsDidIdentityProof",
      }
    `);
  });
  it("should throw for other types of document", async () => {
    const verificationFragment = await verify({ document: documentDidSigned, issuerIndex: 0 });
    expect(verificationFragment).toMatchInlineSnapshot(`
      Object {
        "reason": Object {
          "code": 1,
          "codeString": "UNEXPECTED_ERROR",
          "message": "identity proof type must be DNS-DID",
        },
        "status": "ERROR",
        "verifier": "OpenAttestationDnsDidIdentityProof",
      }
    `);
  });
});
