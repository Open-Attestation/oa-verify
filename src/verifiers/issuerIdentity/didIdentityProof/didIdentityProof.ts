import { v2, v3, WrappedDocument, getData } from "@govtechsg/open-attestation";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidSignedDidIdentityProofCode } from "../../../types/error";
import { verifySignature, DidVerificationStatus } from "../../../did/verifier";

const name = "OpenAttestationDidSignedDidIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDidSignedDidIdentityProofCode.SKIPPED,
      codeString: OpenAttestationDidSignedDidIdentityProofCode[OpenAttestationDidSignedDidIdentityProofCode.SKIPPED],
      message: `Document is not using DID as top level identifier`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  const { issuers } = getData(document) as any; // TODO Casting to any first to prevent change at the OA level
  if (issuers.some((issuer: any) => issuer.identityProof?.type === "DID")) return true;
  return false;
};

const verify: VerifierType["verify"] = async (_document, _option) => {
  const document = _document as any; // TODO Casting to any first to prevent change at the OA level
  const data: any = getData(document);
  const merkleRoot = `0x${document.signature.merkleRoot}`;
  const issuers = data.issuers.filter(
    (issuer: any) => issuer.identityProof.type === "DID" || issuer.identityProof.type === "DNS-DID"
  );
  const signatureVerificationDeferred: DidVerificationStatus[] = issuers.map((issuer: any) =>
    verifySignature({ merkleRoot, identityProof: issuer.identityProof, proof: document.proof, did: issuer.id })
  );
  const signatureVerifications = await (await Promise.all(signatureVerificationDeferred)).map(({ did, verified }) => ({
    did,
    status: verified ? "VALID" : "INVALID",
  }));
  const signedOnAll = signatureVerifications.every((i) => i.status === "VALID");

  return {
    name,
    type,
    data: signatureVerifications,
    status: signedOnAll ? "VALID" : "INVALID",
  };
};

export const OpenAttestationDidSignedDidIdentityProof: VerifierType = {
  skip,
  test,
  verify,
};
