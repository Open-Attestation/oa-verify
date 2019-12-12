import { v3, WrappedDocument } from "@govtechsg/open-attestation";
import { VerificationFragment, VerificationManagerOptions, Verifier } from "../types/core";

/**
 * A verification manager will run a list of {@link Verifier} over a signed document.
 * Before running each verifier, the manager will make sure the verifier can handle the specific document by calling its exposed test function.
 * The manager will return the consolidated list of {@link VerificationFragment}
 */
export const verificationBuilder = <Document = WrappedDocument<v3.OpenAttestationDocument>>(
  verifiers: Verifier<Document>[]
) => (document: Document, options: VerificationManagerOptions): Promise<VerificationFragment[]> => {
  const promises: Promise<VerificationFragment>[] = verifiers.map(verifier => {
    if (verifier.test(document, options)) {
      return verifier.verify(document, options);
    }
    return verifier.skip(document, options);
  });

  options.promisesCallback?.(promises);
  return Promise.all(promises);
};
