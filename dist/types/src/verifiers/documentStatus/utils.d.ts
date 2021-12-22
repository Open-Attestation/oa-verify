import { DocumentStore } from "@govtechsg/document-store";
import { providers } from "ethers";
import { Hash } from "../../types/core";
import { RevocationStatus } from "./revocation.types";
export declare const getIntermediateHashes: (targetHash: Hash, proofs?: Hash[]) => string[];
/**
 * Try to decode the error to see if we can deterministically tell if the document has NOT been issued or revoked.
 *
 * In case where we cannot tell, we throw an error
 * */
export declare const decodeError: (error: any) => "Invalid document store address" | "Contract is not found" | "Invalid call arguments" | "ENS name is not configured" | "Bad document store address checksum" | "ENS name is not found";
/**
 * Given a list of hashes, check against one smart contract if any of the hash has been revoked
 * */
export declare const isAnyHashRevoked: (smartContract: DocumentStore, intermediateHashes: Hash[]) => Promise<string | undefined>;
export declare const isRevokedByOcspResponder: ({ certificateId, location, }: {
    certificateId: string;
    location: string;
}) => Promise<RevocationStatus>;
export declare const isRevokedOnDocumentStore: ({ documentStore, merkleRoot, provider, targetHash, proofs, }: {
    documentStore: string;
    merkleRoot: string;
    provider: providers.Provider;
    targetHash: Hash;
    proofs?: string[] | undefined;
}) => Promise<RevocationStatus>;
