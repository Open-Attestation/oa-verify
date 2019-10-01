import {
  verifySignature,
  SchematisedDocument
} from "@govtechsg/open-attestation";

export const verifyHash = (document: SchematisedDocument) => ({
  checksumMatch: verifySignature(document)
});
