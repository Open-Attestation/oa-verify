import { v2, v3, WrappedDocument, SignedWrappedDocument, getData, utils } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier, VerificationFragment, VerifierOptions } from "../../../types/core";
import { OpenAttestationDidSignedDocumentStatusCode } from "../../../types/error";
import { verifySignature, DidVerificationStatus } from "../../../did/verifier";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { isRevokedOnDocumentStore } from "../utils";
import { RevocationStatus, InvalidRevocationStatus } from "../types";

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

const test: VerifierType["test"] = (document) => {
  if (utils.isWrappedV2Document(document) && utils.isSignedWrappedV2Document(document)) {
    return document.proof.some((proof) => proof.type === "OpenAttestationSignature2018");
  }
  if (utils.isWrappedV3Document(document) && utils.isSignedWrappedV3Document(document)) {
    return document.proof.type === "OpenAttestationMerkleProofSignature2018";
  }
  return false;
};

const verifyV2 = async (
  document: SignedWrappedDocument<v2.OpenAttestationDocument>,
  options: VerifierOptions
): Promise<VerificationFragment> => {
  const data = getData(document);
  const merkleRoot = `0x${document.signature.merkleRoot}`;
  const { targetHash } = document.signature;
  data.issuers.forEach((issuer) => {
    if (!(issuer.identityProof?.type === "DID" || issuer.identityProof?.type === "DNS-DID"))
      throw new CodedError(
        "All issuers must use DID or DNS-DID identityProof type.",
        OpenAttestationDidSignedDocumentStatusCode.INVALID_ISSUERS,
        OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.INVALID_ISSUERS]
      );
  });
  const { issuers } = data;

  // If revocation block does not exist, throw error to prevent case where revocation method is revoked
  const revocation: (v2.Revocation | undefined)[] = issuers.map((issuer) => issuer.revocation);
  if (revocation.some((r) => typeof r?.type === "undefined"))
    throw new CodedError(
      "revocation block not found for an issuer",
      OpenAttestationDidSignedDocumentStatusCode.MISSING_REVOCATION,
      "MISSING_REVOCATION"
    );

  const revocationStatusCallback = (revocationItem: v2.Revocation) => {
    switch (revocationItem.type) {
      case v2.RevocationType.RevocationStore:
        return isRevokedOnDocumentStore({
          documentStore: revocationItem.location ?? "",
          merkleRoot,
          provider: options.provider,
          targetHash,
        });
      case v2.RevocationType.None:
        return Promise.resolve({ revoked: false });
      default:
        throw new CodedError(
          "unrecognized revocation type for an issuer",
          OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_REVOCATION_TYPE,
          "UNRECOGNIZED_REVOCATION_TYPE"
        );
    }
  };

  const revocationStatuses: RevocationStatus[] = await Promise.all(
    (revocation as v2.Revocation[]).map(revocationStatusCallback)
  );

  const revoked = revocationStatuses.find((status): status is InvalidRevocationStatus => status.revoked);
  const revokedOnAny = !!revoked;

  // Check that all the issuers have signed on the document
  if (!document.proof)
    throw new CodedError(
      "Document is not signed. Proofs are missing.",
      OpenAttestationDidSignedDocumentStatusCode.UNSIGNED,
      "UNSIGNED"
    );

  const signatureVerificationDeferred: Promise<DidVerificationStatus>[] = issuers.map(async (issuer) => {
    const key = issuer.identityProof?.key;
    const did = issuer.id;
    if (!did)
      throw new CodedError(
        "id is missing in issuer",
        OpenAttestationDidSignedDocumentStatusCode.DID_MISSING,
        "DID_MISSING"
      );
    if (!key)
      throw new CodedError(
        "Key is not present",
        OpenAttestationDidSignedDocumentStatusCode.MALFORMED_IDENTITY_PROOF,
        "MALFORMED_IDENTITY_PROOF"
      );
    const correspondingProof = document.proof.find((p) => p.verificationMethod.toLowerCase() === key.toLowerCase());
    if (!correspondingProof)
      throw new CodedError(
        `Proof not found for ${key}`,
        OpenAttestationDidSignedDocumentStatusCode.CORRESPONDING_PROOF_MISSING,
        "CORRESPONDING_PROOF_MISSING"
      );
    return verifySignature({
      merkleRoot,
      key,
      signature: correspondingProof.signature,
      did,
    });
  });

  const issuance = await (await Promise.all(signatureVerificationDeferred)).map((status) => {
    return status.verified
      ? {
          issued: true,
          did: status.did,
        }
      : {
          issued: false,
          did: status.did,
          reason: status.reason,
        };
  });
  const issuedOnAll = issuance.every((i) => i.issued);

  return {
    name,
    type,
    data: {
      issuedOnAll,
      revokedOnAny,
      details: {
        issuance,
        revocation: revocationStatuses,
      },
    },
    ...(revoked && {
      reason: revoked.reason,
    }),
    status: issuedOnAll && !revokedOnAny ? "VALID" : "INVALID",
  };
};

const verifyV3 = async (
  document: SignedWrappedDocument<v3.OpenAttestationDocument>,
  options: VerifierOptions
): Promise<VerificationFragment> => {
  const { merkleRoot: merkleRootRaw, targetHash, proofs } = document.proof;
  const merkleRoot = `0x${merkleRootRaw}`;
  const metaData = document.openAttestationMetadata;

  const verificationResult = await verifySignature({
    key: document.proof.key,
    did: metaData.proof.value,
    merkleRoot,
    signature: document.proof.signature,
  });

  if (!metaData.proof.revocation?.type) {
    throw new CodedError(
      "revocation block not found for an issuer",
      OpenAttestationDidSignedDocumentStatusCode.MISSING_REVOCATION,
      "MISSING_REVOCATION"
    );
  }

  const issuedOnAll = verificationResult.verified;

  const getRevocationStatus = async (docType: v3.RevocationType, location: string) => {
    switch (docType) {
      case v3.RevocationType.RevocationStore:
        return isRevokedOnDocumentStore({
          documentStore: location,
          merkleRoot,
          targetHash,
          proofs,
          provider: options.provider,
        });
      case v3.RevocationType.None:
        return Promise.resolve({ revoked: false });
      default:
        throw new CodedError(
          "revocation type not found for an issuer",
          OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_REVOCATION_TYPE,
          "UNRECOGNIZED_REVOCATION_TYPE"
        );
    }
  };

  const revocationStatus = await getRevocationStatus(
    metaData.proof.revocation.type,
    metaData.proof.revocation.location ?? ""
  );

  const revokedOnAny = revocationStatus.revoked;

  const status = issuedOnAll && !revokedOnAny;

  return {
    name,
    type,
    data: {
      issuedOnAll,
      revokedOnAny,
      details: {
        issuance: verificationResult,
        revocation: revocationStatus,
      },
    },
    status: status ? "VALID" : "INVALID",
  };
};

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document, options) => {
    if (utils.isSignedWrappedV2Document(document)) {
      return verifyV2(document, options);
    }

    if (utils.isSignedWrappedV3Document(document)) {
      return verifyV3(document, options);
    }

    throw new CodedError(
      `Document does not match either v2 or v3 formats`,
      OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_DOCUMENT,
      OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_DOCUMENT]
    );
  },
  {
    name,
    type,
    unexpectedErrorCode: OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR,
    unexpectedErrorString:
      OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR],
  }
);

export const openAttestationDidSignedDocumentStatus: VerifierType = {
  skip,
  test,
  verify,
};
