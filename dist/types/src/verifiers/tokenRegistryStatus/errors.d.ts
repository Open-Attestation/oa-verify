import { Hash } from "../../types/core";
import { EthersError, Reason } from "../../types/error";
export declare const contractNotMinted: (merkleRoot: Hash, address: string) => Reason;
export declare const missingResponse: () => Reason;
export declare const badResponse: () => Reason;
export declare const getErrorReason: (error: EthersError, address: string, hash: Hash) => Reason;
