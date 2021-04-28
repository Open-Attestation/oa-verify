import { VerificationMethod, Resolver } from "did-resolver";
import { utils } from "ethers";
import { Literal, Record, Static, String, Union, Array as RunTypesArray } from "runtypes";
import { getVerificationMethod } from "./resolver";
import { Reason, OpenAttestationSignatureCode } from "../types/error";
import { CodedError } from "../common/error";

export const ValidDidVerificationStatus = Record({
  verified: Literal(true),
  did: String,
});
export type ValidDidVerificationStatus = Static<typeof ValidDidVerificationStatus>;
export const ValidDidVerificationStatusArray = RunTypesArray(ValidDidVerificationStatus).withConstraint(
  (elements) => elements.length > 0 || "Expect at least one valid element"
);
export type ValidDidVerificationStatusArray = Static<typeof ValidDidVerificationStatusArray>;

export const InvalidDidVerificationStatus = Record({
  verified: Literal(false),
  did: String,
  reason: Reason,
});
export type InvalidDidVerificationStatus = Static<typeof InvalidDidVerificationStatus>;

export const DidVerificationStatus = Union(ValidDidVerificationStatus, InvalidDidVerificationStatus);
export type DidVerificationStatus = Static<typeof DidVerificationStatus>;
export const DidVerificationStatusArray = RunTypesArray(DidVerificationStatus);
export type DidVerificationStatusArray = Static<typeof DidVerificationStatusArray>;

interface VerifySignature {
  did: string;
  signature: string;
  merkleRoot: string;
  verificationMethod: VerificationMethod;
}

export const verifySecp256k1VerificationKey2018 = ({
  did,
  verificationMethod,
  merkleRoot,
  signature,
}: VerifySignature): DidVerificationStatus => {
  const messageBytes = utils.arrayify(merkleRoot);
  const { blockchainAccountId } = verificationMethod;
  if (!blockchainAccountId) {
    return {
      did,
      verified: false,
      reason: {
        code: OpenAttestationSignatureCode.KEY_MISSING,
        codeString: OpenAttestationSignatureCode[OpenAttestationSignatureCode.KEY_MISSING],
        message: `ethereumAddress not found on public key ${JSON.stringify(verificationMethod)}`,
      },
    };
  }
  // blockchainAccountId looks like 0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457@eip155:3, let's get rid of the part after @, @ included
  const ethereumAddress = blockchainAccountId.split("@")[0];

  const merkleRootSigned = utils.verifyMessage(messageBytes, signature).toLowerCase() === ethereumAddress.toLowerCase();
  if (!merkleRootSigned) {
    return {
      did,
      verified: false,
      reason: {
        code: OpenAttestationSignatureCode.WRONG_SIGNATURE,
        codeString: OpenAttestationSignatureCode[OpenAttestationSignatureCode.WRONG_SIGNATURE],
        message: `merkle root is not signed correctly by ${ethereumAddress}`,
      },
    };
  }

  return {
    did,
    verified: true,
  };
};

export const verifySignature = async ({
  key,
  merkleRoot,
  signature,
  did,
  resolver,
}: {
  key: string;
  merkleRoot: string;
  did: string;
  signature: string;
  resolver?: Resolver;
}): Promise<DidVerificationStatus> => {
  const verificationMethod = await getVerificationMethod(did, key, resolver);
  if (!verificationMethod)
    throw new CodedError(
      `No public key found on DID document for the DID ${did} and key ${key}`,
      OpenAttestationSignatureCode.KEY_NOT_IN_DID,
      "KEY_NOT_IN_DID"
    );
  switch (verificationMethod.type) {
    case "EcdsaSecp256k1RecoveryMethod2020":
      return verifySecp256k1VerificationKey2018({
        did,
        verificationMethod,
        merkleRoot,
        signature,
      });
    default:
      throw new CodedError(
        `Signature type ${verificationMethod.type} is currently not support`,
        OpenAttestationSignatureCode.UNSUPPORTED_KEY_TYPE,
        "UNSUPPORTED_KEY_TYPE"
      );
  }
};
