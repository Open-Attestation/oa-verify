import {
  VerificationBuilderOptions,
  VerificationFragment,
  PromiseCallback,
  Verifier,
  VerifierOptions,
} from "../types/core";
import { getProvider } from "../common/utils";

/**
 * A verification manager will run a list of {@link Verifier} over a signed document.
 * Before running each verifier, the manager will make sure the verifier can handle the specific document by calling its exposed test function.
 * The manager will return the consolidated list of {@link VerificationFragment}
 */
export const verificationBuilder = <Document>(
  verifiers: Verifier<Document>[],
  builderOptions: VerificationBuilderOptions
) => (document: Document, promisesCallback?: PromiseCallback): Promise<VerificationFragment[]> => {
  const verifierOptions: VerifierOptions = {
    provider: getProvider(builderOptions),
  };
  const promises: Promise<VerificationFragment>[] = verifiers.map((verifier) => {
    if (verifier.test(document, verifierOptions)) {
      return verifier.verify(document, verifierOptions);
    }
    return verifier.skip(document, verifierOptions);
  });

  promisesCallback?.(promises);
  return Promise.all(promises);
};
