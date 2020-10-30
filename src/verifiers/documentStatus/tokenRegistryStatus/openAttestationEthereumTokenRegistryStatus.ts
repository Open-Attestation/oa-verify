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
}) => {
  try {
    const tokenRegistryContract = await TradeTrustErc721Factory.connect(tokenRegistry, getProvider({ network }));
    const minted = await tokenRegistryContract.ownerOf(merkleRoot).then((owner) => !(owner === constants.AddressZero));
    return minted;
  } catch (error) {
    const reason = error.reason && Array.isArray(error.reason) ? error.reason[0] : error.reason ?? "";
    switch (true) {
      // Token is not minted
      case reason.toLowerCase() === "ERC721: owner query for nonexistent token".toLowerCase() &&
        error.code === errors.CALL_EXCEPTION:
        return false;
      // Contract not found
      case !error.reason &&
        error.method?.toLowerCase() === "ownerOf(uint256)".toLowerCase() &&
        error.code === errors.CALL_EXCEPTION:
        return false;
      // ENS not configured
      case reason.toLowerCase() === "ENS name not configured".toLowerCase() &&
        error.code === errors.UNSUPPORTED_OPERATION:
        return false;
      // Invalid token registry address
      case reason.toLowerCase() === "invalid address".toLowerCase() && error.code === errors.INVALID_ARGUMENT:
        return false;
      // Invalid arguments
      case error.code === errors.INVALID_ARGUMENT:
        return false;
      // Otherwise allow other errors to bubble up as unexpected error
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
      const isMinted = await isTokenMintedOnRegistry({ tokenRegistry, merkleRoot, network: options.network });

      const status: Status = {
        minted: isMinted,
        address: tokenRegistry,
      };

      return isMinted
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
              message: `Document ${merkleRoot} has not been issued under contract ${tokenRegistry}`,
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
