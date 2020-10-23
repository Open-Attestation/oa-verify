import { v2, v3, WrappedDocument, utils, getData } from "@govtechsg/open-attestation";
import {
  VerificationFragmentType,
  Verifier,
  SkippedVerificationFragment,
  IssuerIdentityVerifier,
  IssuerIdentityVerifierDefinition,
} from "../../types/core";
import { OpenAttestationIssuerIdentityVerifierCode } from "../../types/error";

const name = "OpenAttestationIssuerIdentityVerifier";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skipFragment: SkippedVerificationFragment = {
  status: "SKIPPED",
  type,
  name,
  reason: {
    code: OpenAttestationIssuerIdentityVerifierCode.SKIPPED,
    codeString: OpenAttestationIssuerIdentityVerifierCode[OpenAttestationIssuerIdentityVerifierCode.SKIPPED],
    message: `Verification of issuers' identity skipped`,
  },
};

const defaultVerifier: IssuerIdentityVerifier = async ({ issuerIndex }) => {
  return {
    verifier: "SKIPPED_VERIFIER",
    status: "SKIPPED",
    reason: {
      code: OpenAttestationIssuerIdentityVerifierCode.SKIPPED,
      codeString: OpenAttestationIssuerIdentityVerifierCode[OpenAttestationIssuerIdentityVerifierCode.SKIPPED],
      message: `No verifier found for issuer ${issuerIndex}`,
    },
  };
};

export const issuerIdentityVerifierBuilder = (verifiers: IssuerIdentityVerifierDefinition[]): VerifierType => {
  const registeredVerifiers: { [identityProofType: string]: IssuerIdentityVerifier } = {};
  verifiers.forEach((verifier) => {
    if (registeredVerifiers[verifier.type])
      throw new Error(`Cannot register verifier to a type ${verifier.type} which has existing verifier assigned`);
    registeredVerifiers[verifier.type] = verifier.verify;
  });

  const getVerifier = (identityProofType: string): IssuerIdentityVerifier =>
    registeredVerifiers[identityProofType] || defaultVerifier;
  const skip: VerifierType["skip"] = async () => skipFragment;
  const test: VerifierType["test"] = () => true;

  const verify: VerifierType["verify"] = async (document, options) => {
    try {
      if (utils.isWrappedV3Document(document)) {
        const documentData = getData(document);
        const verifier = getVerifier(documentData.issuer.identityProof.type);
        const verificationResults = await verifier({ document, issuerIndex: undefined, options });
        return {
          name,
          type,
          data: verificationResults,
          status: verificationResults.status,
        };
      }
      if (utils.isWrappedV2Document(document)) {
        const documentData = getData(document);
        const verificationResultsDeferred = documentData.issuers.map((issuer, issuerIndex) => {
          const identityProofType = issuer.identityProof?.type;
          if (!identityProofType) throw new Error("");
          const verifier = getVerifier(identityProofType);
          return verifier({ document, issuerIndex, options });
        });
        const verificationResults = await Promise.all(verificationResultsDeferred);
        const overallStatus =
          verificationResults.every((result) => result.status === "VALID") && verificationResults.length > 0
            ? "VALID"
            : "INVALID";
        return {
          name,
          type,
          data: verificationResults,
          status: overallStatus,
        };
      }
      return {
        name,
        type,
        status: "INVALID",
        reason: {
          code: OpenAttestationIssuerIdentityVerifierCode.UNEXPECTED_DOCUMENT_FORMAT,
          codeString:
            OpenAttestationIssuerIdentityVerifierCode[
              OpenAttestationIssuerIdentityVerifierCode.UNEXPECTED_DOCUMENT_FORMAT
            ],
          message: `Document format is unexpected`,
        },
      };
    } catch (e) {
      return {
        name,
        type,
        data: e,
        reason: {
          message: e.message,
          code: e.code || OpenAttestationIssuerIdentityVerifierCode.UNEXPECTED_ERROR,
          codeString:
            e.codeString ||
            OpenAttestationIssuerIdentityVerifierCode[OpenAttestationIssuerIdentityVerifierCode.UNEXPECTED_ERROR],
        },
        status: "ERROR",
      };
    }
  };

  return {
    skip,
    test,
    verify,
  };
};
