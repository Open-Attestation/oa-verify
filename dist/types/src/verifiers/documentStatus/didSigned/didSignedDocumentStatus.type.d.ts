import { Array as RunTypesArray, Boolean, Literal, Record, Static, String, Union, Number } from "runtypes";
import { ErrorVerificationFragment, InvalidVerificationFragment, SkippedVerificationFragment, ValidVerificationFragment } from "../../../types/core";
/**
 * DID signed issuance status
 */
export declare const ValidDidSignedIssuanceStatus: Record<{
    did: String;
    issued: Literal<true>;
}, false>;
export declare type ValidDidSignedIssuanceStatus = Static<typeof ValidDidSignedIssuanceStatus>;
export declare const ValidDidSignedIssuanceStatusArray: RunTypesArray<Record<{
    did: String;
    issued: Literal<true>;
}, false>, false>;
export declare type ValidDidSignedIssuanceStatusArray = Static<typeof ValidDidSignedIssuanceStatusArray>;
export declare const InvalidDidSignedIssuanceStatus: Record<{
    did: String;
    issued: Literal<false>;
    reason: Record<{
        code: Number;
        /**
         * Data for v3 Fragments
         */
        codeString: String;
        message: String;
    }, false>;
}, false>;
export declare type InvalidDidSignedIssuanceStatus = Static<typeof InvalidDidSignedIssuanceStatus>;
export declare const DidSignedIssuanceStatus: Union<[Record<{
    did: String;
    issued: Literal<true>;
}, false>, Record<{
    did: String;
    issued: Literal<false>;
    reason: Record<{
        code: Number;
        /**
         * Data for v3 Fragments
         */
        codeString: String;
        message: String;
    }, false>;
}, false>]>;
export declare type DidSignedIssuanceStatus = Static<typeof DidSignedIssuanceStatus>;
export declare const DidSignedIssuanceStatusArray: RunTypesArray<Union<[Record<{
    did: String;
    issued: Literal<true>;
}, false>, Record<{
    did: String;
    issued: Literal<false>;
    reason: Record<{
        code: Number;
        /**
         * Data for v3 Fragments
         */
        codeString: String;
        message: String;
    }, false>;
}, false>]>, false>;
export declare type DidSignedIssuanceStatusArray = Static<typeof DidSignedIssuanceStatusArray>;
/**
 * OCSP response
 */
export declare const ValidOcspReasonCode: import("runtypes").Constraint<Number, number, unknown>;
export declare const ValidOcspResponse: Record<{
    certificateStatus: Union<[Literal<"good">, Literal<"revoked">, Literal<"unknown">]>;
}, false>;
export declare const ValidOcspResponseRevoked: Record<{
    reasonCode: import("runtypes").Constraint<Number, number, unknown>;
    certificateStatus: Union<[Literal<"good">, Literal<"revoked">, Literal<"unknown">]>;
}, false>;
/**
 * Data for v2 Fragments
 */
export declare const ValidDidSignedDataV2: Record<{
    issuedOnAll: Literal<true>;
    revokedOnAny: Literal<false>;
    details: Record<{
        issuance: RunTypesArray<Record<{
            did: String;
            issued: Literal<true>;
        }, false>, false>;
        revocation: RunTypesArray<Record<{
            revoked: Literal<false>;
            address: import("runtypes").Optional<String>;
        }, false>, false>;
    }, false>;
}, false>;
export declare type ValidDidSignedDataV2 = Static<typeof ValidDidSignedDataV2>;
export declare const InvalidDidSignedDataV2: Record<{
    issuedOnAll: Boolean;
    revokedOnAny: Boolean;
    details: Record<{
        issuance: RunTypesArray<Union<[Record<{
            did: String;
            issued: Literal<true>;
        }, false>, Record<{
            did: String;
            issued: Literal<false>;
            reason: Record<{
                code: Number;
                /**
                 * Data for v3 Fragments
                 */
                codeString: String;
                message: String;
            }, false>;
        }, false>]>, false>;
        revocation: RunTypesArray<Union<[Record<{
            revoked: Literal<false>;
            address: import("runtypes").Optional<String>;
        }, false>, Record<{
            revoked: Literal<true>;
            address: String;
            reason: Record<{
                code: Number;
                /**
                 * Data for v3 Fragments
                 */
                codeString: String;
                message: String;
            }, false>;
        }, false>]>, false>;
    }, false>;
}, false>;
export declare type InvalidDidSignedDataV2 = Static<typeof InvalidDidSignedDataV2>;
/**
 * Data for v3 Fragments
 */
export declare const ValidDidSignedDataV3: Record<{
    issuedOnAll: Literal<true>;
    revokedOnAny: Literal<false>;
    details: Record<{
        issuance: Record<{
            did: String;
            issued: Literal<true>;
        }, false>;
        revocation: Record<{
            revoked: Literal<false>;
            address: import("runtypes").Optional<String>;
        }, false>;
    }, false>;
}, false>;
export declare type ValidDidSignedDataV3 = Static<typeof ValidDidSignedDataV3>;
export declare const InvalidDidSignedDataV3: Record<{
    issuedOnAll: Boolean;
    revokedOnAny: Boolean;
    details: Record<{
        issuance: Union<[Record<{
            did: String;
            issued: Literal<true>;
        }, false>, Record<{
            did: String;
            issued: Literal<false>;
            reason: Record<{
                code: Number;
                /**
                 * Data for v3 Fragments
                 */
                codeString: String;
                message: String;
            }, false>;
        }, false>]>;
        revocation: Union<[Record<{
            revoked: Literal<false>;
            address: import("runtypes").Optional<String>;
        }, false>, Record<{
            revoked: Literal<true>;
            address: String;
            reason: Record<{
                code: Number;
                /**
                 * Data for v3 Fragments
                 */
                codeString: String;
                message: String;
            }, false>;
        }, false>]>;
    }, false>;
}, false>;
export declare type InvalidDidSignedDataV3 = Static<typeof InvalidDidSignedDataV3>;
/**
 * Fragments
 */
export declare type OpenAttestationDidSignedDocumentStatusValidFragmentV2 = ValidVerificationFragment<ValidDidSignedDataV2>;
export declare type OpenAttestationDidSignedDocumentStatusInvalidFragmentV2 = InvalidVerificationFragment<InvalidDidSignedDataV2>;
export declare type OpenAttestationDidSignedDocumentStatusValidFragmentV3 = ValidVerificationFragment<ValidDidSignedDataV3>;
export declare type OpenAttestationDidSignedDocumentStatusInvalidFragmentV3 = InvalidVerificationFragment<InvalidDidSignedDataV3>;
export declare type OpenAttestationDidSignedDocumentStatusErrorFragment = ErrorVerificationFragment<any>;
export declare type OpenAttestationDidSignedDocumentStatusVerificationFragment = OpenAttestationDidSignedDocumentStatusValidFragmentV2 | OpenAttestationDidSignedDocumentStatusInvalidFragmentV2 | OpenAttestationDidSignedDocumentStatusValidFragmentV3 | OpenAttestationDidSignedDocumentStatusInvalidFragmentV3 | OpenAttestationDidSignedDocumentStatusErrorFragment | SkippedVerificationFragment;
