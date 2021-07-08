import { verificationBuilder } from "./verifiers/verificationBuilder";
import { Verifier } from "./types/core";
import { openAttestationHash } from "./verifiers/documentIntegrity/hash/openAttestationHash";
import { isValid } from "./validator";
import { openAttestationEthereumTokenRegistryStatus } from "./verifiers/documentStatus/tokenRegistry";
import { openAttestationEthereumDocumentStoreStatus } from "./verifiers/documentStatus/documentStore";
import { openAttestationDidSignedDocumentStatus } from "./verifiers/documentStatus/didSigned";
import { openAttestationDnsTxtIdentityProof } from "./verifiers/issuerIdentity/dnsTxt";
import { openAttestationDidIdentityProof } from "./verifiers/issuerIdentity/did";
import { openAttestationDnsDidIdentityProof } from "./verifiers/issuerIdentity/dnsDid";
import { createResolver } from "./did/resolver";
import { getIdentifier } from "./getIdentifier";
import * as utils from "./common/utils";
import util from "util";

// eslint-disable-next-line @typescript-eslint/no-empty-function
util.deprecate(function infuraApiKey() {}, "'INFURA_API_KEY' has been deprecated, please use 'PROVIDER_API_KEY'.");

const openAttestationVerifiers = [
  openAttestationHash,
  openAttestationEthereumTokenRegistryStatus,
  openAttestationEthereumDocumentStoreStatus,
  openAttestationDidSignedDocumentStatus,
  openAttestationDnsTxtIdentityProof,
  openAttestationDnsDidIdentityProof,
];

const defaultBuilderOption = {
  network: process.env.PROVIDER_NETWORK || "homestead",
};

const verify = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);

export * from "./types/core";
export * from "./verifiers/documentIntegrity/hash/openAttestationHash.type";
export * from "./verifiers/documentStatus/didSigned/didSignedDocumentStatus.type";
export * from "./verifiers/documentStatus/documentStore/ethereumDocumentStoreStatus.type";
export * from "./verifiers/documentStatus/tokenRegistry/ethereumTokenRegistryStatus.type";
export * from "./verifiers/issuerIdentity/did/didIdentityProof.type";
export * from "./verifiers/issuerIdentity/dnsDid/dnsDidProof.type";
export * from "./verifiers/issuerIdentity/dnsTxt/openAttestationDnsTxt.type";
export * from "./types/error";
export * from "./common/error";
export {
  verificationBuilder,
  openAttestationVerifiers,
  isValid,
  verify,
  Verifier,
  openAttestationHash,
  openAttestationEthereumDocumentStoreStatus,
  openAttestationEthereumTokenRegistryStatus,
  openAttestationDidSignedDocumentStatus,
  openAttestationDnsTxtIdentityProof,
  openAttestationDnsDidIdentityProof,
  openAttestationDidIdentityProof,
  createResolver,
  getIdentifier,
  utils,
};
