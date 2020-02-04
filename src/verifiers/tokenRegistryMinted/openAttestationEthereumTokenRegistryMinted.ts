import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { isWrappedV3Document, VerificationFragmentType, Verifier } from "../../types/core";
import { OpenAttestationEthereumTokenRegistryMintedCode } from "../../types/error";
import {
  createTokenRegistryContract,
  getIssuersTokenRegistry,
  isMintedOnTokenRegistry
} from "../../common/smartContract/tokenRegistryContractInterface";
import { contractNotMinted, getErrorReason } from "./errors";

interface Status {
  minted: boolean;
  address: string;
  reason?: any;
}
const name = "OpenAttestationEthereumTokenRegistryMinted";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
export const openAttestationEthereumTokenRegistryMinted: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationEthereumTokenRegistryMintedCode.SKIPPED,
        codeString:
          OpenAttestationEthereumTokenRegistryMintedCode[OpenAttestationEthereumTokenRegistryMintedCode.SKIPPED],
        message: `Document issuers doesn't have "tokenRegistry" property or ${v3.Method.TokenRegistry} method`
      }
    });
  },
  test: document => {
    if (isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.proof.method === v3.Method.TokenRegistry;
    }
    const documentData = getData(document);
    return documentData.issuers.some(issuer => "tokenRegistry" in issuer);
  },
  verify: async (document, options) => {
    try {
      const tokenRegistries = getIssuersTokenRegistry(document);
      if (tokenRegistries.length > 1) {
        throw new Error(`Only one token registry is allowed. Found ${tokenRegistries.length}`);
      }
      const merkleRoot = `0x${document.signature.merkleRoot}`;
      const statuses: Status[] = await Promise.all(
        tokenRegistries.map(async tokenRegistry => {
          try {
            const contract = createTokenRegistryContract(tokenRegistry, options);
            const minted = await isMintedOnTokenRegistry(contract, merkleRoot);
            const status: Status = {
              minted,
              address: tokenRegistry
            };
            if (!minted) {
              status.reason = contractNotMinted(merkleRoot, tokenRegistry);
            }
            return status;
          } catch (e) {
            return { minted: false, address: tokenRegistry, reason: getErrorReason(e, tokenRegistry, merkleRoot) };
          }
        })
      );
      const notMinted = statuses.find(status => !status.minted);
      if (notMinted) {
        return {
          name,
          type,
          data: { mintedOnAll: false, details: isWrappedV3Document(document) ? statuses[0] : statuses },
          reason: notMinted.reason,
          status: "INVALID"
        };
      }
      return {
        name,
        type,
        data: { mintedOnAll: true, details: isWrappedV3Document(document) ? statuses[0] : statuses },
        status: "VALID"
      };
    } catch (e) {
      return {
        name,
        type,
        data: e,
        reason: {
          message: e.message,
          code: OpenAttestationEthereumTokenRegistryMintedCode.UNEXPECTED_ERROR,
          codeString:
            OpenAttestationEthereumTokenRegistryMintedCode[
              OpenAttestationEthereumTokenRegistryMintedCode.UNEXPECTED_ERROR
            ]
        },
        status: "ERROR"
      };
    }
  }
};
