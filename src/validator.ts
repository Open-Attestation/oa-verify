import { VerificationFragment, VerificationFragmentType } from "./types/core";

export const isValid = (
  verificationFragments: VerificationFragment[],
  types: VerificationFragmentType[] = ["DOCUMENT_STATUS", "DOCUMENT_INTEGRITY", "ISSUER_IDENTITY"]
) => {
  if (verificationFragments.length < 1) {
    throw new Error("Please provide at least one verification fragment to check");
  }
  if (types.length < 1) {
    throw new Error("Please provide at least one type to check");
  }
  return types.every(type => {
    const verificationFragmentsForType = verificationFragments.filter(fragment => fragment.type === type);
    // return true if at least one fragment is valid
    // and all fragments are valid or skipped
    return (
      verificationFragmentsForType.some(fragment => fragment.status === "VALID") &&
      verificationFragmentsForType.every(fragment => fragment.status === "VALID" || fragment.status === "SKIPPED")
    );
  });
};
