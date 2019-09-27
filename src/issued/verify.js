const { get, zipWith } = require("lodash");
const { isIssued } = require("./contractInterface");

const issuedStatusOnContracts = async (smartContracts = [], hash) => {
  const issueStatusesDefered = smartContracts.map(smartContract =>
    isIssued(smartContract, hash)
  );
  const issueStatuses = await Promise.all(issueStatusesDefered);
  const smartContractAddresses = smartContracts.map(
    smartContract => smartContract.address
  );
  return zipWith(smartContractAddresses, issueStatuses, (address, issued) => ({
    address,
    issued
  }));
};

const isIssuedOnAll = status => {
  if (!status || status.length === 0) return false;
  return status.reduce((prev, curr) => prev && curr.issued, true);
};

const verifyIssued = async (document, smartContracts = []) => {
  const hash = `0x${get(document, "signature.merkleRoot")}`;
  const details = await issuedStatusOnContracts(smartContracts, hash);
  const issuedOnAll = isIssuedOnAll(details);

  return {
    issuedOnAll,
    details
  };
};

module.exports = { verifyIssued, isIssuedOnAll, issuedStatusOnContracts };
