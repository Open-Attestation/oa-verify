import { VerificationFragment } from "../../src/types/core";

export const getFailingFragments = (fragments: VerificationFragment[]) => {
  return fragments.filter((fragment) => fragment.status === "INVALID" || fragment.status === "ERROR");
};
