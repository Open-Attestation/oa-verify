import { Literal, Record, Static, String, Union, Array as RunTypesArray, Optional } from "runtypes";
export declare const ValidRevocationStatus: Record<{
    revoked: Literal<false>;
    address: Optional<String>;
}, false>;
export declare type ValidRevocationStatus = Static<typeof ValidRevocationStatus>;
export declare const ValidRevocationStatusArray: RunTypesArray<Record<{
    revoked: Literal<false>;
    address: Optional<String>;
}, false>, false>;
export declare type ValidRevocationStatusArray = Static<typeof ValidRevocationStatusArray>;
export declare const InvalidRevocationStatus: Record<{
    revoked: Literal<true>;
    address: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>;
export declare type InvalidRevocationStatus = Static<typeof InvalidRevocationStatus>;
export declare const RevocationStatus: Union<[Record<{
    revoked: Literal<false>;
    address: Optional<String>;
}, false>, Record<{
    revoked: Literal<true>;
    address: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>]>;
export declare type RevocationStatus = Static<typeof RevocationStatus>;
export declare const RevocationStatusArray: RunTypesArray<Union<[Record<{
    revoked: Literal<false>;
    address: Optional<String>;
}, false>, Record<{
    revoked: Literal<true>;
    address: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>]>, false>;
export declare type RevocationStatusArray = Static<typeof RevocationStatusArray>;
export declare const OcspResponderRevocationStatus: Union<[Literal<"good">, Literal<"revoked">, Literal<"unknown">]>;
export declare type OcspResponderRevocationStatus = Static<typeof OcspResponderRevocationStatus>;
export declare enum OcspResponderRevocationReason {
    UNSPECIFIED = 0,
    KEY_COMPROMISE = 1,
    CA_COMPROMISE = 2,
    AFFILIATION_CHANGED = 3,
    SUPERSEDED = 4,
    CESSATION_OF_OPERATION = 5,
    CERTIFICATE_HOLD = 6,
    REMOVE_FROM_CRL = 8,
    PRIVILEGE_WITHDRAWN = 9,
    A_A_COMPROMISE = 10
}
