import {
  verifySignature,
  SchematisedDocument
} from "@govtechsg/open-attestation";

export const verifyHash = async (document: SchematisedDocument) => ({
  checksumMatch: await verifySignature(document)
});
