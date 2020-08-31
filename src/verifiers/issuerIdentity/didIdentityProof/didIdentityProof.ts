import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidSignedDidIdentityProofCode } from "../../../types/error";

const name = "OpenAttestationDidSignedDidIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDidSignedDidIdentityProofCode.SKIPPED,
      codeString: OpenAttestationDidSignedDidIdentityProofCode[OpenAttestationDidSignedDidIdentityProofCode.SKIPPED],
      message: `Document is not using DID as top level identifier`,
    },
  };
};

const test: VerifierType["test"] = (_document) => {
  return true;
};

const verify: VerifierType["verify"] = async (_document, _option) => {
  return {
    name,
    type,
    data: {},
    status: "VALID",
  };
};

export const OpenAttestationDidSignedDidIdentityProof: VerifierType = {
  skip,
  test,
  verify,
};
