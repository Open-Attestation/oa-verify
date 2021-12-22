import { Array as RunTypesArray, Boolean, Literal, Record, String, Union, Number } from "runtypes";
import { Reason } from "../../../types/error";
import { RevocationStatus, RevocationStatusArray, ValidRevocationStatus, ValidRevocationStatusArray, OcspResponderRevocationStatus, } from "../revocation.types";
/**
 * DID signed issuance status
 */
export var ValidDidSignedIssuanceStatus = Record({
    did: String,
    issued: Literal(true),
});
export var ValidDidSignedIssuanceStatusArray = RunTypesArray(ValidDidSignedIssuanceStatus);
export var InvalidDidSignedIssuanceStatus = Record({
    did: String,
    issued: Literal(false),
    reason: Reason,
});
export var DidSignedIssuanceStatus = Union(ValidDidSignedIssuanceStatus, InvalidDidSignedIssuanceStatus);
export var DidSignedIssuanceStatusArray = RunTypesArray(DidSignedIssuanceStatus);
/**
 * OCSP response
 */
export var ValidOcspReasonCode = Number.withConstraint(function (n) { return n >= 0 && n <= 10 && n != 7; });
export var ValidOcspResponse = Record({
    certificateStatus: OcspResponderRevocationStatus,
});
export var ValidOcspResponseRevoked = Record({
    reasonCode: ValidOcspReasonCode,
    certificateStatus: OcspResponderRevocationStatus,
});
/**
 * Data for v2 Fragments
 */
export var ValidDidSignedDataV2 = Record({
    issuedOnAll: Literal(true),
    revokedOnAny: Literal(false),
    details: Record({
        issuance: ValidDidSignedIssuanceStatusArray,
        revocation: ValidRevocationStatusArray,
    }),
});
export var InvalidDidSignedDataV2 = Record({
    issuedOnAll: Boolean,
    revokedOnAny: Boolean,
    details: Record({
        issuance: DidSignedIssuanceStatusArray,
        revocation: RevocationStatusArray,
    }),
});
/**
 * Data for v3 Fragments
 */
export var ValidDidSignedDataV3 = Record({
    issuedOnAll: Literal(true),
    revokedOnAny: Literal(false),
    details: Record({
        issuance: ValidDidSignedIssuanceStatus,
        revocation: ValidRevocationStatus,
    }),
});
export var InvalidDidSignedDataV3 = Record({
    issuedOnAll: Boolean,
    revokedOnAny: Boolean,
    details: Record({
        issuance: DidSignedIssuanceStatus,
        revocation: RevocationStatus,
    }),
});
