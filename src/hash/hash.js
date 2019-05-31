const { verifySignature } = require("@govtechsg/open-attestation");

const verifyHash = document => ({ valid: verifySignature(document) });

module.exports = { verifyHash };
