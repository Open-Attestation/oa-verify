import { SignedDocument } from "@govtechsg/open-attestation";
import { verifyHash } from "./hash/hash";
import { verifyIssued } from "./issued/verify";
import { verifyRevoked } from "./revoked/verify";
import { documentToSmartContracts } from "./common/smartContract/documentToSmartContracts";

/**
 * @param  {object} document Entire document object to be validated
 * @param  {string} network Network to check against, defaults to "homestead". Other valid choices: "ropsten", "kovan", etc
 * @returns
 */
export const verify = async (
  document: SignedDocument,
  network = "homestead"
) => {
  const smartContracts = documentToSmartContracts(document, network);
  const [hash, issued, revoked] = await Promise.all([
    verifyHash(document),
    verifyIssued(document, smartContracts),
    verifyRevoked(document, smartContracts)
  ]);

  return {
    hash,
    issued,
    revoked,
    valid: hash.checksumMatch && issued.issuedOnAll && !revoked.revokedOnAny
  };
};

export default verify; // backward compatible
