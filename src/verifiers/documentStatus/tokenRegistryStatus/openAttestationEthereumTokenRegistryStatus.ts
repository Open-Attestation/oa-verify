import { getData, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { TradeTrustErc721Factory } from "@govtechsg/token-registry";
import { constants, errors } from "ethers";
import { VerificationFragmentType, Verifier } from "../../../types/core";
import { OpenAttestationEthereumTokenRegistryStatusCode } from "../../../types/error";
import { getProvider } from "../../../common/utils";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";

interface Status {
  minted: boolean;
  address: string;
  reason?: any;
}

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
    const { proof } = getData(document);
    if (proof.method !== "TOKEN_REGISTRY")
      throw new CodedError(
        "Cannot validate non-token registry documents",
        OpenAttestationEthereumTokenRegistryStatusCode.INVALID_VALIDATION_METHOD,
        OpenAttestationEthereumTokenRegistryStatusCode[
          OpenAttestationEthereumTokenRegistryStatusCode.INVALID_VALIDATION_METHOD
        ]
      );
    return proof.value;
  }
};

export const isTokenMintedOnRegistry = async ({
  tokenRegistry,
  merkleRoot,
  network,
}: {
  tokenRegistry: string;
  merkleRoot: string;
  network: string;
}): Promise<{ minted: boolean; reason?: string }> => {
  try {
    const tokenRegistryContract = await TradeTrustErc721Factory.connect(tokenRegistry, getProvider({ network }));
    const minted = await tokenRegistryContract.ownerOf(merkleRoot).then((owner) => !(owner === constants.AddressZero));
    return { minted };
  } catch (error) {
    const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
    switch (true) {
      case reason.toLowerCase() === "ERC721: owner query for nonexistent token".toLowerCase() &&
        error.code === errors.CALL_EXCEPTION:
        return { minted: false, reason: `Document ${merkleRoot} has not been issued under contract ${tokenRegistry}` };
      case !error.reason &&
        error.method?.toLowerCase() === "ownerOf(uint256)".toLowerCase() &&
        error.code === errors.CALL_EXCEPTION:
        return { minted: false, reason: `Token registry ${tokenRegistry} is not found` };
      case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
        error.code === errors.UNSUPPORTED_OPERATION:
        return { minted: false, reason: "ENS name is not configured" };
      case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
        return { minted: false, reason: `Invalid token registry address ${tokenRegistry}` };
      case error.code === errors.INVALID_ARGUMENT:
        return { minted: false, reason: `Invalid contract arguments` };
      case error.code === errors.SERVER_ERROR:
        throw new CodedError(
          "Unable to connect to the Ethereum network, please try again later",
          OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR,
          OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR]
        );
      default:
        throw error;
    }
  }
};

export const openAttestationEthereumTokenRegistryStatus: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationEthereumTokenRegistryStatusCode.SKIPPED,
        codeString:
          OpenAttestationEthereumTokenRegistryStatusCode[OpenAttestationEthereumTokenRegistryStatusCode.SKIPPED],
        message: `Document issuers doesn't have "tokenRegistry" property or ${v3.Method.TokenRegistry} method`,
      },
    });
  },
  test: (document) => {
    if (utils.isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.proof.method === v3.Method.TokenRegistry;
    } else if (utils.isWrappedV2Document(document)) {
      const documentData = getData(document);
      return documentData?.issuers?.some((issuer) => "tokenRegistry" in issuer);
    }
    return false;
  },
  verify: withCodedErrorHandler(
    async (document, options) => {
      const tokenRegistry = getTokenRegistry(document);
      const merkleRoot = `0x${document.signature.merkleRoot}`;
      const { minted, reason } = await isTokenMintedOnRegistry({ tokenRegistry, merkleRoot, network: options.network });

      const status: Status = {
        minted,
        address: tokenRegistry,
      };

      return minted
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
            reason: {
              code: OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED,
              codeString:
                OpenAttestationEthereumTokenRegistryStatusCode[
                  OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED
                ],
              message: reason || `Document ${merkleRoot} has not been issued under contract ${tokenRegistry}`,
            },
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
  ),
};
