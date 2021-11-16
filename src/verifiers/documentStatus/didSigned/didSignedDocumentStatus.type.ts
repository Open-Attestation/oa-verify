import { Array as RunTypesArray, Boolean, Literal, Record, Static, String, Union, Number } from "runtypes";
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
  OcspResponderRevocationStatus,
} from "../revocation.types";

/**
 * DID signed issuance status
 */
export const ValidDidSignedIssuanceStatus = Record({
  did: String,
  issued: Literal(true),
});
export type ValidDidSignedIssuanceStatus = Static<typeof ValidDidSignedIssuanceStatus>;
export const ValidDidSignedIssuanceStatusArray = RunTypesArray(ValidDidSignedIssuanceStatus);
export type ValidDidSignedIssuanceStatusArray = Static<typeof ValidDidSignedIssuanceStatusArray>;

export const InvalidDidSignedIssuanceStatus = Record({
  did: String,
  issued: Literal(false),
  reason: Reason,
});
export type InvalidDidSignedIssuanceStatus = Static<typeof InvalidDidSignedIssuanceStatus>;

export const DidSignedIssuanceStatus = Union(ValidDidSignedIssuanceStatus, InvalidDidSignedIssuanceStatus);
export type DidSignedIssuanceStatus = Static<typeof DidSignedIssuanceStatus>;
export const DidSignedIssuanceStatusArray = RunTypesArray(DidSignedIssuanceStatus);
export type DidSignedIssuanceStatusArray = Static<typeof DidSignedIssuanceStatusArray>;

/**
 * OCSP response
 */

export const ValidOcspReasonCode = Number.withConstraint((n) => n >= 0 && n <= 10 && n != 7);
export const ValidOcspResponse = Record({
  certificateStatus: OcspResponderRevocationStatus,
});

export const ValidOcspResponseRevoked = Record({
  reasonCode: ValidOcspReasonCode,
  certificateStatus: OcspResponderRevocationStatus,
});

/**
 * Data for v2 Fragments
 */
export const ValidDidSignedDataV2 = Record({
  issuedOnAll: Literal(true),
  revokedOnAny: Literal(false),
  details: Record({
    issuance: ValidDidSignedIssuanceStatusArray,
    revocation: ValidRevocationStatusArray,
  }),
});
export type ValidDidSignedDataV2 = Static<typeof ValidDidSignedDataV2>;

export const InvalidDidSignedDataV2 = Record({
  issuedOnAll: Boolean,
  revokedOnAny: Boolean,
  details: Record({
    issuance: DidSignedIssuanceStatusArray,
    revocation: RevocationStatusArray,
  }),
});
export type InvalidDidSignedDataV2 = Static<typeof InvalidDidSignedDataV2>;

/**
 * Data for v3 Fragments
 */
export const ValidDidSignedDataV3 = Record({
  issuedOnAll: Literal(true),
  revokedOnAny: Literal(false),
  details: Record({
    issuance: ValidDidSignedIssuanceStatus,
    revocation: ValidRevocationStatus,
  }),
});
export type ValidDidSignedDataV3 = Static<typeof ValidDidSignedDataV3>;

export const InvalidDidSignedDataV3 = Record({
  issuedOnAll: Boolean,
  revokedOnAny: Boolean,
  details: Record({
    issuance: DidSignedIssuanceStatus,
    revocation: RevocationStatus,
  }),
});
export type InvalidDidSignedDataV3 = Static<typeof InvalidDidSignedDataV3>;

/**
 * Fragments
 */
export type OpenAttestationDidSignedDocumentStatusValidFragmentV2 = ValidVerificationFragment<ValidDidSignedDataV2>;
export type OpenAttestationDidSignedDocumentStatusInvalidFragmentV2 = InvalidVerificationFragment<InvalidDidSignedDataV2>;
export type OpenAttestationDidSignedDocumentStatusValidFragmentV3 = ValidVerificationFragment<ValidDidSignedDataV3>;
export type OpenAttestationDidSignedDocumentStatusInvalidFragmentV3 = InvalidVerificationFragment<InvalidDidSignedDataV3>;
export type OpenAttestationDidSignedDocumentStatusErrorFragment = ErrorVerificationFragment<any>;
export type OpenAttestationDidSignedDocumentStatusVerificationFragment =
  | OpenAttestationDidSignedDocumentStatusValidFragmentV2
  | OpenAttestationDidSignedDocumentStatusInvalidFragmentV2
  | OpenAttestationDidSignedDocumentStatusValidFragmentV3
  | OpenAttestationDidSignedDocumentStatusInvalidFragmentV3
  | OpenAttestationDidSignedDocumentStatusErrorFragment
  | SkippedVerificationFragment;
