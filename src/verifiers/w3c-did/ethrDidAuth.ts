import { getData, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { DIDDocument, Authentication, PublicKey } from "../../types/w3c-did";
import { VerificationManagerOptions } from "../../types/core";
import { getDocumentStoreSmartContract } from "../../common/smartContract/documentToSmartContracts";
import { getDocumentIssuer } from "./getDocumentIssuer";

/**
 * Currently if the ethereumAddress that is associated with one of the authentication mechanisms' public keys
 * defined in the didDoc matches the tx.origin that issued the cert then the issuer is authenticated.
 * @todo
 *  - Consider other auth flows such as comparing against the owner of the document store as well as adding
 *    signatures around the cert itself.
 *  - Note authentication is currently dependent on retrieving the issuance transaction from the specified eth network.
 *  - Consider mutli-sig issuance use cases.
 */
export const ethrDidAuth = async (
  didDoc: DIDDocument,
  document: WrappedDocument<v3.OpenAttestationDocument>,
  supportedAuth: Authentication[],
  options: VerificationManagerOptions
): Promise<boolean> => {
  const smartContracts = getDocumentStoreSmartContract(document, options);
  const { proof } = getData(document);
  const txSender = await getDocumentIssuer(smartContracts[0].instance, proof.value, document, options.network);

  // Transform publicKey array to object with id as key for efficient lookup
  const publicKeys: { [key: string]: PublicKey } = {};
  didDoc.publicKey.forEach((key: PublicKey) => {
    publicKeys[key.id] = key;
  });

  // Promisified to resolve as soon as a match is found
  return new Promise((resolve, reject) => {
    supportedAuth.forEach((auth: Authentication) => {
      const pubKeyURIs = auth.publicKey; // This is an array...
      if (pubKeyURIs?.length) {
        // Retrieve actual pubKey objects from didDoc
        pubKeyURIs.forEach((keyId: string) => {
          const ethAddress = publicKeys[keyId].ethereumAddress?.toLowerCase() ?? "";
          if (txSender === ethAddress) {
            resolve(true);
          }
        });
      }
    });
    reject(new Error("Identity could not be authenticated, this DID does not appear to have issued the document."));
  });
};
