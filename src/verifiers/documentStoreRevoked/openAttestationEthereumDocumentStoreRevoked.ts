import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { isWrappedV3Document, VerificationFragmentType, Verifier } from "../../types/core";
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
      message: `Document issuers doesn't have "documentStore" or "certificateStore" property or ${v3.Method.DocumentStore} method`
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
        return {
          name,
          type,
          data: status,
          message: "Certificate has been revoked",
          status: "INVALID"
        };
      }
      return {
        name,
        type,
        data: status,
        status: "VALID"
      };
    } catch (e) {
      return {
        name,
        type,
        data: e,
        message: e.message,
        status: "ERROR"
      };
    }
  }
};
