import { PublicKey } from "did-resolver";
import { utils } from "ethers";
import { getPublicKey } from "./resolver";

export interface DidVerificationStatus {
  verified: boolean;
  did: string;
  reason?: any;
}

interface IdentityProof {
  type: string;
  id: string;
  purpose: string;
  key: string;
}
interface Proof {
  type: string;
  proofPurpose: string;
  verificationMethod: string;
  signature: string;
}

interface VerifySignature {
  did: string;
  signature: string;
  merkleRoot: string;
  publicKey: PublicKey;
}

export const verifySecp256k1VerificationKey2018 = ({
  did,
  publicKey,
  merkleRoot,
  signature,
}: VerifySignature): DidVerificationStatus => {
  const messageBytes = utils.arrayify(merkleRoot);
  const { ethereumAddress } = publicKey;
  if (!ethereumAddress) {
    return {
      did,
      verified: false,
      reason: `ethereumAddress not found on public key ${JSON.stringify(publicKey)}`,
    };
  }

  return {
    did,
    verified: utils.verifyMessage(messageBytes, signature).toLowerCase() === ethereumAddress.toLowerCase(),
  };
};

export const verifySignature = async ({
  merkleRoot,
  identityProof,
  proof,
  did,
}: {
  merkleRoot: string;
  identityProof: IdentityProof;
  proof: Proof[];
  did: string;
}): Promise<DidVerificationStatus> => {
  const { key } = identityProof;
  const publicKey = await getPublicKey(did, key);
  if (!publicKey) throw new Error(`No public key found on DID document for the DID ${did} and key ${key}`);

  const correspondingProof = proof.find((p) => p.verificationMethod.toLowerCase() === key.toLowerCase());
  if (!correspondingProof) throw new Error(`Proof not found for ${key}`);

  switch (publicKey.type) {
    case "Secp256k1VerificationKey2018":
      return verifySecp256k1VerificationKey2018({
        did,
        publicKey,
        merkleRoot,
        signature: correspondingProof.signature,
      });
    default:
      throw new Error(`Signature type ${publicKey.type} is currently not support`);
  }
};