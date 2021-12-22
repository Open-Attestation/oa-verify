import { Array as RunTypesArray, Literal, Record, String, Union } from "runtypes";
import { Reason } from "../../../types/error";
/**
 * Token registry mint status
 */
export var ValidTokenRegistryStatus = Record({
    minted: Literal(true),
    address: String,
});
export var InvalidTokenRegistryStatus = Record({
    minted: Literal(false),
    address: String,
    reason: Reason,
});
/**
 * Data for v2 Fragments
 */
export var ValidTokenRegistryDataV2 = Record({
    mintedOnAll: Literal(true),
    details: RunTypesArray(ValidTokenRegistryStatus),
});
export var InvalidTokenRegistryDataV2 = Record({
    mintedOnAll: Literal(false),
    details: RunTypesArray(Union(ValidTokenRegistryStatus, InvalidTokenRegistryStatus)),
});
/**
 * Data for v3 Fragments
 */
export var ValidTokenRegistryDataV3 = Record({
    mintedOnAll: Literal(true),
    details: ValidTokenRegistryStatus,
});
export var InvalidTokenRegistryDataV3 = Record({
    mintedOnAll: Literal(false),
    details: InvalidTokenRegistryStatus,
});
