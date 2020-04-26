import axios from "axios";
import { DIDDocument } from "../../types/w3c-did";
import { BASE_RESOLVER_URL, RESOLVER_VERSION, RESOLVER_PATH } from "../../config";

/**
 * Resolve a DID to it's associated DIDDocument.
 * Currently leveraging the public universal resolver to support many did-methods.
 * @todo
 *  - Consider... currently reliant on external service @ `BASE_RESOLVER_URL` staying online / being accessible from wherever
 *    the verifier is run. Could look to host our own univeral resolver instance as per:
 *    https://github.com/decentralized-identity/universal-resolver#quick-start
 */
export const resolveDID = async (did: string): Promise<DIDDocument> => {
  const uri = `${BASE_RESOLVER_URL}/${RESOLVER_VERSION}/${RESOLVER_PATH}/${did}`;
  const resolvedDID: any = await axios.get(uri);
  const { didDocument } = resolvedDID.data;
  if (!didDocument) throw new Error(`DIDDoc could not be retireved for: ${did}`);
  return didDocument;
};
