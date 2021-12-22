import { Array as RunTypesArray, Literal, Record, Static, String, Union } from "runtypes";
import { ErrorVerificationFragment, InvalidVerificationFragment, SkippedVerificationFragment, ValidVerificationFragment } from "../../../types/core";
/**
 * Token registry mint status
 */
export declare const ValidTokenRegistryStatus: Record<{
    minted: Literal<true>;
    address: String;
}, false>;
export declare type ValidTokenRegistryStatus = Static<typeof ValidTokenRegistryStatus>;
export declare const InvalidTokenRegistryStatus: Record<{
    minted: Literal<false>;
    address: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>;
export declare type InvalidTokenRegistryStatus = Static<typeof InvalidTokenRegistryStatus>;
/**
 * Data for v2 Fragments
 */
export declare const ValidTokenRegistryDataV2: Record<{
    mintedOnAll: Literal<true>;
    details: RunTypesArray<Record<{
        minted: Literal<true>;
        address: String;
    }, false>, false>;
}, false>;
export declare type ValidTokenRegistryDataV2 = Static<typeof ValidTokenRegistryDataV2>;
export declare const InvalidTokenRegistryDataV2: Record<{
    mintedOnAll: Literal<false>;
    details: RunTypesArray<Union<[Record<{
        minted: Literal<true>;
        address: String;
    }, false>, Record<{
        minted: Literal<false>;
        address: String;
        reason: Record<{
            code: import("runtypes").Number;
            codeString: String;
            message: String;
        }, false>;
    }, false>]>, false>;
}, false>;
export declare type InvalidTokenRegistryDataV2 = Static<typeof InvalidTokenRegistryDataV2>;
/**
 * Data for v3 Fragments
 */
export declare const ValidTokenRegistryDataV3: Record<{
    mintedOnAll: Literal<true>;
    details: Record<{
        minted: Literal<true>;
        address: String;
    }, false>;
}, false>;
export declare type ValidTokenRegistryDataV3 = Static<typeof ValidTokenRegistryDataV3>;
export declare const InvalidTokenRegistryDataV3: Record<{
    mintedOnAll: Literal<false>;
    details: Record<{
        minted: Literal<false>;
        address: String;
        reason: Record<{
            code: import("runtypes").Number;
            codeString: String;
            message: String;
        }, false>;
    }, false>;
}, false>;
export declare type InvalidTokenRegistryDataV3 = Static<typeof InvalidTokenRegistryDataV3>;
/**
 * Fragments
 */
export declare type OpenAttestationEthereumTokenRegistryStatusValidFragmentV2 = ValidVerificationFragment<ValidTokenRegistryDataV2>;
export declare type OpenAttestationEthereumTokenRegistryStatusValidFragmentV3 = ValidVerificationFragment<ValidTokenRegistryDataV3>;
export declare type OpenAttestationEthereumTokenRegistryStatusInvalidFragmentV2 = InvalidVerificationFragment<InvalidTokenRegistryDataV2>;
export declare type OpenAttestationEthereumTokenRegistryStatusInvalidFragmentV3 = InvalidVerificationFragment<InvalidTokenRegistryDataV3>;
export declare type OpenAttestationEthereumTokenRegistryStatusErrorFragment = ErrorVerificationFragment<any>;
export declare type OpenAttestationEthereumTokenRegistryStatusFragment = OpenAttestationEthereumTokenRegistryStatusValidFragmentV2 | OpenAttestationEthereumTokenRegistryStatusValidFragmentV3 | OpenAttestationEthereumTokenRegistryStatusInvalidFragmentV2 | OpenAttestationEthereumTokenRegistryStatusInvalidFragmentV3 | OpenAttestationEthereumTokenRegistryStatusErrorFragment | SkippedVerificationFragment;
