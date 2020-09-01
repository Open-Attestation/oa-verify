import { v2, v3, WrappedDocument, getData } from "@govtechsg/open-attestation";
import { utils } from "ethers";
import { PublicKey } from "did-resolver";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationDidSignedDocumentStatusCode } from "../../../types/error";
import { getPublicKey } from "../../../did/resolver";

const name = "OpenAttestationDidSignedDocumentStatus";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationDidSignedDocumentStatusCode.SKIPPED,
      codeString: OpenAttestationDidSignedDocumentStatusCode[OpenAttestationDidSignedDocumentStatusCode.SKIPPED],
      message: `Document was not signed by DID directly`,
    },
  };
};

const test: VerifierType["test"] = (_document) => {
  const document = _document as any; // TODO Casting to any first to prevent change at the OA level
  if (document.proof && document.proof.some((proof: any) => proof.type === "DidGenericSignature")) return true;
  return false;
};

interface IdentityProof {
  type: string;
  id: string;
  purpose: string;
  key: {
    id: string;
    type: string;
  };
}
interface Proof {
  type: string;
  proofPurpose: string;
  verificationMethod: string;
  signature: string;
}

interface IssuanceStatus {
  issued: boolean;
  did: string;
  reason?: any;
}

interface VerifySignature {
  did: string;
  signature: string;
  merkleRoot: string;
  publicKey: PublicKey;
}

const verifySecp256k1VerificationKey2018 = ({
  did,
  publicKey,
  merkleRoot,
  signature,
}: VerifySignature): IssuanceStatus => {
  const messageBytes = utils.arrayify(merkleRoot);
  const { ethereumAddress } = publicKey;
  if (!ethereumAddress) {
    return {
      did,
      issued: false,
      reason: `ethereumAddress not found on public key ${JSON.stringify(publicKey)}`,
    };
  }

  return {
    did,
    issued: utils.verifyMessage(messageBytes, signature).toLowerCase() === ethereumAddress.toLowerCase(),
  };
};

const verifySignature = async (
  merkleRoot: string,
  identityProof: IdentityProof,
  proof: Proof[]
): Promise<IssuanceStatus> => {
  const { id: key, type } = identityProof.key;
  const { id: did } = identityProof;
  try {
    const publicKey = await getPublicKey(did, key);
    if (!publicKey) throw new Error(`No public key found on DID document for the DID ${did} and key ${key}`);

    const correspondingProof = proof.find((p) => p.verificationMethod.toLowerCase() === key.toLowerCase());
    if (!correspondingProof) throw new Error(`Proof not found for ${key}`);

    switch (type) {
      case "Secp256k1VerificationKey2018":
        return verifySecp256k1VerificationKey2018({
          did,
          publicKey,
          merkleRoot,
          signature: correspondingProof.signature,
        });
      default:
        throw new Error(`Signature type ${type} is currently not support`);
    }
  } catch (e) {
    return {
      did,
      issued: false,
      reason: e.message,
    };
  }
};

interface Revocation {
  type: string;
}

const verify: VerifierType["verify"] = async (_document, _option) => {
  const document = _document as any; // TODO Casting to any first to prevent change at the OA level
  const data: any = getData(document);
  const merkleRoot = `0x${document.signature.merkleRoot}`;
  const issuers = data.issuers.filter(
    (issuer: any) => issuer.identityProof.type === "DID" || issuer.identityProof.type === "DNS-DID"
  );

  // If revocation block does not exist, throw error to prevent case where revocation method is revoked
  const revocation: (Revocation | undefined)[] = issuers.map((issuer: any) => issuer.revocation);
  if (revocation.some((r) => typeof r?.type === "undefined"))
    throw new Error("revocation block not found for an issuer");
  // Support for the NONE method only
  const revokedOnAny = !revocation.every((r) => r?.type === "NONE");

  // Check that all the issuers have signed on the document
  if (!document.proof) throw new Error("Document is not signed. Proofs are missing.");
  const issuanceDeferred: IssuanceStatus[] = issuers.map((issuer: any) =>
    verifySignature(merkleRoot, issuer.identityProof, document.proof)
  );
  const issuance = await Promise.all(issuanceDeferred);
  const issuedOnAll = issuance.every((i) => i.issued);

  return {
    name,
    type,
    data: {
      issuedOnAll,
      revokedOnAny,
      details: {
        issuance,
      },
    },
    status: issuedOnAll && !revokedOnAny ? "VALID" : "INVALID",
  };
};

export const OpenAttestationDidSignedDocumentStatus: VerifierType = {
  skip,
  test,
  verify,
};
