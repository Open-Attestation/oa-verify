import { getData, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { TradeTrustToken__factory } from "@govtechsg/token-registry/contracts";
import { isError, Provider, ZeroAddress } from "ethers";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationEthereumTokenRegistryStatusCode } from "../../../types/error";
import { CodedError } from "../../../common/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import {
  InvalidTokenRegistryStatus,
  OpenAttestationEthereumTokenRegistryStatusFragment,
  ValidTokenRegistryStatus,
} from "./ethereumTokenRegistryStatus.type";

type VerifierType = Verifier<OpenAttestationEthereumTokenRegistryStatusFragment>;

const name = "OpenAttestationEthereumTokenRegistryStatus";
const type: VerificationFragmentType = "DOCUMENT_STATUS";

export const getTokenRegistry = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string => {
  if (utils.isWrappedV2Document(document)) {
    const { issuers } = getData(document);
    if (issuers.length !== 1)
      throw new CodedError(
        "Only one issuer is allowed for tokens",
        OpenAttestationEthereumTokenRegistryStatusCode.INVALID_ISSUERS,
        OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.INVALID_ISSUERS]
      );
    if (!issuers[0].tokenRegistry)
      throw new CodedError(
        "Token registry is undefined",
        OpenAttestationEthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY,
        OpenAttestationEthereumTokenRegistryStatusCode[
          OpenAttestationEthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY
        ]
      );
    return issuers[0].tokenRegistry;
  }

  if (utils.isWrappedV3Document(document)) {
    if (!document.openAttestationMetadata.proof.value)
      throw new CodedError(
        "Token registry is undefined",
        OpenAttestationEthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY,
        OpenAttestationEthereumTokenRegistryStatusCode[
          OpenAttestationEthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY
        ]
      );
    return document.openAttestationMetadata.proof.value;
  }

  throw new CodedError(
    `Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.`,
    OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT,
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT]
  );
};

const getMerkleRoot = (
  document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
): string => {
  if (utils.isWrappedV2Document(document)) return `0x${document.signature.merkleRoot}`;
  else if (utils.isWrappedV3Document(document)) return `0x${document.proof.merkleRoot}`;
  throw new CodedError(
    `Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.`,
    OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT,
    OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT]
  );
};

const isNonExistentToken = (error: any) => {
  const message: string | undefined = error.message;
  if (!message) return false;
  return message.includes("owner query for nonexistent token");
};
const isMissingTokenRegistry = (error: any) => {
  return (
    !error.reason &&
    error.method?.toLowerCase() === "ownerOf(uint256)".toLowerCase() &&
    isError(error, "CALL_EXCEPTION")
  );
};
const decodeError = (error: any) => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  switch (true) {
    case isNonExistentToken(error):
      return `Document has not been issued under token registry`;
    case isMissingTokenRegistry(error):
      return `Token registry is not found`;
    case reason.toLowerCase() === "ENS name not configured".toLowerCase() && isError(error, "UNSUPPORTED_OPERATION"):
      return "ENS name is not configured";
    case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === isError(error, "INVALID_ARGUMENT"):
      return `Invalid token registry address`;
    case error.code === isError(error, "INVALID_ARGUMENT"):
      return `Invalid contract arguments`;
    case error.code === isError(error, "SERVER_ERROR"):
      throw new CodedError(
        "Unable to connect to the Ethereum network, please try again later",
        OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR,
        OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR]
      );
    default:
      throw error;
  }
};

export const isTokenMintedOnRegistry = async ({
  tokenRegistry,
  merkleRoot,
  provider,
}: {
  tokenRegistry: string;
  merkleRoot: string;
  provider: Provider;
}): Promise<ValidTokenRegistryStatus | InvalidTokenRegistryStatus> => {
  try {
    const tokenRegistryContract = await TradeTrustToken__factory.connect(tokenRegistry, provider); // TODO: update once token-registry's ethers is bumped
    const minted = await tokenRegistryContract.ownerOf(merkleRoot).then((owner) => !(owner === ZeroAddress));
    return minted
      ? { minted, address: tokenRegistry }
      : {
          minted,
          address: tokenRegistry,
          reason: {
            code: OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
            codeString:
              OpenAttestationEthereumTokenRegistryStatusCode[
                OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED
              ],
            message: `Document ${merkleRoot} has not been issued under contract ${tokenRegistry}`,
          },
        };
  } catch (error) {
    return {
      minted: false,
      address: tokenRegistry,
      reason: {
        message: decodeError(error),
        code: OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
        codeString:
          OpenAttestationEthereumTokenRegistryStatusCode[
            OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED
          ],
      },
    };
  }
};

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: OpenAttestationEthereumTokenRegistryStatusCode.SKIPPED,
      codeString:
        OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.SKIPPED],
      message: `Document issuers doesn't have "tokenRegistry" property or ${v3.Method.TokenRegistry} method`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  if (utils.isWrappedV2Document(document)) {
    const documentData = getData(document);
    return documentData.issuers.some((issuer) => "tokenRegistry" in issuer);
  } else if (utils.isWrappedV3Document(document)) {
    return document.openAttestationMetadata.proof.method === v3.Method.TokenRegistry;
  }
  return false;
};

// TODO split
const verify: VerifierType["verify"] = async (document, options) => {
  if (!utils.isWrappedV3Document(document) && !utils.isWrappedV2Document(document))
    throw new CodedError(
      `Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.`,
      OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT,
      OpenAttestationEthereumTokenRegistryStatusCode[
        OpenAttestationEthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT
      ]
    );
  const tokenRegistry = getTokenRegistry(document);
  const merkleRoot = getMerkleRoot(document);
  const mintStatus = await isTokenMintedOnRegistry({ tokenRegistry, merkleRoot, provider: options.provider });

  if (ValidTokenRegistryStatus.guard(mintStatus)) {
    const fragment = {
      name,
      type,
      status: "VALID" as const,
    };
    if (utils.isWrappedV3Document(document)) {
      return {
        ...fragment,
        data: { mintedOnAll: true, details: mintStatus },
      };
    } else {
      return {
        ...fragment,
        data: { mintedOnAll: true, details: [mintStatus] },
      };
    }
  } else {
    const fragment = {
      name,
      type,
      reason: mintStatus.reason,
      status: "INVALID" as const,
    };
    if (utils.isWrappedV3Document(document)) {
      return {
        ...fragment,
        data: { mintedOnAll: false, details: mintStatus },
      };
    } else {
      return {
        ...fragment,
        data: { mintedOnAll: false, details: [mintStatus] },
      };
    }
  }
};

export const openAttestationEthereumTokenRegistryStatus: Verifier<OpenAttestationEthereumTokenRegistryStatusFragment> = {
  skip,
  test,
  verify: withCodedErrorHandler(verify, {
    name,
    type,
    unexpectedErrorCode: OpenAttestationEthereumTokenRegistryStatusCode.UNEXPECTED_ERROR,
    unexpectedErrorString:
      OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.UNEXPECTED_ERROR],
  }),
};
