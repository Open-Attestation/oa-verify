import { getData, utils, v2, v3 } from "@govtechsg/open-attestation";
import { VerificationManagerOptions } from "src/types/core";
import { getDefaultProvider } from "ethers";
import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { VerifierResults, IssuerIdentityVerifier } from "../../builder";
import { OpenAttestationDnsTxtCode } from "../../../../types/error";
import { CodedError } from "../../../../common/error";
import { codedErrorResponse } from "../../utils/codedErrorResponse";

const verifier = "OpenAttestationDnsTxt";

const unexpectedErrorHandler = codedErrorResponse({
  verifier,
  unexpectedErrorCode: OpenAttestationDnsTxtCode.UNEXPECTED_ERROR,
});

// Resolve identity of an issuer, currently supporting only DNS-TXT
// DNS-TXT is explained => https://github.com/Open-Attestation/adr/blob/master/decentralized_identity_proof_DNS-TXT.md
const resolveIssuerIdentity = async (
  issuer: v2.Issuer | v3.Issuer,
  smartContractAddress: string,
  options: VerificationManagerOptions
): Promise<VerifierResults> => {
  const type = issuer?.identityProof?.type ?? "";
  const identifier = issuer?.identityProof?.location ?? "";
  if (type !== "DNS-TXT")
    throw new CodedError("Identity type not supported", OpenAttestationDnsTxtCode.INVALID_IDENTITY, "INVALID_IDENTITY");
  if (!identifier)
    throw new CodedError("Location is missing", OpenAttestationDnsTxtCode.INVALID_IDENTITY, "INVALID_IDENTITY");
  const network = await getDefaultProvider(options.network).getNetwork();
  const records = await getDocumentStoreRecords(identifier);
  const matchingRecord = records.find(
    (record) =>
      record.addr.toLowerCase() === smartContractAddress.toLowerCase() &&
      record.netId === network.chainId.toString(10) &&
      record.type === "openatts" &&
      record.net === "ethereum"
  );
  return matchingRecord
    ? {
        verifier,
        status: "VALID",
        identifier,
        data: { smartContractAddress },
      }
    : {
        verifier,
        status: "INVALID",
        identifier,
        data: { smartContractAddress },
      };
};

export const verify: IssuerIdentityVerifier = async ({ document, issuerIndex, options }) => {
  try {
    if (utils.isWrappedV2Document(document)) {
      if (typeof issuerIndex === "undefined") throw new Error("issuerIndex undefined for V2 document");
      if (!options) throw new Error("options is undefined");
      const issuer = getData(document).issuers[issuerIndex];
      const status = resolveIssuerIdentity(
        issuer,
        // we expect the test function to prevent this issue => smart contract address MUST be populated
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (issuer.documentStore || issuer.tokenRegistry || issuer.certificateStore)!,
        options
      );
      return status;
    } else {
      if (!options) throw new Error("options is undefined");
      const documentData = getData(document);
      const status = await resolveIssuerIdentity(documentData.issuer, documentData.proof.value, options);
      return status;
    }
  } catch (e) {
    return unexpectedErrorHandler(e);
  }
};

export const OpenAttestationDnsTxt = {
  type: "DNS-TXT",
  verify,
};
