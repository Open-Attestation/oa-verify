import { getData, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { resolveDID } from "./w3c-did/resolveDID";
import { ethrDidAuth } from "./w3c-did/ethrDidAuth";
import { Verifier } from "../types/core";
import { Authentication } from "../types/w3c-did";
import { SUPPORTED_DID_AUTH, ETHR_DID_METHOD } from "../config";

const name = "OpenAttestationW3CDID";
const type = "ISSUER_IDENTITY";

/**
 * DID structure MUST comply with: https://www.w3.org/TR/did-core/
 * Authentication of a DID is defined based on the `did-method`
 * Where the method will ALWAYS be did:<method>:<value>, as per above spec
 * @todo
 *  - Determine if a standard format to be used for the `data` field within returned fragments.
 *    Currently the didDoc is returned as the `data` field.
 */
export const openAttestationW3CDID: Verifier<WrappedDocument<v3.OpenAttestationDocument>> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      message: `Document issuer doesn't doesn't use ${v3.IdentityProofType.W3CDid} type`
    });
  },
  test: document => {
    const documentData = getData(document);
    return documentData.issuer.identityProof.type === v3.IdentityProofType.W3CDid;
  },
  verify: async (document, options) => {
    try {
      const { issuer } = getData(document);
      const did = issuer?.identityProof?.location;
      const didDoc = await resolveDID(did);

      // If the didDoc has an auth method we currently support
      const supportedAuth = didDoc?.authentication?.filter((auth: Authentication) =>
        SUPPORTED_DID_AUTH.includes(auth.type)
      );

      if (!supportedAuth?.length) throw new Error("Issuer DID cannot be authenticated, no supported auth in didDoc.");

      const didMethod = did.split(":")[1];

      let authenticated = false;
      if (didMethod === ETHR_DID_METHOD) {
        authenticated = await ethrDidAuth(didDoc, document, supportedAuth, options);
      } else {
        throw new Error(`${didMethod} is currently not supported...`);
      }

      const data = didDoc;

      if (authenticated) {
        const status = "VALID";
        return { name, type, data, status };
      }
      const status = "INVALID";
      const message = "Certificate issuer identity is invalid";
      return { name, type, data, status, message };
    } catch (e) {
      const data = e;
      const { message } = e;
      const status = "ERROR";
      return { name, type, data, message, status };
    }
  }
};
