import { SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { verificationBuilder } from "./verifiers/verificationBuilder";
import { Verifier, Verifiers } from "./types/core";
import { openAttestationHash } from "./verifiers/documentIntegrity/hash/openAttestationHash";
import { Identity, openAttestationDnsTxt } from "./verifiers/issuerIdentity/dnsText/openAttestationDnsTxt";
import { openAttestationSignedProof } from "./verifiers/documentStatus/signedProof/openAttestationSignedProof";
import { isValid } from "./validator";
import { openAttestationEthereumTokenRegistryStatus } from "./verifiers/documentStatus/tokenRegistryStatus/openAttestationEthereumTokenRegistryStatus";
import { openAttestationEthereumDocumentStoreStatus } from "./verifiers/documentStatus/documentStoreStatus/openAttestationEthereumDocumentStoreStatus";

const openAttestationVerifiers: Verifiers[] = [
  openAttestationHash,
  openAttestationSignedProof,
  openAttestationEthereumTokenRegistryStatus,
  openAttestationEthereumDocumentStoreStatus,
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
  openAttestationSignedProof,
  openAttestationDnsTxt,
  openAttestationEthereumDocumentStoreStatus,
  openAttestationEthereumTokenRegistryStatus,
};
