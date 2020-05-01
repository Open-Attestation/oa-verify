import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { verificationBuilder } from "./verifiers/verificationBuilder";
import { Verifier } from "./types/core";
import { openAttestationHash } from "./verifiers/hash/openAttestationHash";
import { openAttestationDnsTxt, Identity } from "./verifiers/dnsText/openAttestationDnsTxt";
import { openAttestationEthereumDocumentStoreIssued } from "./verifiers/documentStoreIssued/openAttestationEthereumDocumentStoreIssued";
import { openAttestationW3CDIDProof } from "./verifiers/w3c-did/openAttestationW3CDIDProof";
import { openAttestationEthereumDocumentStoreRevoked } from "./verifiers/documentStoreRevoked/openAttestationEthereumDocumentStoreRevoked";
import { isValid } from "./validator";
import { openAttestationEthereumTokenRegistryMinted } from "./verifiers/tokenRegistryMinted/openAttestationEthereumTokenRegistryMinted";

const openAttestationVerifiers: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
>[] = [
  openAttestationHash,
  openAttestationW3CDIDProof,
  openAttestationEthereumDocumentStoreIssued,
  openAttestationEthereumTokenRegistryMinted,
  openAttestationEthereumDocumentStoreRevoked,
  openAttestationDnsTxt,
];

const verify = verificationBuilder(openAttestationVerifiers);

export * from "./types/core";
export * from "./types/error";
export {
  verificationBuilder,
  openAttestationVerifiers,
  isValid,
  verify,
  Verifier,
  Identity,
  openAttestationHash,
  openAttestationEthereumDocumentStoreRevoked,
  openAttestationW3CDIDProof,
  openAttestationEthereumDocumentStoreIssued,
  openAttestationDnsTxt,
  openAttestationEthereumTokenRegistryMinted,
};
