import { Contract } from "ethers";
import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { Reason } from "./error";

/**
 * - network on which to run the verification (if needed to connect to ethereum), For instance "ropste" or "homestead"
 * - promisesCallback callback function that will provide back the promises resolving to the verification fragment. It will be called before the promises are all resolved and thus give the possibility to consumers to perform their own extra checks.
 */
export interface VerificationManagerOptions {
  network: string;
  promisesCallback?: (promises: Promise<VerificationFragment>[]) => void;
}

/**
 * A verification fragment is the result of a verification
 * It will *always*
 * - return the status
 *    - VALID: when the verification is successful
 *    - INVALID: when the verification is unsuccessful
 *    - ERROR: when an unexpected error is met
 *    - SKIPPED: when the verification was skipped by the manager
 * - return the type who indicate the kind of checks performed
 *    - DOCUMENT_INTEGRITY
 *    - DOCUMENT_STATUS
 *    - ISSUER_IDENTITY
 * - return the name who can help to determine the verifier that created the result
 *
 * Additional fields might be populated
 * - A reason to provide further information about the error/invalid/skipped state
 * - Data to provide further information
 */
export interface VerificationFragment<T = any> {
  name: string;
  type: VerificationFragmentType;
  data?: T;
  status: VerificationFragmentStatus;
  reason?: Reason;
}
export type VerificationFragmentType = "DOCUMENT_INTEGRITY" | "DOCUMENT_STATUS" | "ISSUER_IDENTITY";
export type VerificationFragmentStatus = "ERROR" | "VALID" | "INVALID" | "SKIPPED";

/**
 * A verifier is an object whose goal is to perform specific validation on a signed document. It exposes
 * - a *test* function, who must return true or false. The function must indicate whether condition are fulfilled for the verifier to run on a specific signed document
 * - a *verify* function, who must return the result of the verification as a {@link VerificationFragment}
 * - a *skip* function, who must return the result of a verification when it's skipped by providing additional data on why the validation didn't run.
 */
interface SkippedVerificationFragment extends VerificationFragment {
  status: "SKIPPED";
  reason: Reason;
}
export interface Verifier<
  Document = WrappedDocument<v3.OpenAttestationDocument> | WrappedDocument<v2.OpenAttestationDocument>,
  Options = VerificationManagerOptions,
  Data = any
> {
  skip: (document: Document, options: Options) => Promise<SkippedVerificationFragment>;
  test: (document: Document, options: Options) => boolean;
  verify: (document: Document, options: Options) => Promise<VerificationFragment<Data>>;
}
export type Hash = string;

export interface OpenAttestationContract {
  address: Hash;
  type: v3.Method;
  instance: Contract;
}

export const isWrappedV3Document = (document: any): document is WrappedDocument<v3.OpenAttestationDocument> => {
  return document && document.version === "open-attestation/3.0";
};
export const isWrappedV2Document = (document: any): document is WrappedDocument<v2.OpenAttestationDocument> => {
  return !isWrappedV3Document(document);
};
