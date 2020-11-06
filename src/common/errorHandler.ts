import { Verifier, VerificationFragmentStatus, VerificationFragmentType } from "../types/core";

export interface ErrorOptions {
  name: string;
  type: VerificationFragmentType;
  unexpectedErrorCode: number;
  unexpectedErrorString: string;
}

export const withCodedErrorHandler = (verify: Verifier["verify"], errorOptions: ErrorOptions) => async (
  document: Parameters<Verifier["verify"]>[0],
  options: Parameters<Verifier["verify"]>[1]
) => {
  try {
    // Using return await to ensure async function execute in try block
    return await verify(document, options);
  } catch (e) {
    const { message, code, codeString } = e;
    const { name, type, unexpectedErrorCode, unexpectedErrorString } = errorOptions;
    if (message && code && codeString) {
      return {
        name,
        type: type as any,
        data: e,
        reason: {
          message,
          code,
          codeString,
        },
        status: "ERROR" as VerificationFragmentStatus,
      };
    } else {
      return {
        name,
        type: type as any,
        data: e,
        reason: {
          message: e.message,
          code: unexpectedErrorCode,
          codeString: unexpectedErrorString,
        },
        status: "ERROR" as VerificationFragmentStatus,
      };
    }
  }
};
