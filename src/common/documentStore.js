const smartContract = require("./smartContract");
const abi = require("../common/abi/documentStore.json");

module.exports = smartContract(abi);
