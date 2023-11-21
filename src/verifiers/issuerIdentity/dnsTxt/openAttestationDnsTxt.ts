import { getData, utils, v2, v3 } from "@tradetrust-tt/tradetrust";
import { getDocumentStoreRecords } from "@tradetrust-tt/dnsprove";
import { VerificationFragmentType, Verifier, VerifierOptions } from "../../../types/core";
import { OpenAttestationDnsTxtCode } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";
import {
  DnsTxtVerificationStatus,
  InvalidDnsTxtVerificationStatus,
  OpenAttestationDnsTxtIdentityProofInvalidFragmentV2,
  OpenAttestationDnsTxtIdentityProofInvalidFragmentV3,
  OpenAttestationDnsTxtIdentityProofValidFragmentV2,
  OpenAttestationDnsTxtIdentityProofValidFragmentV3,
  OpenAttestationDnsTxtIdentityProofVerificationFragment,
  ValidDnsTxtVerificationStatus,
  ValidDnsTxtVerificationStatusArray,
} from "./openAttestationDnsTxt.type";

const name = "OpenAttestationDnsTxtIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<OpenAttestationDnsTxtIdentityProofVerificationFragment>;

// Resolve identity of an issuer, currently supporting only DNS-TXT
// DNS-TXT is explained => https://github.com/Open-Attestation/adr/blob/master/decentralized_identity_proof_DNS-TXT.md
const resolveIssuerIdentity = async (
  location: string,
  smartContractAddress: string,
  options: VerifierOptions
): Promise<DnsTxtVerificationStatus> => {
  const network = await options.provider.getNetwork();
  const records = await getDocumentStoreRecords(location);
  const matchingRecord = records.find(
    (record) =>
      record.addr.toLowerCase() === smartContractAddress.toLowerCase() &&
      record.netId === network.chainId.toString(10) &&
      record.type === "openatts" &&
      record.net === "ethereum"
  );
  return matchingRecord
    ? {
        status: "VALID",
        location,
        value: smartContractAddress,
      }
    : {
        status: "INVALID",
        location,
        value: smartContractAddress,
        reason: {
          message: `Matching DNS record not found for ${smartContractAddress}`,
          code: OpenAttestationDnsTxtCode.MATCHING_RECORD_NOT_FOUND,
          codeString: OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.MATCHING_RECORD_NOT_FOUND],
        },
      };
};

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDnsTxtCode.SKIPPED,
      codeString: OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.SKIPPED],
      message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use ${v3.IdentityProofType.DNSTxt} type`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  if (utils.isWrappedV2Document(document)) {
    const documentData = getData(document);
    // at least one issuer uses DNS-TXT
    return documentData.issuers.some((issuer) => {
      return (
        (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore) &&
        issuer.identityProof?.type === v2.IdentityProofType.DNSTxt
      );
    });
  } else if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.identityProof.type === v3.IdentityProofType.DNSTxt;
  }
  return false;
};

const verifyV2 = async (
  document: v2.WrappedDocument,
  options: VerifierOptions
): Promise<OpenAttestationDnsTxtIdentityProofValidFragmentV2 | OpenAttestationDnsTxtIdentityProofInvalidFragmentV2> => {
  const documentData = getData(document);
  const identities = await Promise.all(
    documentData.issuers.map((issuer) => {
      if (issuer.identityProof?.type === v2.IdentityProofType.DNSTxt) {
        const { location } = issuer.identityProof;
        const smartContractAddress = issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore;

        if (!location)
          throw new CodedError(
            "Location not found in identity proof",
            OpenAttestationDnsTxtCode.INVALID_ISSUERS,
            OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.INVALID_ISSUERS]
          );

        if (!smartContractAddress)
          throw new CodedError(
            "Smart contract address not found in identity proof",
            OpenAttestationDnsTxtCode.INVALID_ISSUERS,
            OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.INVALID_ISSUERS]
          );
        return resolveIssuerIdentity(location, smartContractAddress, options);
      }
      const invalidResponse: InvalidDnsTxtVerificationStatus = {
        status: "INVALID",
        reason: {
          message: "Issuer is not using DNS-TXT identityProof type",
          code: OpenAttestationDnsTxtCode.INVALID_ISSUERS,
          codeString: OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.INVALID_ISSUERS],
        },
      };
      return invalidResponse; // eslint is happy, so am I (https://github.com/bradzacher/eslint-plugin-typescript/blob/master/docs/rules/no-object-literal-type-assertion.md)
    })
  );

  if (ValidDnsTxtVerificationStatusArray.guard(identities)) {
    return {
      name,
      type,
      data: identities,
      status: "VALID",
    };
  }

  const invalidIdentity = identities.find(InvalidDnsTxtVerificationStatus.guard);
  if (InvalidDnsTxtVerificationStatus.guard(invalidIdentity)) {
    return {
      name,
      type,
      data: identities,
      reason: invalidIdentity.reason,
      status: "INVALID",
    };
  }
  throw new CodedError(
    "Unable to retrieve the reason of the failure",
    OpenAttestationDnsTxtCode.UNEXPECTED_ERROR,
    "UNEXPECTED_ERROR"
  );
};

const verifyV3 = async (
  document: v3.WrappedDocument,
  options: VerifierOptions
): Promise<OpenAttestationDnsTxtIdentityProofValidFragmentV3 | OpenAttestationDnsTxtIdentityProofInvalidFragmentV3> => {
  if (
    document.openAttestationMetadata.proof.method !== v3.Method.DocumentStore &&
    document.openAttestationMetadata.proof.method !== v3.Method.TokenRegistry
  )
    throw new CodedError(
      "DNS-TXT is only supported with documents issued using document store or token registry",
      OpenAttestationDnsTxtCode.UNSUPPORTED,
      OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.UNSUPPORTED]
    );
  const smartContractAddress = document.openAttestationMetadata.proof.value;
  const { identifier } = document.openAttestationMetadata.identityProof;
  const issuerIdentity = await resolveIssuerIdentity(identifier, smartContractAddress, options);

  if (ValidDnsTxtVerificationStatus.guard(issuerIdentity)) {
    return {
      name,
      type,
      data: {
        identifier: issuerIdentity.location,
        value: issuerIdentity.value,
      },
      status: "VALID",
    };
  }
  return {
    name,
    type,
    data: {
      identifier: issuerIdentity.location,
      value: issuerIdentity.value,
    },
    reason: issuerIdentity.reason,
    status: "INVALID",
  };
};

export const openAttestationDnsTxtIdentityProof: Verifier<OpenAttestationDnsTxtIdentityProofVerificationFragment> = {
  skip,
  test,
  verify: withCodedErrorHandler(
    async (document, options) => {
      if (utils.isWrappedV2Document(document)) return verifyV2(document, options);
      else if (utils.isWrappedV3Document(document)) return verifyV3(document, options);
      // this code is actually unreachable because of the test function
      throw new CodedError(
        "Document does not match either v2 or v3 formats",
        OpenAttestationDnsTxtCode.UNRECOGNIZED_DOCUMENT,
        OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.UNRECOGNIZED_DOCUMENT]
      );
    },
    {
      name,
      type,
      unexpectedErrorCode: OpenAttestationDnsTxtCode.UNEXPECTED_ERROR,
      unexpectedErrorString: OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.UNEXPECTED_ERROR],
    }
  ),
};
