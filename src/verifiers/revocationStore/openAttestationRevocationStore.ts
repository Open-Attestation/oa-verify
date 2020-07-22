import { getData, utils, v2, WrappedDocument } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../types/core";
import { OpenAttestationRevocationCode } from "../../types/error";
import { openAttestationEthereumDocumentStoreRevoked } from "../documentStoreRevoked/openAttestationEthereumDocumentStoreRevoked";

const name = "OpenAttestationRevocationStore";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
export const openAttestationRevocationStore: Verifier<WrappedDocument<v2.OpenAttestationDocument>> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationRevocationCode.SKIPPED,
        codeString: OpenAttestationRevocationCode[OpenAttestationRevocationCode.SKIPPED],
        message: `Document issuers doesn't have "revocationStore"`,
      },
    });
  },
  test: (document) => {
    if (utils.isWrappedV2Document(document)) {
      const documentData = getData(document);
      return documentData.issuers.every((issuer) => "revocationStore" in issuer);
    }
    return false;
  },
  verify: async (document, options) => {
    return {
      ...(await openAttestationEthereumDocumentStoreRevoked.verify(document, options)),
      name,
    };
  },
};
