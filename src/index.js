const { verifyHash } = require("./hash/hash");
const { verifyIssued } = require("./issued/issued");
const { verifyRevoked } = require("./unrevoked/unrevoked");
const { getData } = require("@govtechsg/open-attestation");
const mapIssuersToSmartContracts = require("./common/mapIssuersToSmartContracts");

/**
 * @param  {object} document Entire document object to be validated
 * @param  {string} network Network to check against, defaults to "homestead". Other valid choices: "ropsten", "kovan", etc
 * @returns
 */
const verify = async (document, network = "homestead") => {
  // const data = getData(document);
  // const smartContracts = mapIssuersToSmartContracts(data.issuers);
  
  const verificationsDeferred = [
    verifyHash(document),
    verifyIssued(document, network),
    verifyRevoked(document, network)
  ];

  const [hash, issued, revoked] = await Promise.all(verificationsDeferred);

  return {
    hash,
    issued,
    revoked,
    valid: hash.valid && issued.valid && revoked.valid
  };
};

module.exports = verify;
