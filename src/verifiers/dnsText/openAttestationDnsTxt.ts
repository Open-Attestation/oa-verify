import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { utils } from "ethers";
import { isWrappedV2Document, VerificationFragmentType, VerificationManagerOptions, Verifier } from "../../types/core";
import { OpenAttestationDnsTxtCode } from "../../types/error";

export interface Identity {
  status: "VALID" | "INVALID" | "SKIPPED";
  location?: string;
  value?: string;
}
// Resolve identity of an issuer, currently supporting only DNS-TXT
// DNS-TXT is explained => https://github.com/Open-Attestation/adr/blob/master/decentralized_identity_proof_DNS-TXT.md
const resolveIssuerIdentity = async (
  issuer: v2.Issuer | v3.Issuer,
  smartContractAddress: string,
  options: VerificationManagerOptions
): Promise<Identity> => {
  const type = issuer?.identityProof?.type ?? "";
  const location = issuer?.identityProof?.location ?? "";
  if (type !== "DNS-TXT") throw new Error("Identity type not supported");
  if (!location) throw new Error("Location is missing");
  const records = await getDocumentStoreRecords(location);
  const matchingRecord = records.find(
    record =>
      record.addr.toLowerCase() === smartContractAddress.toLowerCase() &&
      record.netId === utils.getNetwork(options.network).chainId.toString(10) &&
      record.type === "openatts" &&
      record.net === "ethereum"
  );
  return matchingRecord
    ? {
        status: "VALID",
        location,
        value: smartContractAddress
      }
    : {
        status: "INVALID",
        location,
        value: smartContractAddress
      };
};

const name = "OpenAttestationDnsTxt";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
export const openAttestationDnsTxt: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>,
  VerificationManagerOptions,
  Identity | Identity[]
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationDnsTxtCode.SKIPPED,
        codeString: OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.SKIPPED],
        message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use ${v3.IdentityProofType.DNSTxt} type`
      }
    });
  },
  test: document => {
    if (isWrappedV2Document(document)) {
      const documentData = getData(document);
      // at least one issuer uses DNS-TXT
      return documentData.issuers.some(issuer => {
        return (
          (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore) &&
          issuer.identityProof?.type === v2.IdentityProofType.DNSTxt
        );
      });
    }
    const documentData = getData(document);
    return documentData.issuer.identityProof.type === v3.IdentityProofType.DNSTxt;
  },
  verify: async (document, options) => {
    try {
      // TODO that's shit
      if (isWrappedV2Document(document)) {
        const documentData = getData(document);
        const identities = await Promise.all(
          documentData.issuers.map(issuer => {
            if (issuer.identityProof?.type === v2.IdentityProofType.DNSTxt) {
              return resolveIssuerIdentity(
                issuer,
                // we expect the test function to prevent this issue => smart contract address MUST be populated
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore)!,
                options
              );
            }
            const skippedResponse: Identity = {
              status: "SKIPPED"
            };
            return skippedResponse; // eslint is happy, so am I (https://github.com/bradzacher/eslint-plugin-typescript/blob/master/docs/rules/no-object-literal-type-assertion.md)
          })
        );

        const invalidIdentity = identities.findIndex(identity => identity.status === "INVALID");
        if (invalidIdentity !== -1) {
          const smartContractAddress =
            documentData.issuers[invalidIdentity].documentStore ||
            documentData.issuers[invalidIdentity].tokenRegistry ||
            documentData.issuers[invalidIdentity].certificateStore;

          return {
            name,
            type,
            data: identities,
            reason: {
              code: OpenAttestationDnsTxtCode.INVALID_IDENTITY,
              codeString: OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.INVALID_IDENTITY],
              message: `Certificate issuer identity for ${smartContractAddress} is invalid`
            },
            status: "INVALID"
          };
        }
        return {
          name,
          type,
          data: identities,
          status: "VALID"
        };
      } else {
        // we have a v3 document
        const documentData = getData(document);
        const identity = await resolveIssuerIdentity(documentData.issuer, documentData.proof.value, options);
        if (identity.status === "INVALID") {
          return {
            name,
            type,
            data: identity,
            reason: {
              code: OpenAttestationDnsTxtCode.INVALID_IDENTITY,
              codeString: OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.INVALID_IDENTITY],
              message: "Certificate issuer identity is invalid"
            },
            status: "INVALID"
          };
        }

        return {
          name,
          type,
          data: identity,
          status: "VALID"
        };
      }
    } catch (e) {
      return {
        name,
        type,
        data: e,
        reason: {
          code: OpenAttestationDnsTxtCode.UNEXPECTED_ERROR,
          codeString: OpenAttestationDnsTxtCode[OpenAttestationDnsTxtCode.UNEXPECTED_ERROR],
          message: e.message
        },
        status: "ERROR"
      };
    }
  }
};
