import { SignedWrappedDocument, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { Resolver } from "did-resolver";
import { providers } from "ethers";
import { Reason } from "./error";

/**
 * Callback function that will provide back the promises resolving to the verification fragment. It will be called before the promises are all resolved and thus give the possibility to consumers to perform their own extra checks.
 */
export type PromiseCallback = (promises: Promise<VerificationFragment>[]) => void;

export interface VerificationBuilderOptionsWithProvider {
  provider: providers.Provider;
  resolver?: Resolver;
}

export interface VerificationBuilderOptionsWithNetwork {
  network: string;
  resolver?: Resolver;
  provider?: never;
}

export type VerificationBuilderOptions = VerificationBuilderOptionsWithProvider | VerificationBuilderOptionsWithNetwork;

export interface VerifierOptions {
  provider: providers.Provider;
  resolver?: Resolver;
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
export interface VerificationFragment {
  name: string;
  type: VerificationFragmentType;
  status: VerificationFragmentStatus;
}

export interface ValidVerificationFragment<Data> extends VerificationFragment {
  status: "VALID";
  data: Data;
  // this is useless, it's just to make it easier to work with fragment, otherwise reason is not available and a consumer needs to narrow the type down first
  reason?: never;
}
export interface InvalidVerificationFragment<Data> extends VerificationFragment {
  status: "INVALID";
  reason: Reason;
  data: Data;
}
export interface ErrorVerificationFragment<Data> extends VerificationFragment {
  status: "ERROR";
  reason: Reason;
  data: Data;
}
export interface SkippedVerificationFragment extends VerificationFragment {
  status: "SKIPPED";
  reason: Reason;
  // this is useless, it's just to make it easier to work with fragment, otherwise data is not available and a consumer needs to narrow the type down first
  data?: never;
}
export type VerificationFragmentType = "DOCUMENT_INTEGRITY" | "DOCUMENT_STATUS" | "ISSUER_IDENTITY";
export type VerificationFragmentStatus = "ERROR" | "VALID" | "INVALID" | "SKIPPED";

/**
 * type for combined verification fragments that will hold data
 */
export type VerificationFragmentWithData<Data = any> =
  | ValidVerificationFragment<Data>
  | InvalidVerificationFragment<Data>
  | ErrorVerificationFragment<Data>;
export const isVerificationFragmentWithData = <T>(fragment: any): fragment is VerificationFragmentWithData<T> =>
  fragment.data;

/**
 * type for all verification fragments
 */
export type AllVerificationFragment<Data = any> = VerificationFragmentWithData<Data> | SkippedVerificationFragment;

/**
 * A verifier is an object whose goal is to perform specific validation on a signed document. It exposes
 * - a *test* function, who must return true or false. The function must indicate whether condition are fulfilled for the verifier to run on a specific signed document
 * - a *verify* function, who must return the result of the verification as a {@link VerificationFragment}
 * - a *skip* function, who must return the result of a verification when it's skipped by providing additional data on why the validation didn't run.
 */
export interface Verifier<V extends VerificationFragment> {
  skip: (document: DocumentsToVerify, options: VerifierOptions) => Promise<SkippedVerificationFragment>;
  test: (document: DocumentsToVerify, options: VerifierOptions) => boolean;
  verify: (document: DocumentsToVerify, options: VerifierOptions) => Promise<V>;
}
export type Hash = string;

export type DocumentsToVerify =
  | WrappedDocument<v2.OpenAttestationDocument>
  | WrappedDocument<v3.OpenAttestationDocument>
  | SignedWrappedDocument<v2.OpenAttestationDocument>;

export type providerType = "alchemy" | "etherscan" | "infura" | "jsonrpc";

export interface ProviderDetails {
  network?: string;
  providerType?: providerType;
  url?: string;
  apiKey?: string;
}
