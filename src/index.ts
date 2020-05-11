import { SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { verificationBuilder } from "./verifiers/verificationBuilder";
import { Verifier, Verifiers } from "./types/core";
import { openAttestationHash } from "./verifiers/hash/openAttestationHash";
import { Identity, openAttestationDnsTxt } from "./verifiers/dnsText/openAttestationDnsTxt";
import { openAttestationEthereumDocumentStoreIssued } from "./verifiers/documentStoreIssued/openAttestationEthereumDocumentStoreIssued";
import { openAttestationSignedProof } from "./verifiers/signedProof/openAttestationSignedProof";
import { openAttestationEthereumDocumentStoreRevoked } from "./verifiers/documentStoreRevoked/openAttestationEthereumDocumentStoreRevoked";
import { isValid } from "./validator";
import { openAttestationEthereumTokenRegistryMinted } from "./verifiers/tokenRegistryMinted/openAttestationEthereumTokenRegistryMinted";

const openAttestationVerifiers: Verifiers[] = [
  openAttestationHash,
  openAttestationSignedProof,
  openAttestationEthereumDocumentStoreIssued,
  openAttestationEthereumTokenRegistryMinted,
  openAttestationEthereumDocumentStoreRevoked,
  openAttestationDnsTxt,
];

const verify = verificationBuilder<
  | SignedWrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
>(openAttestationVerifiers);

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
  openAttestationSignedProof,
  openAttestationEthereumDocumentStoreIssued,
  openAttestationDnsTxt,
  openAttestationEthereumTokenRegistryMinted,
};
