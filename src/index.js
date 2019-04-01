const { verifyHash } = require("./hash/hash");
const { verifyIdentity } = require("./identity/identity");
const { verifyIssued } = require("./issued/issued");
const { verifyRevoked } = require("./unrevoked/unrevoked");

const verify = async document => {
  const verificationsDeferred = [
    verifyHash(document),
    verifyIdentity(document),
    verifyIssued(document),
    verifyRevoked(document)
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
