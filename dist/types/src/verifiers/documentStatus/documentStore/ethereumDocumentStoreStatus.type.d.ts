import { Array as RunTypesArray, Boolean, Literal, Optional, Record, Static, String, Union } from "runtypes";
import { ErrorVerificationFragment, InvalidVerificationFragment, SkippedVerificationFragment, ValidVerificationFragment } from "../../../types/core";
/**
 * Document store issuance status
 */
export declare const ValidDocumentStoreIssuanceStatus: Record<{
    issued: Literal<true>;
    address: String;
}, false>;
export declare type ValidDocumentStoreIssuanceStatus = Static<typeof ValidDocumentStoreIssuanceStatus>;
export declare const ValidDocumentStoreIssuanceStatusArray: RunTypesArray<Record<{
    issued: Literal<true>;
    address: String;
}, false>, false>;
export declare type ValidDocumentStoreIssuanceStatusArray = Static<typeof ValidDocumentStoreIssuanceStatusArray>;
export declare const InvalidDocumentStoreIssuanceStatus: Record<{
    issued: Literal<false>;
    address: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>;
export declare type InvalidDocumentStoreIssuanceStatus = Static<typeof InvalidDocumentStoreIssuanceStatus>;
export declare const DocumentStoreIssuanceStatus: Union<[Record<{
    issued: Literal<true>;
    address: String;
}, false>, Record<{
    issued: Literal<false>;
    address: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>]>;
export declare type DocumentStoreIssuanceStatus = Static<typeof DocumentStoreIssuanceStatus>;
export declare const DocumentStoreIssuanceStatusArray: RunTypesArray<Union<[Record<{
    issued: Literal<true>;
    address: String;
}, false>, Record<{
    issued: Literal<false>;
    address: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>]>, false>;
export declare type DocumentStoreIssuanceStatusArray = Static<typeof DocumentStoreIssuanceStatusArray>;
/**
 * Data for v2 Fragments
 */
declare const ValidDocumentStoreDataV2: Record<{
    issuedOnAll: Literal<true>;
    revokedOnAny: Literal<false>;
    details: Record<{
        issuance: RunTypesArray<Record<{
            issued: Literal<true>;
            address: String;
        }, false>, false>;
        revocation: RunTypesArray<Record<{
            revoked: Literal<false>;
            address: Optional<String>;
        }, false>, false>;
    }, false>;
}, false>;
export declare type ValidDocumentStoreDataV2 = Static<typeof ValidDocumentStoreDataV2>;
export declare const InvalidDocumentStoreDataV2: Record<{
    issuedOnAll: Boolean;
    revokedOnAny: Optional<Boolean>;
    details: Record<{
        issuance: RunTypesArray<Union<[Record<{
            issued: Literal<true>;
            address: String;
        }, false>, Record<{
            issued: Literal<false>;
            address: String;
            reason: Record<{
                code: import("runtypes").Number;
                codeString: String;
                message: String;
            }, false>;
        }, false>]>, false>;
        revocation: Optional<RunTypesArray<Union<[Record<{
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
        }, false>]>, false>>;
    }, false>;
}, false>;
export declare type InvalidDocumentStoreDataV2 = Static<typeof InvalidDocumentStoreDataV2>;
/**
 * Data for v3 Fragments
 */
export declare const ValidDocumentStoreDataV3: Record<{
    issuedOnAll: Literal<true>;
    revokedOnAny: Literal<false>;
    details: Record<{
        issuance: Record<{
            issued: Literal<true>;
            address: String;
        }, false>;
        revocation: Record<{
            revoked: Literal<false>;
            address: Optional<String>;
        }, false>;
    }, false>;
}, false>;
export declare type ValidDocumentStoreDataV3 = Static<typeof ValidDocumentStoreDataV3>;
export declare const InvalidDocumentStoreDataV3: Record<{
    issuedOnAll: Boolean;
    revokedOnAny: Boolean;
    details: Record<{
        issuance: Union<[Record<{
            issued: Literal<true>;
            address: String;
        }, false>, Record<{
            issued: Literal<false>;
            address: String;
            reason: Record<{
                code: import("runtypes").Number;
                codeString: String;
                message: String;
            }, false>;
        }, false>]>;
        revocation: Union<[Record<{
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
    }, false>;
}, false>;
export declare type InvalidDocumentStoreDataV3 = Static<typeof InvalidDocumentStoreDataV3>;
/**
 * Fragments
 */
export declare type OpenAttestationEthereumDocumentStoreStatusFragmentValidFragmentV2 = ValidVerificationFragment<ValidDocumentStoreDataV2>;
export declare type OpenAttestationEthereumDocumentStoreStatusFragmentInvalidFragmentV2 = InvalidVerificationFragment<InvalidDocumentStoreDataV2>;
export declare type OpenAttestationEthereumDocumentStoreStatusFragmentValidFragmentV3 = ValidVerificationFragment<ValidDocumentStoreDataV3>;
export declare type OpenAttestationEthereumDocumentStoreStatusFragmentInvalidFragmentV3 = InvalidVerificationFragment<InvalidDocumentStoreDataV3>;
export declare type OpenAttestationEthereumDocumentStoreStatusErrorFragment = ErrorVerificationFragment<any>;
export declare type OpenAttestationEthereumDocumentStoreStatusFragment = OpenAttestationEthereumDocumentStoreStatusFragmentValidFragmentV2 | OpenAttestationEthereumDocumentStoreStatusFragmentInvalidFragmentV2 | OpenAttestationEthereumDocumentStoreStatusFragmentValidFragmentV3 | OpenAttestationEthereumDocumentStoreStatusFragmentInvalidFragmentV3 | OpenAttestationEthereumDocumentStoreStatusErrorFragment | SkippedVerificationFragment;
export {};
