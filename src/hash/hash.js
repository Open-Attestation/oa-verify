const { verifySignature } = require("@govtechsg/open-attestation");

const verifyHash = certificate => ({ valid: verifySignature(certificate) });

module.exports = { verifyHash };
