import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidSignedDocumentStatusCode } from "../../../types/error";

const name = "OpenAttestationDidSignedDocumentStatus";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDidSignedDocumentStatusCode.SKIPPED,
      codeString: OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.SKIPPED],
      message: `Document was not signed by DID directly`,
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

export const OpenAttestationDidSignedDocumentStatus: VerifierType = {
  skip,
  test,
  verify,
};
