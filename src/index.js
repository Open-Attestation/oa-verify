const { verifyHash } = require("./hash/hash");
const { verifyIssued } = require("./issued/verify");
const { verifyRevoked } = require("./revoked/verify");
const documentToSmartContracts = require("./common/smartContract/documentToSmartContracts");

/**
 * @param  {object} document Entire document object to be validated
 * @param  {string} network Network to check against, defaults to "homestead". Other valid choices: "ropsten", "kovan", etc
 * @returns
 */
const verify = async (document, network = "homestead") => {
  const smartContracts = documentToSmartContracts(document, network);
  const verificationsDeferred = [
    verifyHash(document),
    verifyIssued(document, smartContracts),
    verifyRevoked(document, smartContracts)
  ];

  const [hash, issued, revoked] = await Promise.all(verificationsDeferred);

  return {
    hash,
    issued,
    revoked,
    valid: hash.checksumMatch && issued.issuedOnAll && !revoked.revokedOnAny
  };
};

module.exports = verify;
