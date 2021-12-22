"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcspResponderRevocationReason = exports.OcspResponderRevocationStatus = exports.RevocationStatusArray = exports.RevocationStatus = exports.InvalidRevocationStatus = exports.ValidRevocationStatusArray = exports.ValidRevocationStatus = void 0;
var runtypes_1 = require("runtypes");
var error_1 = require("../../types/error");
exports.ValidRevocationStatus = runtypes_1.Record({
    revoked: runtypes_1.Literal(false),
    address: runtypes_1.Optional(runtypes_1.String),
});
exports.ValidRevocationStatusArray = runtypes_1.Array(exports.ValidRevocationStatus);
exports.InvalidRevocationStatus = runtypes_1.Record({
    revoked: runtypes_1.Literal(true),
    address: runtypes_1.String,
    reason: error_1.Reason,
});
exports.RevocationStatus = runtypes_1.Union(exports.ValidRevocationStatus, exports.InvalidRevocationStatus);
exports.RevocationStatusArray = runtypes_1.Array(exports.RevocationStatus);
exports.OcspResponderRevocationStatus = runtypes_1.Union(runtypes_1.Literal("good"), runtypes_1.Literal("revoked"), runtypes_1.Literal("unknown"));
var OcspResponderRevocationReason;
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
})(OcspResponderRevocationReason = exports.OcspResponderRevocationReason || (exports.OcspResponderRevocationReason = {}));
