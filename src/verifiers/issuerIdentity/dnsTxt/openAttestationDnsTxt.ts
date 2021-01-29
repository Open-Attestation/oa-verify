import { getData, v2, v3, WrappedDocument, utils } from "@govtechsg/open-attestation";
import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { VerificationFragmentType, VerifierOptions, Verifier } from "../../../types/core";
import { OpenAttestationDnsTxtCode, Reason } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";

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
  issuer: v2.Issuer,
  smartContractAddress: string,
  options: VerifierOptions
): Promise<Identity> => {
  const type = issuer?.identityProof?.type ?? "";
  const location = issuer?.identityProof?.location ?? "";
  if (type !== "DNS-TXT") throw new Error("Identity type not supported");
  if (!location) throw new Error("Location is missing");
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
const isWrappedV2Document = (document: any): document is WrappedDocument<v2.OpenAttestationDocument> => {
  return document.data && document.data.issuers;
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
  if (isWrappedV2Document(document)) {
    const documentData = getData(document);
    // at least one issuer uses DNS-TXT
    return documentData.issuers.some((issuer) => {
      return (
        (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore) &&
        issuer.identityProof?.type === v2.IdentityProofType.DNSTxt
      );
    });
  }
  return false;
};

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document, options) => {
    // TODO that's shit
    if (utils.isWrappedV2Document(document)) {
      const documentData = getData(document);
      const identities = await Promise.all(
        documentData.issuers.map((issuer) => {
          if (issuer.identityProof?.type === v2.IdentityProofType.DNSTxt) {
            return resolveIssuerIdentity(
              issuer,
              // we expect the test function to prevent this issue => smart contract address MUST be populated
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore)!,
              options
            );
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
    } else {
      throw new Error("TBD");
    }
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
