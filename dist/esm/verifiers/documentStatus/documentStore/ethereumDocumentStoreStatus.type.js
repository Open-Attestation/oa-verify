import { Array as RunTypesArray, Boolean, Literal, Optional, Record, String, Union } from "runtypes";
import { Reason } from "../../../types/error";
import { RevocationStatus, RevocationStatusArray, ValidRevocationStatus, ValidRevocationStatusArray, } from "../revocation.types";
/**
 * Document store issuance status
 */
export var ValidDocumentStoreIssuanceStatus = Record({
    issued: Literal(true),
    address: String,
});
export var ValidDocumentStoreIssuanceStatusArray = RunTypesArray(ValidDocumentStoreIssuanceStatus);
export var InvalidDocumentStoreIssuanceStatus = Record({
    issued: Literal(false),
    address: String,
    reason: Reason,
});
export var DocumentStoreIssuanceStatus = Union(ValidDocumentStoreIssuanceStatus, InvalidDocumentStoreIssuanceStatus);
export var DocumentStoreIssuanceStatusArray = RunTypesArray(DocumentStoreIssuanceStatus);
/**
 * Data for v2 Fragments
 */
var ValidDocumentStoreDataV2 = Record({
    issuedOnAll: Literal(true),
    revokedOnAny: Literal(false),
    details: Record({
        issuance: ValidDocumentStoreIssuanceStatusArray,
        revocation: ValidRevocationStatusArray,
    }),
});
export var InvalidDocumentStoreDataV2 = Record({
    issuedOnAll: Boolean,
    revokedOnAny: Optional(Boolean),
    details: Record({
        issuance: DocumentStoreIssuanceStatusArray,
        revocation: Optional(RevocationStatusArray),
    }),
});
/**
 * Data for v3 Fragments
 */
export var ValidDocumentStoreDataV3 = Record({
    issuedOnAll: Literal(true),
    revokedOnAny: Literal(false),
    details: Record({
        issuance: ValidDocumentStoreIssuanceStatus,
        revocation: ValidRevocationStatus,
    }),
});
export var InvalidDocumentStoreDataV3 = Record({
    issuedOnAll: Boolean,
    revokedOnAny: Boolean,
    details: Record({
        issuance: DocumentStoreIssuanceStatus,
        revocation: RevocationStatus,
    }),
});
