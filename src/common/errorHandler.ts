import {
  DocumentsToVerify,
  ErrorVerificationFragment,
  VerificationFragment,
  VerificationFragmentType,
  Verifier,
  VerifierOptions,
} from "../types/core";

export interface ErrorOptions {
  name: string;
  type: VerificationFragmentType;
  unexpectedErrorCode: number;
  unexpectedErrorString: string;
}

export const withCodedErrorHandler = <X extends VerificationFragment, T extends Verifier<X>["verify"]>(
  verify: T,
  errorOptions: ErrorOptions
) => async (
  document: DocumentsToVerify,
  options: VerifierOptions
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/26781
): ReturnType<T> | Promise<ErrorVerificationFragment<any>> => {
  try {
    // Using return await to ensure async function execute in try block
    return await verify(document, options);
  } catch (e) {
    const { message, code, codeString } = e;
    const { name, type, unexpectedErrorCode, unexpectedErrorString } = errorOptions;
    if (message && code && codeString) {
      return {
        name,
        type,
        data: e,
        reason: {
          message,
          code,
          codeString,
        },
        status: "ERROR" as const,
      };
    } else {
      return {
        name,
        type,
        data: e,
        reason: {
          message: e.message,
          code: unexpectedErrorCode,
          codeString: unexpectedErrorString,
        },
        status: "ERROR" as const,
      };
    }
  }
};
