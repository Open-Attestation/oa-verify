import { VerificationFragment, VerificationManagerOptions, Verifier } from "../types/core";
/**
 * A verification manager will run a list of {@link Verifier} over a signed document.
 * Before running each verifier, the manager will make sure the verifier can handle the specific document by calling its exposed test function.
 * The manager will return the consolidated list of {@link VerificationFragment}
 */
export declare const verificationBuilder: <Document>(verifiers: Verifier<Document, VerificationManagerOptions, any>[]) => (document: Document, options: VerificationManagerOptions) => Promise<VerificationFragment[]>;
