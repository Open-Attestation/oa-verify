import { getData, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { providers } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { VerificationFragmentType, Verifier, VerifierOptions } from "../../../types/core";
import { OpenAttestationEthereumDocumentStoreStatusCode, Reason } from "../../../types/error";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { decodeError, isRevokedOnDocumentStore } from "../utils";
import { InvalidRevocationStatus, RevocationStatus, ValidRevocationStatusArray } from "../revocation.types";
import {
  DocumentStoreIssuanceStatus,
  InvalidDocumentStoreIssuanceStatus,
  OpenAttestationEthereumDocumentStoreStatusFragment,
  ValidDocumentStoreDataV3,
  ValidDocumentStoreIssuanceStatusArray,
} from "./ethereumDocumentStoreStatus.type";

const name = "OpenAttestationEthereumDocumentStoreStatus";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
type VerifierType = Verifier<OpenAttestationEthereumDocumentStoreStatusFragment>;

// Returns list of all document stores, throws when not all issuers are using document store
export const getIssuersDocumentStores = (document: WrappedDocument<v2.OpenAttestationDocument>): string[] => {
  const data = getData(document);
  return data.issuers.map((issuer) => {
    const documentStoreAddress = issuer.documentStore || issuer.certificateStore;
    if (!documentStoreAddress)
      throw new CodedError(
        `Document store address not found in issuer ${issuer.name}`,
        OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ISSUERS,
        OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.INVALID_ISSUERS]
      );
    return documentStoreAddress;
  });
};

export const isIssuedOnDocumentStore = async ({
  documentStore,
  merkleRoot,
  provider,
}: {
  documentStore: string;
  merkleRoot: string;
  provider: providers.Provider;
}): Promise<DocumentStoreIssuanceStatus> => {
  try {
    const documentStoreContract = await DocumentStoreFactory.connect(documentStore, provider);
    const issued = await documentStoreContract.isIssued(merkleRoot);
    return issued
      ? {
          issued: true,
          address: documentStore,
        }
      : {
          issued: false,
          address: documentStore,
          reason: {
            message: `Document ${merkleRoot} has not been issued under contract ${documentStore}`,
            code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED,
            codeString:
              OpenAttestationEthereumDocumentStoreStatusCode[
                OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED
              ],
          },
        };
  } catch (error) {
    // If error can be decoded and it's because of document is not issued, we return false
    // Else allow error to continue to bubble up
    return {
      issued: false,
      address: documentStore,
      reason: {
        message: decodeError(error),
        code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED,
        codeString:
          OpenAttestationEthereumDocumentStoreStatusCode[
            OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED
          ],
      },
    };
  }
};

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationEthereumDocumentStoreStatusCode.SKIPPED,
      codeString:
        OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SKIPPED],
      message: `Document issuers doesn't have "documentStore" or "certificateStore" property or ${v3.Method.DocumentStore} method`,
    },
  };
};

// Checks if document isWrappedDocument
// Check if document is of type documentStore or certificateStore
const test: VerifierType["test"] = (document) => {
  if (utils.isWrappedV2Document(document)) {
    const documentData = getData(document);
    return documentData.issuers.some((issuer) => "documentStore" in issuer || "certificateStore" in issuer);
  } else if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.proof.method === v3.Method.DocumentStore;
  }
  return false;
};

const verifyV2 = async (
  document: WrappedDocument<v2.OpenAttestationDocument>,
  options: VerifierOptions
): Promise<OpenAttestationEthereumDocumentStoreStatusFragment> => {
  const documentStores = getIssuersDocumentStores(document); // get document store address
  const merkleRoot = `0x${document.signature.merkleRoot}`; 
  const { targetHash } = document.signature; // get signature hash
  const proofs = document.signature.proof || []; // get signature proof
  const issuanceStatuses = await Promise.all(
    documentStores.map((documentStore) =>
      // check if merkle root issued on document store
      isIssuedOnDocumentStore({ documentStore, merkleRoot, provider: options.provider }) 
    )
  );
  // find responses that are invalid issuance response
  const notIssued = issuanceStatuses.find(InvalidDocumentStoreIssuanceStatus.guard);
  // return invalid response if, there is an invalid issuance
  if (InvalidDocumentStoreIssuanceStatus.guard(notIssued)) {
    return {
      name,
      type,
      data: {
        issuedOnAll: false,
        details: { issuance: issuanceStatuses },
      },
      reason: notIssued.reason,
      status: "INVALID",
    };
  }

  // Get revocation status of document 
  const revocationStatuses: RevocationStatus[] = await Promise.all(
    documentStores.map((documentStore) =>
      isRevokedOnDocumentStore({
        documentStore,
        merkleRoot,
        targetHash,
        proofs,
        provider: options.provider,
      })
    )
  );
  // find responses that are revocation
  const revoked = revocationStatuses.find(InvalidRevocationStatus.guard);
  // return invalid response if, there is an revocation
  if (InvalidRevocationStatus.guard(revoked)) {
    return {
      name,
      type,
      data: {
        issuedOnAll: true,
        revokedOnAny: true,
        details: { issuance: issuanceStatuses, revocation: revocationStatuses },
      },
      reason: revoked.reason,
      status: "INVALID",
    };
  }

  // valid, since there's an issuance and no revocation
  if (
    ValidDocumentStoreIssuanceStatusArray.guard(issuanceStatuses) &&
    ValidRevocationStatusArray.guard(revocationStatuses)
  ) {
    return {
      name,
      type,
      data: {
        issuedOnAll: true,
        revokedOnAny: false,
        details: { issuance: issuanceStatuses, revocation: revocationStatuses },
      },
      status: "VALID",
    };
  }
  throw new CodedError(
    "Reached an unexpected state when verifying v2 document",
    OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR,
    "UNEXPECTED_ERROR"
  );
};

const verifyV3 = async (
  document: WrappedDocument<v3.OpenAttestationDocument>,
  options: VerifierOptions
): Promise<OpenAttestationEthereumDocumentStoreStatusFragment> => {
  const { merkleRoot: merkleRootRaw, targetHash, proofs } = document.proof;
  const merkleRoot = `0x${merkleRootRaw}`;
  const { value: documentStore } = document.openAttestationMetadata.proof;

  // Check if document issued on document store
  const issuance = await isIssuedOnDocumentStore({ documentStore, merkleRoot, provider: options.provider });
  // Check if document revoked on document store
  const revocation = await isRevokedOnDocumentStore({
    documentStore,
    merkleRoot,
    targetHash,
    proofs,
    provider: options.provider,
  });

  const data = {
    issuedOnAll: issuance.issued,
    revokedOnAny: revocation.revoked,
    details: {
      issuance,
      revocation,
    },
  };

  // return valid response since it's issued and unrevoked
  if (ValidDocumentStoreDataV3.guard(data)) {
    return {
      name,
      type,
      data,
      status: "VALID",
    };
  }

  // return reason for failure
  let reason: Reason | undefined;
  if (InvalidRevocationStatus.guard(revocation)) {
    reason = revocation.reason;
  } else if (InvalidDocumentStoreIssuanceStatus.guard(issuance)) {
    reason = issuance.reason;
  }
  if (!reason) {
    throw new CodedError(
      "Unable to retrieve the reason of the failure",
      OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR,
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

// return after checks on issuance and revocation
const verify: VerifierType["verify"] = async (document, options) => {
  if (utils.isWrappedV2Document(document)) return verifyV2(document, options);
  else if (utils.isWrappedV3Document(document)) return verifyV3(document, options);
  throw new CodedError(
    `Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.`,
    OpenAttestationEthereumDocumentStoreStatusCode.UNRECOGNIZED_DOCUMENT,
    OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.UNRECOGNIZED_DOCUMENT]
  );
};

export const openAttestationEthereumDocumentStoreStatus: VerifierType = {
  skip,
  test,
  verify: withCodedErrorHandler(verify, {
    name,
    type,
    unexpectedErrorCode: OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR,
    unexpectedErrorString:
      OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR],
  }),
};
