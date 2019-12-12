import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { verificationBuilder } from "./verifiers/verificationBuilder";
import { Verifier } from "./types/core";
import { openAttestationHash } from "./verifiers/openAttestationHash";
import { openAttestationDnsTxt } from "./verifiers/openAttestationDnsTxt";
import { openAttestationEthereumDocumentStoreIssued } from "./verifiers/documentStoreIssued/openAttestationEthereumDocumentStoreIssued";
import { openAttestationEthereumTokenRegistryMinted } from "./verifiers/openAttestationEthereumTokenRegistryMinted";
import { openAttestationEthereumDocumentStoreRevoked } from "./verifiers/documentStoreRevoked/openAttestationEthereumDocumentStoreRevoked";
import { isValid } from "./validator";

const openAttestationVerifiers: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
>[] = [
  openAttestationHash,
  openAttestationEthereumDocumentStoreIssued,
  openAttestationEthereumTokenRegistryMinted,
  openAttestationEthereumDocumentStoreRevoked,
  openAttestationDnsTxt
];

const verify = verificationBuilder(openAttestationVerifiers);

export { verificationBuilder, openAttestationVerifiers, isValid, verify, Verifier };
