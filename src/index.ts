import { SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { verificationBuilder } from "./verifiers/verificationBuilder";
import { Verifier, Verifiers } from "./types/core";
import { openAttestationHash } from "./verifiers/documentIntegrity/hash/openAttestationHash";
import { isValid } from "./validator";
import { openAttestationEthereumTokenRegistryStatus } from "./verifiers/documentStatus/tokenRegistry";
import { openAttestationEthereumDocumentStoreStatus } from "./verifiers/documentStatus/documentStore";
import { openAttestationDidSignedDocumentStatus } from "./verifiers/documentStatus/didSigned";
import { Identity, openAttestationDnsTxtIdentityProof } from "./verifiers/issuerIdentity/dnsTxt";
import { openAttestationDidIdentityProof } from "./verifiers/issuerIdentity/did";
import { openAttestationDnsDidIdentityProof } from "./verifiers/issuerIdentity/dnsDid";

const openAttestationVerifiers: Verifiers[] = [
  openAttestationHash,
  openAttestationEthereumTokenRegistryStatus,
  openAttestationEthereumDocumentStoreStatus,
  openAttestationDidSignedDocumentStatus,
  openAttestationDnsTxtIdentityProof,
  openAttestationDnsDidIdentityProof,
];

const verify = verificationBuilder<
  | SignedWrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
>(openAttestationVerifiers);

export * from "./types/core";
export * from "./types/error";
export * from "./common/error";
export {
  verificationBuilder,
  openAttestationVerifiers,
  isValid,
  verify,
  Verifier,
  Identity,
  openAttestationHash,
  openAttestationEthereumDocumentStoreStatus,
  openAttestationEthereumTokenRegistryStatus,
  openAttestationDidSignedDocumentStatus,
  openAttestationDnsTxtIdentityProof,
  openAttestationDnsDidIdentityProof,
  openAttestationDidIdentityProof,
};
