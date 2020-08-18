import { verificationBuilder } from "./verifiers/verificationBuilder";
import { openAttestationHash } from "./verifiers/hash/openAttestationHash";
import { openAttestationDnsTxt } from "./verifiers/dnsText/openAttestationDnsTxt";
import { openAttestationSignedProof } from "./verifiers/signedProof/openAttestationSignedProof";
import { isValid } from "./validator";
import { openAttestationEthereumTokenRegistryStatus } from "./verifiers/tokenRegistryStatus/openAttestationEthereumTokenRegistryStatus";
import { openAttestationEthereumDocumentStoreStatus } from "./verifiers/documentStoreStatus/openAttestationEthereumDocumentStoreStatus";
var openAttestationVerifiers = [
    openAttestationHash,
    openAttestationSignedProof,
    openAttestationEthereumTokenRegistryStatus,
    openAttestationEthereumDocumentStoreStatus,
    openAttestationDnsTxt,
];
var verify = verificationBuilder(openAttestationVerifiers);
export * from "./types/core";
export * from "./types/error";
export { verificationBuilder, openAttestationVerifiers, isValid, verify, openAttestationHash, openAttestationSignedProof, openAttestationDnsTxt, openAttestationEthereumDocumentStoreStatus, openAttestationEthereumTokenRegistryStatus, };
