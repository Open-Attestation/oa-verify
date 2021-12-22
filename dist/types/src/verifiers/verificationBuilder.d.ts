import { VerificationBuilderOptions, VerificationFragment, PromiseCallback, Verifier, DocumentsToVerify } from "../types/core";
export declare const verificationBuilder: <T extends Verifier<any>>(verifiers: T[], builderOptions: VerificationBuilderOptions) => (document: DocumentsToVerify, promisesCallback?: PromiseCallback | undefined) => Promise<VerificationFragment[]>;
