import { EthersError, Hash, Reason } from "../..";
export declare const contractNotIssued: (merkleRoot: Hash, address: string) => Reason;
export declare const contractRevoked: (merkleRoot: string, address: string) => Reason;
/**
 * This function handles all non-200 HTTP response codes (e.g. Infura/Cloudflare rate limits, Cloudflare's random 502)
 * @param address the document store address
 * TODO: Add the same for tokenStore
 */
export declare const badResponse: () => Reason;
export declare const getErrorReason: (error: EthersError, address: string) => Reason | null;
