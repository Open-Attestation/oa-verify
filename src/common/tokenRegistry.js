const smartContract = require("./smartContract");
const abi = require("../common/abi/tokenRegistry.json");

module.exports = smartContract(abi);
