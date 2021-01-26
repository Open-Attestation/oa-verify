import { getData, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { TradeTrustErc721Factory } from "@govtechsg/token-registry";
import { constants, errors, providers } from "ethers";
import { VerificationFragmentType, VerificationFragment, Verifier, VerifierOptions } from "../../../types/core";
import { OpenAttestationEthereumTokenRegistryStatusCode, Reason } from "../../../types/error";

import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";

interface ValidMintedStatus {
  minted: true;
  address: string;
}

interface InvalidMintedStatus {
  minted: false;
  address: string;
  reason: Reason;
}

type MintedStatus = ValidMintedStatus | InvalidMintedStatus;
type VerifierType = Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>>;

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
  } else {
    throw new Error("TBD");
  }
};

const isNonExistentToken = (error: any) => {
  const message: string | undefined = error.body?.error?.message;
  if (!message) return false;
  return message.includes("owner query for nonexistent token");
};
const isMissingTokenRegistry = (error: any) => {
  return (
    !error.reason &&
    error.method?.toLowerCase() === "ownerOf(uint256)".toLowerCase() &&
    error.code === errors.CALL_EXCEPTION
  );
};
const decodeError = (error: any) => {
  const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
  switch (true) {
    case isNonExistentToken(error):
      return `Document has not been issued under token registry`;
    case isMissingTokenRegistry(error):
      return `Token registry is not found`;
    case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
      error.code === errors.UNSUPPORTED_OPERATION:
      return "ENS name is not configured";
    case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
      return `Invalid token registry address`;
    case error.code === errors.INVALID_ARGUMENT:
      return `Invalid contract arguments`;
    case error.code === errors.SERVER_ERROR:
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
  provider: providers.Provider;
}): Promise<MintedStatus> => {
  try {
    const tokenRegistryContract = await TradeTrustErc721Factory.connect(tokenRegistry, provider);
    const minted = await tokenRegistryContract.ownerOf(merkleRoot).then((owner) => !(owner === constants.AddressZero));
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
    return !!documentData?.issuers?.some((issuer) => "tokenRegistry" in issuer);
  }
  return false;
};

const verify: VerifierType["verify"] = withCodedErrorHandler(
  async (document, options): Promise<VerificationFragment> => {
    if (!utils.isWrappedV2Document(document)) throw new Error("TBD");
    const tokenRegistry = getTokenRegistry(document);
    const merkleRoot = `0x${document.signature.merkleRoot}`;
    const mintStatus = await isTokenMintedOnRegistry({ tokenRegistry, merkleRoot, provider: options.provider });

    const status: MintedStatus = mintStatus.minted
      ? {
          minted: true,
          address: tokenRegistry,
        }
      : {
          minted: false,
          address: tokenRegistry,
          reason: mintStatus.reason,
        };

    return mintStatus.minted
      ? {
          name,
          type,
          data: { mintedOnAll: true, details: utils.isWrappedV3Document(document) ? status : [status] },
          status: "VALID",
        }
      : {
          name,
          type,
          data: { mintedOnAll: false, details: utils.isWrappedV3Document(document) ? status : [status] },
          reason: mintStatus.reason,
          status: "INVALID",
        };
  },
  {
    name,
    type,
    unexpectedErrorCode: OpenAttestationEthereumTokenRegistryStatusCode.UNEXPECTED_ERROR,
    unexpectedErrorString:
      OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.UNEXPECTED_ERROR],
  }
);

export const openAttestationEthereumTokenRegistryStatus: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip,
  test,
  verify,
};
