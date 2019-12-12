import { getData, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { isWrappedV3Document, OpenAttestationContract, VerificationFragmentType, Verifier } from "../types/core";
import { getTokenRegistrySmartContract } from "../common/smartContract/documentToSmartContracts";
import { verifyIssued } from "./documentStoreIssued/verify";

const verifyMinted = async (
  document: WrappedDocument<v2.OpenAttestationDocument | v3.OpenAttestationDocument>,
  smartContracts: OpenAttestationContract[] = []
) => {
  const { details, issuedOnAll } = await verifyIssued(document, smartContracts);
  return {
    details: details.map(({ issued, ...rest }) => {
      return {
        ...rest,
        minted: issued
      };
    }),
    mintedOnAll: issuedOnAll
  };
};

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
      message: `Document issuers doesn't have "tokenRegistry" property or ${v3.Method.TokenRegistry} method`
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
      const smartContracts = getTokenRegistrySmartContract(document, options);
      const status = await verifyMinted(document, smartContracts);
      if (!status.mintedOnAll) {
        return {
          name,
          type,
          data: status,
          message: "Certificate has not been minted",
          status: "INVALID"
        };
      }
      return {
        name,
        type,
        data: status,
        status: "VALID"
      };
    } catch (e) {
      return {
        name,
        type,
        data: e,
        message: e.message,
        status: "ERROR"
      };
    }
  }
};
