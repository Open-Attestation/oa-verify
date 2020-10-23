import { SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { verificationBuilder } from "./verifiers/verificationBuilder";
import { Verifier, Verifiers } from "./types/core";
import { openAttestationHash } from "./verifiers/documentIntegrity/hash/openAttestationHash";
import { Identity, openAttestationDnsTxt } from "./verifiers/issuerIdentity/dnsText/openAttestationDnsTxt";
import { isValid } from "./validator";
import { openAttestationEthereumTokenRegistryStatus } from "./verifiers/documentStatus/tokenRegistryStatus/openAttestationEthereumTokenRegistryStatus";
import { openAttestationEthereumDocumentStoreStatus } from "./verifiers/documentStatus/documentStoreStatus/openAttestationEthereumDocumentStoreStatus";
import { OpenAttestationDidSignedDocumentStatus } from "./verifiers/documentStatus/didSignedDocumentStatus";
import { OpenAttestationDidSignedDidIdentityProof } from "./verifiers/issuerIdentity/didIdentityProof";
import { OpenAttestationDnsDid } from "./verifiers/issuerIdentity/dnsDidProof";

const openAttestationVerifiers: Verifiers[] = [
  openAttestationHash,
  openAttestationEthereumTokenRegistryStatus,
  openAttestationEthereumDocumentStoreStatus,
  openAttestationDnsTxt,
  OpenAttestationDnsDid,
  OpenAttestationDidSignedDocumentStatus,
];

const verify = verificationBuilder<
  | SignedWrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
>(openAttestationVerifiers);

export * from "./types/core";
export * from "./types/error";
export * from "./common/error";
export * from "./verifiers/identity";
export {
  verificationBuilder,
  openAttestationVerifiers,
  isValid,
  verify,
  Verifier,
  Identity,
  openAttestationHash,
  openAttestationDnsTxt,
  openAttestationEthereumDocumentStoreStatus,
  openAttestationEthereumTokenRegistryStatus,
  OpenAttestationDnsDid,
  OpenAttestationDidSignedDocumentStatus,
  OpenAttestationDidSignedDidIdentityProof,
};
