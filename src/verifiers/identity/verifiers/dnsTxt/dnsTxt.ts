import { getData, utils, v2, v3 } from "@govtechsg/open-attestation";
import { VerificationManagerOptions } from "src/types/core";
import { getDefaultProvider } from "ethers";
import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { VerifierResults, IssuerIdentityVerifier } from "../../builder";
import { OpenAttestationDnsTxtCode } from "../../../../types/error";

const verifier = "OpenAttestationDnsTxt";

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
    return {
      verifier,
      status: "ERROR",
      reason: {
        code: OpenAttestationDnsTxtCode.INVALID_IDENTITY,
        codeString: "INVALID_IDENTITY",
        message: "Identity type not supported",
      },
    };
  if (!identifier)
    return {
      verifier,
      status: "ERROR",
      reason: {
        code: OpenAttestationDnsTxtCode.INVALID_IDENTITY,
        codeString: "INVALID_IDENTITY",
        message: "Location is missing",
      },
    };
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
  if (utils.isWrappedV2Document(document)) {
    if (typeof issuerIndex === "undefined") throw new Error("issuerIndex undefined for V2 document");
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
    const documentData = getData(document);
    const status = await resolveIssuerIdentity(documentData.issuer, documentData.proof.value, options);
    return status;
  }
};

export const OpenAttestationDnsTxt = {
  type: "DNS-TXT",
  verify,
};
