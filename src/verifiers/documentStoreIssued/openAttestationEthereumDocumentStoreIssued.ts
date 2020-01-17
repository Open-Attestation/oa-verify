import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import {
  OpenAttestationEthereumDocumentStoreIssuedCode,
  isWrappedV3Document,
  VerificationFragmentType,
  Verifier
} from "../../types/core";
import { getDocumentStoreSmartContract } from "../../common/smartContract/documentToSmartContracts";
import { verifyIssued } from "./verify";

const name = "OpenAttestationEthereumDocumentStoreIssued";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
export const openAttestationEthereumDocumentStoreIssued: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationEthereumDocumentStoreIssuedCode.SKIPPED,
        codeString:
          OpenAttestationEthereumDocumentStoreIssuedCode[OpenAttestationEthereumDocumentStoreIssuedCode.SKIPPED],
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
    return documentData.issuers.some(issuer => "documentStore" in issuer || "certificateStore" in issuer);
  },
  verify: async (document, options) => {
    try {
      const smartContracts = getDocumentStoreSmartContract(document, options);
      const status = await verifyIssued(document, smartContracts);
      if (!status.issuedOnAll) {
        // @ts-ignore disable to not force token registry to return undefined reason. dunno how to fix this
        const reason = status.details.find(s => s.reason)?.reason;
        return {
          name,
          type,
          data: isWrappedV3Document(document)
            ? { issuedOnAll: status.issuedOnAll, details: status.details[0] }
            : status,
          reason,
          status: "INVALID"
        };
      }
      return {
        name,
        type,
        data: isWrappedV3Document(document) ? { issuedOnAll: status.issuedOnAll, details: status.details[0] } : status,
        status: "VALID"
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
            ]
        },
        status: "ERROR"
      };
    }
  }
};
