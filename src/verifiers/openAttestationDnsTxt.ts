import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { getNetwork } from "ethers/utils";
import { isWrappedV2Document, VerificationFragmentType, VerificationManagerOptions, Verifier } from "../types/core";

const getSmartContractAddress = (issuer: v2.Issuer) => issuer.documentStore || issuer.tokenRegistry;

type Identity =
  | {
      identified: true;
      dns: string;
      smartContract: string;
    }
  | {
      identified: false;
      smartContract: string;
      error?: string | Error;
    };
// Resolve identity of an issuer, currently supporting only DNS-TXT
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
      record.netId === getNetwork(options.network).chainId.toString(10) &&
      record.type === "openatts" &&
      record.net === "ethereum"
  );
  return matchingRecord
    ? {
        identified: true,
        dns: location,
        smartContract: smartContractAddress
      }
    : {
        identified: false,
        smartContract: smartContractAddress
      };
};

const name = "OpenAttestationDnsTxt";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
export const openAttestationDnsTxt: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use ${v3.IdentityProofType.DNSTxt} type`
    });
  },
  test: document => {
    if (isWrappedV2Document(document)) {
      const documentData = getData(document);
      return documentData.issuers.some(getSmartContractAddress);
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
          // we expect the test function to prevent this issue => smart contract address MUST be populated
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          documentData.issuers.map(issuer => resolveIssuerIdentity(issuer, getSmartContractAddress(issuer)!, options))
        );

        const invalidIdentity = identities.findIndex(identity => !identity.identified);
        if (invalidIdentity !== -1) {
          return {
            name,
            type,
            data: {
              type: documentData.issuers[invalidIdentity].identityProof?.type,
              location: documentData.issuers[invalidIdentity].identityProof?.location,
              value:
                documentData.issuers[invalidIdentity].documentStore ||
                documentData.issuers[invalidIdentity].tokenRegistry
            },
            message: "Certificate issuer identity is invalid",
            status: "INVALID"
          };
        }
        return {
          name,
          type,
          data: identities,
          status: "VALID"
        };
      }
      const documentData = getData(document);
      const identity = await resolveIssuerIdentity(documentData.issuer, documentData.proof.value, options);
      if (!identity.identified) {
        return {
          name,
          type,
          data: {
            type: documentData.issuer.identityProof.type,
            location: documentData.issuer.identityProof.location,
            value: documentData.proof.value
          },
          message: "Certificate issuer identity is invalid",
          status: "INVALID"
        };
      }

      return {
        name,
        type,
        data: identity,
        status: "VALID"
      };
    } catch (e) {
      return {
        name,
        type,
        data: e,
        message: e.message,
        status: "ERROR"
      };
    }
  }
};
