import { issuerIdentityVerifierBuilder, IssuerIdentityVerifier, IssuerIdentityVerifierDefinition } from "./builder";

const mockVerify: IssuerIdentityVerifier = () => {
  return Promise.resolve({
    verifier: "MOCK_VERIFIER",
    identifier: "DID:METHOD:IDENTIFIER",
    status: "VALID",
  });
};

const mockVerifyDef: IssuerIdentityVerifierDefinition = {
  type: "MOCK_TYPE",
  verify: mockVerify,
};

describe("issuerIdentityVerifierBuilder", () => {
  it("should build a verifier with the right functions", () => {
    const verifier = issuerIdentityVerifierBuilder([mockVerifyDef]);
    expect(verifier.test).toBeTruthy();
    expect(verifier.skip).toBeTruthy();
    expect(verifier.verify).toBeTruthy();
  });
  it("should run for all documents", () => {
    const verifier = issuerIdentityVerifierBuilder([mockVerifyDef]);
    expect(verifier.test({} as any, {} as any)).toBe(true);
  });
  it("should return the correct skip message", async () => {
    const verifier = issuerIdentityVerifierBuilder([mockVerifyDef]);
    expect(await verifier.skip({} as any, {} as any)).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationIssuerIdentityVerifier",
        "reason": Object {
          "code": 0,
          "codeString": "SKIPPED",
          "message": "Verification of issuers' identity skipped",
        },
        "status": "SKIPPED",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
});
