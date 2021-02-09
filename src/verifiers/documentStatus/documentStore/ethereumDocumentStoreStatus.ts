import { utils, getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { providers } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { VerificationFragmentType, VerificationFragment, Verifier, VerifierOptions } from "../../../types/core";
import { OpenAttestationEthereumDocumentStoreStatusCode, Reason } from "../../../types/error";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { decodeError, isRevokedOnDocumentStore } from "../utils";
import { InvalidRevocationStatus, RevocationStatus } from "../types";

interface ValidIssuanceStatus {
  issued: true;
  address: string;
}

interface InvalidIssuanceStatus {
  issued: false;
  address: string;
  reason: Reason;
}

type IssuanceStatus = ValidIssuanceStatus | InvalidIssuanceStatus;

export interface DocumentStoreStatusFragment {
  issuedOnAll: boolean;
  revokedOnAny?: boolean;
  details: {
    issuance: IssuanceStatus | IssuanceStatus[];
    revocation?: RevocationStatus | RevocationStatus[];
  };
}

const name = "OpenAttestationEthereumDocumentStoreStatus";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

// Returns list of all document stores, throws when not all issuers are using document store
export const getIssuersDocumentStores = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string[] => {
  if (utils.isWrappedV2Document(document)) {
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
  }
  throw new Error("TBD");
};

export const isIssuedOnDocumentStore = async ({
  documentStore,
  merkleRoot,
  provider,
}: {
  documentStore: string;
  merkleRoot: string;
  provider: providers.Provider;
}): Promise<IssuanceStatus> => {
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

const test: VerifierType["test"] = (document) => {
  if (utils.isWrappedV2Document(document)) {
    // https://github.com/Open-Attestation/open-attestation/issues/148
    // isWrappedV2Document does not correctly detect the document type, remove when issue is resolved
    if (!document.data || !document.data.issuers) return false;
    const documentData = getData(document);
    return documentData.issuers.some((issuer) => "documentStore" in issuer || "certificateStore" in issuer);
  }
  if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.proof.method === v3.Method.DocumentStore;
  }
  return false;
};

const verifyV2 = async (
  document: WrappedDocument<v2.OpenAttestationDocument>,
  options: VerifierOptions
): Promise<VerificationFragment> => {
  const documentStores = getIssuersDocumentStores(document);
  const merkleRoot = `0x${document.signature.merkleRoot}`;
  const { targetHash } = document.signature;
  const proofs = document.signature.proof || [];

  const issuanceStatuses: IssuanceStatus[] = await Promise.all(
    documentStores.map((documentStore) =>
      isIssuedOnDocumentStore({ documentStore, merkleRoot, provider: options.provider })
    )
  );
  const notIssued = issuanceStatuses.find((status): status is InvalidIssuanceStatus => !status.issued);
  const issuedOnAll = !notIssued;
  if (notIssued) {
    return {
      name,
      type,
      data: {
        issuedOnAll,
        details: { issuance: issuanceStatuses },
      },
      reason: notIssued.reason,
      status: "INVALID",
    };
  }

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
  const revoked = revocationStatuses.find((status): status is InvalidRevocationStatus => status.revoked);

  return {
    name,
    type,
    data: {
      issuedOnAll,
      revokedOnAny: !!revoked,
      details: { issuance: issuanceStatuses, revocation: revocationStatuses },
    },
    ...(revoked && {
      reason: revoked.reason,
    }),
    status: revoked ? "INVALID" : "VALID",
  };
};

const verifyV3 = async (
  document: WrappedDocument<v3.OpenAttestationDocument>,
  options: VerifierOptions
): Promise<VerificationFragment> => {
  const { merkleRoot: merkleRootRaw, targetHash, proofs } = document.proof;
  const merkleRoot = `0x${merkleRootRaw}`;
  const { value: documentStore } = document.openAttestationMetadata.proof;

  const issuance = await isIssuedOnDocumentStore({ documentStore, merkleRoot, provider: options.provider });
  const revocation = await isRevokedOnDocumentStore({
    documentStore,
    merkleRoot,
    targetHash,
    proofs,
    provider: options.provider,
  });
  const isValid = issuance.issued && !revocation.revoked;

  return {
    name,
    type,
    data: {
      issuedOnAll: issuance.issued,
      revokedOnAny: revocation.revoked,
      details: {
        issuance,
        revocation,
      },
    },
    status: isValid ? "VALID" : "INVALID",
  };
};

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document, options): Promise<VerificationFragment<DocumentStoreStatusFragment>> => {
    if (utils.isWrappedV2Document(document)) return verifyV2(document, options);
    if (utils.isWrappedV3Document(document)) return verifyV3(document, options);
    throw new CodedError(
      `Unrecognized document version`,
      OpenAttestationEthereumDocumentStoreStatusCode.UNRECOGNIZED_DOCUMENT,
      OpenAttestationEthereumDocumentStoreStatusCode[
        OpenAttestationEthereumDocumentStoreStatusCode.UNRECOGNIZED_DOCUMENT
      ]
    );
  },
  {
    name,
    type,
    unexpectedErrorCode: OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR,
    unexpectedErrorString:
      OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR],
  }
);

export const openAttestationEthereumDocumentStoreStatus: VerifierType = {
  skip,
  test,
  verify,
};
