import { getData, v2, v3, WrappedDocument, utils } from "@govtechsg/open-attestation";
import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { VerificationFragmentType, VerifierOptions, Verifier, VerificationFragment } from "../../../types/core";
import { OpenAttestationDnsTxtCode, Reason } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";

export interface ValidIdentity {
  status: "VALID";
  location: string;
  value: string;
}

export interface InvalidIdentity {
  status: "INVALID";
  location?: string;
  value?: string;
  reason: Reason;
}

export type Identity = ValidIdentity | InvalidIdentity;
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

// Resolve identity of an issuer, currently supporting only DNS-TXT
// DNS-TXT is explained => https://github.com/Open-Attestation/adr/blob/master/decentralized_identity_proof_DNS-TXT.md
const resolveIssuerIdentity = async (
  location: string,
  smartContractAddress: string,
  options: VerifierOptions
): Promise<Identity> => {
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

const name = "OpenAttestationDnsTxtIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";

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
  // Stricter check until isWrappedV2Document gives more accurate results
  if (utils.isWrappedV2Document(document) && document.data && document.data.issuers) {
    const documentData = getData(document);
    // at least one issuer uses DNS-TXT
    return documentData.issuers.some((issuer) => {
      return (
        (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore) &&
        issuer.identityProof?.type === v2.IdentityProofType.DNSTxt
      );
    });
  }
  if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.identityProof.type === v3.IdentityProofType.DNSTxt;
  }
  return false;
};

const verifyV2 = async (document: v2.WrappedDocument, options: VerifierOptions): Promise<VerificationFragment> => {
  const documentData = getData(document);
  const identities = await Promise.all(
    documentData.issuers.map((issuer) => {
      if (issuer.identityProof?.type === v2.IdentityProofType.DNSTxt) {
        const location = issuer.identityProof.location;
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
      const invalidResponse: Identity = {
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

  const invalidIdentity = identities.find((identity): identity is InvalidIdentity => identity.status !== "VALID");
  if (invalidIdentity) {
    return {
      name,
      type,
      data: identities,
      reason: invalidIdentity.reason,
      status: "INVALID",
    };
  }
  return {
    name,
    type,
    data: identities,
    status: "VALID",
  };
};

const verifyV3 = async (document: v3.WrappedDocument, options: VerifierOptions): Promise<VerificationFragment> => {
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

  return {
    name,
    type,
    data: {
      identifier: issuerIdentity.location,
      value: issuerIdentity.value,
      ...(issuerIdentity.status === "INVALID" ? { reason: issuerIdentity.reason } : {}),
    },
    status: issuerIdentity.status,
  };
};

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document, options) => {
    if (utils.isWrappedV2Document(document)) return verifyV2(document, options);
    if (utils.isWrappedV3Document(document)) return verifyV3(document, options);
    throw new CodedError(
      "Unrecognized document",
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
);

export const openAttestationDnsTxtIdentityProof: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>,
  VerifierOptions,
  Identity | Identity[]
> = {
  skip,
  test,
  verify,
};
