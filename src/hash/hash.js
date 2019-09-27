const { verifySignature } = require("@govtechsg/open-attestation");

const verifyHash = document => ({ checksumMatch: verifySignature(document) });

module.exports = { verifyHash };
