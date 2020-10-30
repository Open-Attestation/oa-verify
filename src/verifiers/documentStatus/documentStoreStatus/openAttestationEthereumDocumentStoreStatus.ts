import { utils, getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { errors } from "ethers";
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { DocumentStore } from "@govtechsg/document-store/src/contracts/DocumentStore";
import { Hash, VerificationFragmentType, VerificationFragment, Verifier } from "../../../types/core";
import { OpenAttestationEthereumDocumentStoreStatusCode } from "../../../types/error";
import { getProvider } from "../../../common/utils";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";

interface PassingIssuanceStatus {
  issued: true;
  address: string;
}

interface FailingIssuanceStatus {
  issued: false;
  address: string;
  reason: string;
}

type IssuanceStatus = PassingIssuanceStatus | FailingIssuanceStatus;

interface PassingRevocationStatus {
  revoked: false;
  address: string;
}

interface FailingRevocationStatus {
  revoked: true;
  address: string;
  reason: string;
}

type RevocationStatus = PassingRevocationStatus | FailingRevocationStatus;

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
  const { proof } = getData(document);
  if (proof.method !== "DOCUMENT_STORE")
    throw new CodedError(
      `Document not issued using document store`,
      OpenAttestationEthereumDocumentStoreStatusCode.INVALID_VALIDATION_METHOD,
      OpenAttestationEthereumDocumentStoreStatusCode[
        OpenAttestationEthereumDocumentStoreStatusCode.INVALID_VALIDATION_METHOD
      ]
    );
  return [proof.value];
};

export const decodeError = (error: any) => {
  // Try to decode the error to see if we can deterministically tell if the document has NOT been issued or revoked
  // In case where we cannot tell, we throw an error
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  switch (true) {
    case !error.reason &&
      (error.method?.toLowerCase() === "isRevoked(bytes32)".toLowerCase() ||
        error.method?.toLowerCase() === "isIssued(bytes32)".toLowerCase()) &&
      error.code === errors.CALL_EXCEPTION:
      return "Contract is not found";
    case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
      error.code === errors.UNSUPPORTED_OPERATION:
      return "ENS name is not configured";
    case reason.toLowerCase() === "bad address checksum".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
      return "Bad document store address checksum";
    case error.message?.toLowerCase() === "name not found".toLowerCase():
      return "ENS name is not found";
    case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
      return "Invalid document store address";
    case error.code === errors.INVALID_ARGUMENT:
      return "Invalid call arguments";
    case error.code === errors.SERVER_ERROR:
      throw new CodedError(
        "Unable to connect to the Ethereum network, please try again later",
        OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR,
        OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR]
      );
    default:
      throw error;
  }
};

export const isIssuedOnDocumentStore = async ({
  documentStore,
  merkleRoot,
  network,
}: {
  documentStore: string;
  merkleRoot: string;
  network: string;
}): Promise<IssuanceStatus> => {
  try {
    const documentStoreContract = await DocumentStoreFactory.connect(documentStore, getProvider({ network }));
    const issued = await documentStoreContract.isIssued(merkleRoot);

    return issued
      ? {
          issued: true,
          address: documentStore,
        }
      : {
          issued: false,
          address: documentStore,
          reason: `Document ${merkleRoot} has not been issued under contract ${documentStore}`,
        };
  } catch (error) {
    // If error can be decoded and it's because of document is not issued, we return false
    // Else allow error to continue to bubble up
    return { issued: false, address: documentStore, reason: decodeError(error) };
  }
};

const getIntermediateHashes = (targetHash: Hash, proofs: Hash[] = []) => {
  const hashes = [`0x${targetHash}`];
  proofs.reduce((prev, curr) => {
    const next = utils.combineHashString(prev, curr);
    hashes.push(`0x${next}`);
    return next;
  }, targetHash);
  return hashes;
};

// Given a list of hashes, check against one smart contract if any of the hash has been revoked
export const isAnyHashRevoked = async (smartContract: DocumentStore, intermediateHashes: Hash[]) => {
  const revokedStatusDeferred = intermediateHashes.map((hash) =>
    smartContract.isRevoked(hash).then((status) => (status ? hash : undefined))
  );
  const revokedStatuses = await Promise.all(revokedStatusDeferred);
  return revokedStatuses.find((hash) => hash);
};

export const isRevokedOnDocumentStore = async ({
  documentStore,
  merkleRoot,
  network,
  targetHash,
  proofs,
}: {
  documentStore: string;
  merkleRoot: string;
  network: string;
  targetHash: Hash;
  proofs?: Hash[];
}): Promise<RevocationStatus> => {
  try {
    const documentStoreContract = await DocumentStoreFactory.connect(documentStore, getProvider({ network }));
    const intermediateHashes = getIntermediateHashes(targetHash, proofs);
    const revokedHash = await isAnyHashRevoked(documentStoreContract, intermediateHashes);

    return revokedHash
      ? {
          revoked: true,
          address: documentStore,
          reason: `Document ${merkleRoot} has been revoked under contract ${documentStore}`,
        }
      : {
          revoked: false,
          address: documentStore,
        };
  } catch (error) {
    // If error can be decoded and it's because of document is not issued, we return false
    // Else allow error to continue to bubble up
    return { revoked: true, address: documentStore, reason: decodeError(error) };
  }
};

const isWrappedV2Document = (document: any): document is WrappedDocument<v2.OpenAttestationDocument> => {
  return document.data && document.data.issuers;
};
export const openAttestationEthereumDocumentStoreStatus: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationEthereumDocumentStoreStatusCode.SKIPPED,
        codeString:
          OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.SKIPPED],
        message: `Document issuers doesn't have "documentStore" or "certificateStore" property or ${v3.Method.DocumentStore} method`,
      },
    });
  },
  test: (document) => {
    if (utils.isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.proof.method === v3.Method.DocumentStore;
    } else if (isWrappedV2Document(document)) {
      const documentData = getData(document);
      return documentData.issuers.some((issuer) => "documentStore" in issuer || "certificateStore" in issuer);
    }
    return false;
  },
  verify: withCodedErrorHandler(
    async (document, options): Promise<VerificationFragment<DocumentStoreStatusFragment>> => {
      const documentStores = getIssuersDocumentStores(document);
      const merkleRoot = `0x${document.signature.merkleRoot}`;
      const { targetHash } = document.signature;
      const proofs = document.signature.proof || [];

      const issuanceStatuses: IssuanceStatus[] = await Promise.all(
        documentStores.map((documentStore) =>
          isIssuedOnDocumentStore({ documentStore, merkleRoot, network: options.network })
        )
      );
      const notIssued = issuanceStatuses.find((status): status is FailingIssuanceStatus => !status.issued);
      const issuedOnAll = !notIssued;
      if (notIssued) {
        return {
          name,
          type,
          data: {
            issuedOnAll,
            details: utils.isWrappedV3Document(document)
              ? { issuance: issuanceStatuses[0] }
              : { issuance: issuanceStatuses },
          },
          reason: {
            message: notIssued.reason,
            code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED,
            codeString:
              OpenAttestationEthereumDocumentStoreStatusCode[
                OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED
              ],
          },
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
            network: options.network,
          })
        )
      );
      const revoked = revocationStatuses.find((status): status is FailingRevocationStatus => status.revoked);
      const revokeReasonFragment = revoked
        ? {
            reason: {
              message: revoked.reason,
              code: OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED,
              codeString:
                OpenAttestationEthereumDocumentStoreStatusCode[
                  OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED
                ],
            },
          }
        : {};

      return {
        name,
        type,
        data: {
          issuedOnAll,
          revokedOnAny: !!revoked,
          details: utils.isWrappedV3Document(document)
            ? { issuance: issuanceStatuses[0], revocation: revocationStatuses[0] }
            : { issuance: issuanceStatuses, revocation: revocationStatuses },
        },
        ...revokeReasonFragment,
        status: revoked ? "INVALID" : "VALID",
      };
    },
    {
      name,
      type,
      unexpectedErrorCode: OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR,
      unexpectedErrorString:
        OpenAttestationEthereumDocumentStoreStatusCode[OpenAttestationEthereumDocumentStoreStatusCode.UNEXPECTED_ERROR],
    }
  ),
};
