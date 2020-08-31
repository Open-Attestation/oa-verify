import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDnsDidCode } from "../../../types/error";

const name = "OpenAttestationDnsDid";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDnsDidCode.SKIPPED,
      codeString: OpenAttestationDnsDidCode[OpenAttestationDnsDidCode.SKIPPED],
      message: `Document is not using DNS as top level identifier with DID as intermediate identifier`,
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

export const OpenAttestationDnsDid: VerifierType = {
  skip,
  test,
  verify,
};
