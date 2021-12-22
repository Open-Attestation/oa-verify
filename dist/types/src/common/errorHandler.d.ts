import { DocumentsToVerify, ErrorVerificationFragment, VerificationFragment, VerificationFragmentType, VerifierOptions } from "../types/core";
export interface ErrorOptions {
    name: string;
    type: VerificationFragmentType;
    unexpectedErrorCode: number;
    unexpectedErrorString: string;
}
export declare const withCodedErrorHandler: <X extends VerificationFragment, T extends (document: DocumentsToVerify, options: VerifierOptions) => Promise<X>>(verify: T, errorOptions: ErrorOptions) => (document: DocumentsToVerify, options: VerifierOptions) => ReturnType<T> | Promise<ErrorVerificationFragment<any>>;
