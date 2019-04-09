const { verifyHash } = require("./hash/hash");
const { verifyIdentity } = require("./identity/identity");
const { verifyIssued } = require("./issued/issued");
const { verifyRevoked } = require("./unrevoked/unrevoked");

/**
 * @param  {object} document Entire document object to be validated
 * @param  {string} network Network to check against, defaults to "homestead". Other valid choices: "ropsten", "kovan", etc
 * @returns
 */
const verify = async (document, network = "homestead") => {
  const verificationsDeferred = [
    verifyHash(document),
    verifyIdentity(document),
    verifyIssued(document, network),
    verifyRevoked(document, network)
  ];

  const [hash, identity, issued, revoked] = await Promise.all(
    verificationsDeferred
  );

  return {
    hash,
    identity,
    issued,
    revoked,
    valid: hash.valid && identity.valid && issued.valid && revoked.valid
  };
};

module.exports = verify;
