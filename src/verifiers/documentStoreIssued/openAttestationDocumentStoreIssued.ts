import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { Verifier } from "../../types/core";
import { openAttestationEthereumDocumentStoreIssued } from "./openAttestationEthereumDocumentStoreIssued";
import { openAttestationW3CDIDProof } from "../w3c-did/openAttestationW3CDIDProof";

export const openAttestationDocumentStoreIssued: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip: (document, options) => {
    return openAttestationEthereumDocumentStoreIssued.skip(document, options);
  },
  test: (document, options) => {
    if ("proof" in document) {
      return openAttestationW3CDIDProof.test(document, options);
    }
    return openAttestationEthereumDocumentStoreIssued.test(document, options);
  },
  verify: async (document, options) => {
    if ("proof" in document) {
      return openAttestationW3CDIDProof.verify(document, options);
    }
    return openAttestationEthereumDocumentStoreIssued.verify(document, options);
  }
};
