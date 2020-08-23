import { EthersError, Hash, Reason } from "../..";
export declare const contractNotIssued: (merkleRoot: Hash, address: string) => Reason;
export declare const contractRevoked: (merkleRoot: string, address: string) => Reason;
export declare const missingResponse: () => Reason;
export declare const badResponse: () => Reason;
export declare const getErrorReason: (error: EthersError, address: string) => Reason | null;
