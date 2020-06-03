import { utils, getData, v2, v3, WrappedDocument, SignedWrappedDocument } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../types/core";
import { OpenAttestationEthereumDocumentStoreIssuedCode } from "../../types/error";
import {
  createDocumentStoreContract,
  getIssuersDocumentStore,
  isIssuedOnDocumentStore,
} from "../../common/smartContract/documentStoreContractInterface";
import { contractNotIssued, getErrorReason } from "../../common/smartContract/documentStoreErrors";

interface Status {
  issued: boolean;
  address: string;
  reason?: any;
}
const name = "OpenAttestationEthereumDocumentStoreIssued";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
export const openAttestationEthereumDocumentStoreIssued: Verifier<
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
  | SignedWrappedDocument<v2.OpenAttestationDocument>
> = {
  skip: (document) => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationEthereumDocumentStoreIssuedCode.SKIPPED,
        codeString:
          OpenAttestationEthereumDocumentStoreIssuedCode[OpenAttestationEthereumDocumentStoreIssuedCode.SKIPPED],
        message: utils.isSignedWrappedV2Document(document)
          ? "Document uses signed proof"
          : `Document issuers doesn't have "documentStore" or "certificateStore" property or ${v3.Method.DocumentStore} method`,
      },
    });
  },
  test: (document) => {
    if (utils.isSignedWrappedV2Document(document)) {
      return false;
    }
    if (utils.isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.proof.method === v3.Method.DocumentStore;
    }
    const documentData = getData(document);
    return documentData.issuers.some((issuer) => "documentStore" in issuer || "certificateStore" in issuer);
  },
  verify: async (document, options) => {
    try {
      const documentStores = getIssuersDocumentStore(document);
      const merkleRoot = `0x${document.signature.merkleRoot}`;
      const statuses: Status[] = await Promise.all(
        documentStores.map(async (documentStore) => {
          try {
            const contract = createDocumentStoreContract(documentStore, options);
            const issued = await isIssuedOnDocumentStore(contract, merkleRoot);
            const status: Status = {
              issued,
              address: documentStore,
            };
            if (!issued) {
              status.reason = contractNotIssued(merkleRoot, documentStore);
            }
            return status;
          } catch (e) {
            return { issued: false, address: documentStore, reason: getErrorReason(e, documentStore) };
          }
        })
      );
      const notIssued = statuses.find((status) => !status.issued);
      if (notIssued) {
        return {
          name,
          type,
          data: { issuedOnAll: false, details: utils.isWrappedV3Document(document) ? statuses[0] : statuses },
          reason: notIssued.reason,
          status: "INVALID",
        };
      }
      return {
        name,
        type,
        data: { issuedOnAll: true, details: utils.isWrappedV3Document(document) ? statuses[0] : statuses },
        status: "VALID",
      };
    } catch (e) {
      return {
        name,
        type,
        data: e,
        reason: {
          message: e.message,
          code: OpenAttestationEthereumDocumentStoreIssuedCode.UNEXPECTED_ERROR,
          codeString:
            OpenAttestationEthereumDocumentStoreIssuedCode[
              OpenAttestationEthereumDocumentStoreIssuedCode.UNEXPECTED_ERROR
            ],
        },
        status: "ERROR",
      };
    }
  },
};
