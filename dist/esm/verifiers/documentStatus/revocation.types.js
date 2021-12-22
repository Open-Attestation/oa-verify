import { Literal, Record, String, Union, Array as RunTypesArray, Optional } from "runtypes";
import { Reason } from "../../types/error";
export var ValidRevocationStatus = Record({
    revoked: Literal(false),
    address: Optional(String),
});
export var ValidRevocationStatusArray = RunTypesArray(ValidRevocationStatus);
export var InvalidRevocationStatus = Record({
    revoked: Literal(true),
    address: String,
    reason: Reason,
});
export var RevocationStatus = Union(ValidRevocationStatus, InvalidRevocationStatus);
export var RevocationStatusArray = RunTypesArray(RevocationStatus);
export var OcspResponderRevocationStatus = Union(Literal("good"), Literal("revoked"), Literal("unknown"));
export var OcspResponderRevocationReason;
(function (OcspResponderRevocationReason) {
    OcspResponderRevocationReason[OcspResponderRevocationReason["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    OcspResponderRevocationReason[OcspResponderRevocationReason["KEY_COMPROMISE"] = 1] = "KEY_COMPROMISE";
    OcspResponderRevocationReason[OcspResponderRevocationReason["CA_COMPROMISE"] = 2] = "CA_COMPROMISE";
    OcspResponderRevocationReason[OcspResponderRevocationReason["AFFILIATION_CHANGED"] = 3] = "AFFILIATION_CHANGED";
    OcspResponderRevocationReason[OcspResponderRevocationReason["SUPERSEDED"] = 4] = "SUPERSEDED";
    OcspResponderRevocationReason[OcspResponderRevocationReason["CESSATION_OF_OPERATION"] = 5] = "CESSATION_OF_OPERATION";
    OcspResponderRevocationReason[OcspResponderRevocationReason["CERTIFICATE_HOLD"] = 6] = "CERTIFICATE_HOLD";
    OcspResponderRevocationReason[OcspResponderRevocationReason["REMOVE_FROM_CRL"] = 8] = "REMOVE_FROM_CRL";
    OcspResponderRevocationReason[OcspResponderRevocationReason["PRIVILEGE_WITHDRAWN"] = 9] = "PRIVILEGE_WITHDRAWN";
    OcspResponderRevocationReason[OcspResponderRevocationReason["A_A_COMPROMISE"] = 10] = "A_A_COMPROMISE";
})(OcspResponderRevocationReason || (OcspResponderRevocationReason = {}));
