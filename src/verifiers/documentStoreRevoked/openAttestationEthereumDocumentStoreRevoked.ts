import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import {
  OpenAttestationEthereumDocumentStoreRevokedCode,
  isWrappedV3Document,
  VerificationFragmentType,
  Verifier
} from "../../types/core";
import { getDocumentStoreSmartContract } from "../../common/smartContract/documentToSmartContracts";
import { verifyRevoked } from "./verify";

const name = "OpenAttestationEthereumDocumentStoreRevoked";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
export const openAttestationEthereumDocumentStoreRevoked: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationEthereumDocumentStoreRevokedCode.SKIPPED,
        codeString:
          OpenAttestationEthereumDocumentStoreRevokedCode[OpenAttestationEthereumDocumentStoreRevokedCode.SKIPPED],
        message: `Document issuers doesn't have "documentStore" or "certificateStore" property or ${v3.Method.DocumentStore} method`
      }
    });
  },
  test: document => {
    if (isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.proof.method === v3.Method.DocumentStore;
    }
    const documentData = getData(document);
    return documentData.issuers.every(issuer => "documentStore" in issuer || "certificateStore" in issuer);
  },
  verify: async (document, options) => {
    try {
      const smartContracts = getDocumentStoreSmartContract(document, options);
      const status = await verifyRevoked(document, smartContracts);
      if (status.revokedOnAny) {
        const reason = status.details.find(s => s.reason)?.reason;
        return {
          name,
          type,
          data: isWrappedV3Document(document)
            ? { revokedOnAny: status.revokedOnAny, details: status.details[0] }
            : status,
          reason,
          status: "INVALID"
        };
      }
      return {
        name,
        type,
        data: isWrappedV3Document(document)
          ? { revokedOnAny: status.revokedOnAny, details: status.details[0] }
          : status,
        status: "VALID"
      };
    } catch (e) {
      return {
        name,
        type,
        data: e,
        reason: {
          message: e.message,
          code: OpenAttestationEthereumDocumentStoreRevokedCode.UNEXPECTED_ERROR,
          codeString:
            OpenAttestationEthereumDocumentStoreRevokedCode[
              OpenAttestationEthereumDocumentStoreRevokedCode.UNEXPECTED_ERROR
            ]
        },
        status: "ERROR"
      };
    }
  }
};
