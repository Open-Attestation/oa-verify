const { get } = require("lodash");
const { getData } = require("@govtechsg/open-attestation");
const issuerToSmartContract = require("./issuerToSmartContract");

// Given a list of issuers, convert to smart contract
const mapIssuersToSmartContracts = (issuers, network) =>
  issuers.map(issuer => issuerToSmartContract(issuer, network));

// Given a raw document, return list of all smart contracts
const documentToSmartContracts = (document, network) => {
  const data = getData(document);
  const issuers = get(data, "issuers", []);

  return mapIssuersToSmartContracts(issuers, network);
};

module.exports = documentToSmartContracts;
