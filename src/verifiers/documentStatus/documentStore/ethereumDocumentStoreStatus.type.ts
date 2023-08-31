import { Array as RunTypesArray, Boolean, Literal, Optional, Record, Static, String, Union } from "runtypes";
import {
  ErrorVerificationFragment,
  InvalidVerificationFragment,
  SkippedVerificationFragment,
  ValidVerificationFragment,
} from "../../../types/core";
import { Reason } from "../../../types/error";
import {
  RevocationStatus,
  RevocationStatusArray,
  ValidRevocationStatus,
  ValidRevocationStatusArray,
} from "../revocation.types";

/**
 * Document store issuance status
 */
export const ValidDocumentStoreIssuanceStatus = Record({
  issued: Literal(true),
  address: String,
});
export type ValidDocumentStoreIssuanceStatus = Static<typeof ValidDocumentStoreIssuanceStatus>;
export const ValidDocumentStoreIssuanceStatusArray = RunTypesArray(ValidDocumentStoreIssuanceStatus);
export type ValidDocumentStoreIssuanceStatusArray = Static<typeof ValidDocumentStoreIssuanceStatusArray>;

export const InvalidDocumentStoreIssuanceStatus = Record({
  issued: Literal(false),
  address: String,
  reason: Reason,
});
export type InvalidDocumentStoreIssuanceStatus = Static<typeof InvalidDocumentStoreIssuanceStatus>;

export const DocumentStoreIssuanceStatus = Union(ValidDocumentStoreIssuanceStatus, InvalidDocumentStoreIssuanceStatus);
export type DocumentStoreIssuanceStatus = Static<typeof DocumentStoreIssuanceStatus>;
export const DocumentStoreIssuanceStatusArray = RunTypesArray(DocumentStoreIssuanceStatus);
export type DocumentStoreIssuanceStatusArray = Static<typeof DocumentStoreIssuanceStatusArray>;

/**
 * Data for v2 Fragments
 */
const ValidDocumentStoreDataV2 = Record({
  issuedOnAll: Literal(true),
  revokedOnAny: Literal(false),
  details: Record({
    issuance: ValidDocumentStoreIssuanceStatusArray,
    revocation: ValidRevocationStatusArray,
  }),
});
export type ValidDocumentStoreDataV2 = Static<typeof ValidDocumentStoreDataV2>;

export const InvalidDocumentStoreDataV2 = Record({
  issuedOnAll: Boolean,
  revokedOnAny: Optional(Boolean),
  details: Record({
    issuance: DocumentStoreIssuanceStatusArray,
    revocation: Optional(RevocationStatusArray),
  }),
});
export type InvalidDocumentStoreDataV2 = Static<typeof InvalidDocumentStoreDataV2>;

/**
 * Data for v3 Fragments
 */
export const ValidDocumentStoreDataV3 = Record({
  issuedOnAll: Literal(true),
  revokedOnAny: Literal(false),
  details: Record({
    issuance: ValidDocumentStoreIssuanceStatus,
    revocation: ValidRevocationStatus,
  }),
});
export type ValidDocumentStoreDataV3 = Static<typeof ValidDocumentStoreDataV3>;

export const InvalidDocumentStoreDataV3 = Record({
  issuedOnAll: Boolean,
  revokedOnAny: Boolean,
  details: Record({
    issuance: DocumentStoreIssuanceStatus,
    revocation: RevocationStatus,
  }),
});
export type InvalidDocumentStoreDataV3 = Static<typeof InvalidDocumentStoreDataV3>;

/**
 * Fragments
 */
export type OpenAttestationEthereumDocumentStoreStatusFragmentValidFragmentV2 =
  ValidVerificationFragment<ValidDocumentStoreDataV2>;
export type OpenAttestationEthereumDocumentStoreStatusFragmentInvalidFragmentV2 =
  InvalidVerificationFragment<InvalidDocumentStoreDataV2>;
export type OpenAttestationEthereumDocumentStoreStatusFragmentValidFragmentV3 =
  ValidVerificationFragment<ValidDocumentStoreDataV3>;
export type OpenAttestationEthereumDocumentStoreStatusFragmentInvalidFragmentV3 =
  InvalidVerificationFragment<InvalidDocumentStoreDataV3>;
export type OpenAttestationEthereumDocumentStoreStatusErrorFragment = ErrorVerificationFragment<any>;
export type OpenAttestationEthereumDocumentStoreStatusFragment =
  | OpenAttestationEthereumDocumentStoreStatusFragmentValidFragmentV2
  | OpenAttestationEthereumDocumentStoreStatusFragmentInvalidFragmentV2
  | OpenAttestationEthereumDocumentStoreStatusFragmentValidFragmentV3
  | OpenAttestationEthereumDocumentStoreStatusFragmentInvalidFragmentV3
  | OpenAttestationEthereumDocumentStoreStatusErrorFragment
  | SkippedVerificationFragment;
