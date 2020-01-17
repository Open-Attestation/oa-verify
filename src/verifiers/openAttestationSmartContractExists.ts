import * as ethers from "ethers";
import { getData } from "@govtechsg/open-attestation";
import { isWrappedV3Document, VerificationFragmentType, Verifier } from "..";
import { INFURA_API_KEY } from "../config";

const name = "OpenAttestationSmartContractExists";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
export const openAttestationSmartContractExists: Verifier = {
  skip: () => {
    throw new Error("This verifier is never skipped");
  },
  test: () => true,
  verify: async (document, options) => {
    try {
      if (isWrappedV3Document(document)) {
        const address = getData(document).proof.value;
        const provider = new ethers.providers.InfuraProvider(options.network, INFURA_API_KEY);
        await provider.getCode(address); // throw if address is invalid
        return {
          type,
          name,
          status: "VALID"
        };
      }
      throw new Error("Not handle");
    } catch (e) {
      return {
        type,
        name,
        data: `Contract does not exists (${e.message})`,
        status: "INVALID"
      };
    }
  }
};
