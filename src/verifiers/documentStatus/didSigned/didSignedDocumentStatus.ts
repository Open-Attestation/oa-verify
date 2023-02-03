import { getData, SignedWrappedDocument, utils, v2, v3 } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier, VerifierOptions } from "../../../types/core";
import { OpenAttestationDidSignedDocumentStatusCode, Reason } from "../../../types/error";
import { DidVerificationStatus, ValidDidVerificationStatus, verifySignature } from "../../../did/verifier";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { isRevokedByOcspResponder2, isRevokedOnDocumentStore } from "../utils";
import { InvalidRevocationStatus, RevocationStatus, ValidRevocationStatus } from "../revocation.types";
import {
  DidSignedIssuanceStatus,
  InvalidDidSignedIssuanceStatus,
  OpenAttestationDidSignedDocumentStatusInvalidFragmentV3,
  OpenAttestationDidSignedDocumentStatusValidFragmentV3,
  OpenAttestationDidSignedDocumentStatusVerificationFragment,
  ValidDidSignedDataV2,
  ValidDidSignedIssuanceStatus,
} from "./didSignedDocumentStatus.type";

const name = "OpenAttestationDidSignedDocumentStatus";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
type VerifierType = Verifier<OpenAttestationDidSignedDocumentStatusVerificationFragment>;

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
  if (utils.isSignedWrappedV2Document(document)) {
    return document.proof.some((proof) => proof.type === "OpenAttestationSignature2018");
  } else if (utils.isSignedWrappedV3Document(document)) {
    return document.proof.type === "OpenAttestationMerkleProofSignature2018";
  }
  return false;
};

const transformToDidSignedIssuanceStatus = (status: DidVerificationStatus): DidSignedIssuanceStatus => {
  return ValidDidVerificationStatus.guard(status)
    ? {
        issued: true,
        did: status.did,
      }
    : {
        issued: false,
        did: status.did,
        reason: status.reason,
      };
};

const verifyV2 = async (
  document: SignedWrappedDocument<v2.OpenAttestationDocument>,
  options: VerifierOptions
): Promise<OpenAttestationDidSignedDocumentStatusVerificationFragment> => {
  const documentData = getData(document);
  const merkleRoot = `0x${document.signature.merkleRoot}`;
  const { targetHash, proof: proofs } = document.signature;
  documentData.issuers.forEach((issuer) => {
    if (!(issuer.identityProof?.type === "DID" || issuer.identityProof?.type === "DNS-DID"))
      throw new CodedError(
        "All issuers must use DID or DNS-DID identityProof type.",
        OpenAttestationDidSignedDocumentStatusCode.INVALID_ISSUERS,
        OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.INVALID_ISSUERS]
      );
  });
  const { issuers } = documentData;

  const revocation: (v2.Revocation | undefined)[] = issuers.map((issuer) => issuer.revocation);
  if (revocation.some((r) => typeof r?.type === "undefined"))
    throw new CodedError(
      "revocation block not found for an issuer",
      OpenAttestationDidSignedDocumentStatusCode.MISSING_REVOCATION,
      "MISSING_REVOCATION"
    );

  const revocationStatusCallback = (revocationItem: v2.Revocation): Promise<RevocationStatus> => {
    switch (revocationItem.type) {
      case v2.RevocationType.RevocationStore:
        if (typeof revocationItem.location === "string") {
          return isRevokedOnDocumentStore({
            documentStore: revocationItem.location,
            merkleRoot,
            provider: options.provider,
            targetHash,
            proofs,
          });
        }
        throw new CodedError(
          "missing revocation location for an issuer",
          OpenAttestationDidSignedDocumentStatusCode.REVOCATION_LOCATION_MISSING,
          "REVOCATION_LOCATION_MISSING"
        );
      case v2.RevocationType.OcspResponder:
        const { location } = revocationItem;
        if (typeof location === "string") {
          return isRevokedByOcspResponder2({
            merkleRoot,
            targetHash,
            proofs,
            location,
          });
        }
        throw new CodedError(
          "missing revocation location for an issuer",
          OpenAttestationDidSignedDocumentStatusCode.REVOCATION_LOCATION_MISSING,
          "REVOCATION_LOCATION_MISSING"
        );
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

  const revocationStatuses = await Promise.all((revocation as v2.Revocation[]).map(revocationStatusCallback));

  // Check that all the issuers have signed on the document
  if (!document.proof)
    throw new CodedError(
      "Document is not signed. Proofs are missing.",
      OpenAttestationDidSignedDocumentStatusCode.UNSIGNED,
      "UNSIGNED"
    );

  const signatureVerificationDeferred = issuers.map(async (issuer) => {
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
      resolver: options.resolver,
    });
  });

  const issuance = await (await Promise.all(signatureVerificationDeferred)).map(transformToDidSignedIssuanceStatus);
  const notIssued = issuance.find(InvalidDidSignedIssuanceStatus.guard);
  const revoked = revocationStatuses.find(InvalidRevocationStatus.guard);

  const data = {
    issuedOnAll: !notIssued,
    revokedOnAny: !!revoked,
    details: {
      issuance,
      revocation: revocationStatuses,
    },
  };

  if (ValidDidSignedDataV2.guard(data)) {
    return {
      name,
      type,
      data,
      status: "VALID",
    };
  }

  let reason: Reason | undefined;

  if (InvalidDidSignedIssuanceStatus.guard(notIssued)) {
    reason = notIssued.reason;
  } else if (InvalidRevocationStatus.guard(revoked)) {
    reason = revoked.reason;
  }
  if (!reason) {
    throw new CodedError(
      "Unable to retrieve the reason of the failure",
      OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR,
      "UNEXPECTED_ERROR"
    );
  }
  return {
    name,
    type,
    data,
    status: "INVALID",
    reason,
  };
};

const verifyV3 = async (
  document: SignedWrappedDocument<v3.OpenAttestationDocument>,
  options: VerifierOptions
): Promise<
  OpenAttestationDidSignedDocumentStatusValidFragmentV3 | OpenAttestationDidSignedDocumentStatusInvalidFragmentV3
> => {
  const { merkleRoot: merkleRootRaw, targetHash, proofs } = document.proof;
  const merkleRoot = `0x${merkleRootRaw}`;
  const metaData = document.openAttestationMetadata;

  const verificationResult = transformToDidSignedIssuanceStatus(
    await verifySignature({
      key: document.proof.key,
      did: metaData.proof.value,
      merkleRoot,
      signature: document.proof.signature,
      resolver: options.resolver,
    })
  );

  if (!metaData.proof.revocation?.type) {
    throw new CodedError(
      "revocation block not found for an issuer",
      OpenAttestationDidSignedDocumentStatusCode.MISSING_REVOCATION,
      "MISSING_REVOCATION"
    );
  }

  const issuedOnAll = verificationResult.issued;

  const getRevocationStatus = async (
    docType: v3.RevocationType,
    location: string | undefined
  ): Promise<RevocationStatus> => {
    switch (docType) {
      case v3.RevocationType.RevocationStore:
        if (typeof location === "string") {
          return isRevokedOnDocumentStore({
            documentStore: location,
            merkleRoot,
            targetHash,
            proofs,
            provider: options.provider,
          });
        }
        throw new CodedError(
          "missing revocation location for an issuer",
          OpenAttestationDidSignedDocumentStatusCode.REVOCATION_LOCATION_MISSING,
          "REVOCATION_LOCATION_MISSING"
        );
      case v3.RevocationType.OcspResponder:
        throw new Error("Ocsp revocation type not yet supported for v3");
      case v3.RevocationType.None:
        return { revoked: false };
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
    metaData.proof.revocation.location
  );

  const revokedOnAny = revocationStatus.revoked;

  if (ValidDidSignedIssuanceStatus.guard(verificationResult) && ValidRevocationStatus.guard(revocationStatus)) {
    return {
      name,
      type,
      data: {
        issuedOnAll: true,
        revokedOnAny: false,
        details: {
          issuance: verificationResult,
          revocation: revocationStatus,
        },
      },
      status: "VALID",
    };
  }

  // eslint-disable-next-line no-nested-ternary
  const reason = InvalidDidSignedIssuanceStatus.guard(verificationResult)
    ? verificationResult.reason
    : InvalidRevocationStatus.guard(revocationStatus)
    ? revocationStatus.reason
    : undefined;
  if (!reason) {
    throw new CodedError(
      "Unable to retrieve the reason of the failure",
      OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR,
      "UNEXPECTED_ERROR"
    );
  }
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
    status: "INVALID",
    reason,
  };
};

const verify: VerifierType["verify"] = async (document, options) => {
  if (utils.isSignedWrappedV2Document(document)) {
    return verifyV2(document, options);
  } else if (utils.isSignedWrappedV3Document(document)) {
    return verifyV3(document, options);
  }

  throw new CodedError(
    `Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.`,
    OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_DOCUMENT,
    OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.UNRECOGNIZED_DOCUMENT]
  );
};

export const openAttestationDidSignedDocumentStatus: VerifierType = {
  skip,
  test,
  verify: withCodedErrorHandler(verify, {
    name,
    type,
    unexpectedErrorCode: OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR,
    unexpectedErrorString:
      OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.UNEXPECTED_ERROR],
  }),
};
