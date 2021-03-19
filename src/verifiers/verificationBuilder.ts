import {
  VerificationBuilderOptions,
  VerificationFragment,
  PromiseCallback,
  Verifier,
  VerifierOptions,
  DocumentsToVerify,
} from "../types/core";
import { getProvider } from "../common/utils";

// keepinp the following code for posterity. If we want the function below to return better types, we can use the following
// type PromiseValue<T> = T extends Promise<infer U> ? U : never;
// Promise<PromiseValue<ReturnType<T["verify"] | T["skip"]>>[]>
/**
 * A verification manager will run a list of {@link Verifier} over a signed document.
 * Before running each verifier, the manager will make sure the verifier can handle the specific document by calling its exposed test function.
 * The manager will return the consolidated list of {@link VerificationFragment}
 */
export const verificationBuilder = <T extends Verifier<any>>(
  verifiers: T[],
  builderOptions: VerificationBuilderOptions
) => (document: DocumentsToVerify, promisesCallback?: PromiseCallback): Promise<VerificationFragment[]> => {
  const verifierOptions: VerifierOptions = {
    provider: getProvider(builderOptions),
    resolver: builderOptions.resolver,
  };
  const promises = verifiers.map((verifier) => {
    if (verifier.test(document, verifierOptions)) {
      return verifier.verify(document, verifierOptions);
    }
    return verifier.skip(document, verifierOptions);
  });

  promisesCallback?.(promises);
  return Promise.all(promises);
};
