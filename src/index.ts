import { SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { verificationBuilder } from "./verifiers/verificationBuilder";
import { Verifier, Verifiers } from "./types/core";
import { openAttestationHash } from "./verifiers/hash/openAttestationHash";
import { Identity, openAttestationDnsTxt } from "./verifiers/dnsText/openAttestationDnsTxt";
import { openAttestationSignedProof } from "./verifiers/signedProof/openAttestationSignedProof";
import { isValid } from "./validator";
import { openAttestationEthereumTokenRegistryStatus } from "./verifiers/tokenRegistryStatus/openAttestationEthereumTokenRegistryStatus";
import { openAttestationEthereumDocumentStoreStatus } from "./verifiers/documentStoreStatus/openAttestationEthereumDocumentStoreStatus";

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
