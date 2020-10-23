import { CodedError } from "../../../common/error";
import { VerifierResults } from "../../../types/core";

export const codedErrorResponse = ({
  verifier,
  unexpectedErrorCode,
  unexpectedErrorCodeString = "UNEXPECTED_ERROR",
}: {
  verifier: string;
  unexpectedErrorCode: number;
  unexpectedErrorCodeString?: string;
}) => (e: Error | CodedError): VerifierResults => ({
  verifier,
  status: "ERROR",
  reason: {
    message: e.message,
    code: e instanceof CodedError ? e.code : unexpectedErrorCode,
    codeString: e instanceof CodedError ? e.codeString : unexpectedErrorCodeString,
  },
});
