const { DOCUMENT_STORE, TOKEN_REGISTRY } = require("../common/contractTypes");

/**
 * Provide a summary of issued status, given a document
 *
 * @param  {object} document Raw document data
 * @param  {string} smartContracts Ethereum network to check against
 * @return {object} Summary of validity status, see getIssuedSummary()
 */

/*
       expect(verifySummary).toEqual({
        valid: true,
        issued: {
          CertStore1: true,
          CertStore2: true,
          DocStore1: true,
          DocStore2: true
        }
      });

      smartcontract

      {
          type,
          address,
          instance,
      }
 */

/**
 * Checks issue status on a single document store or token registry
 *
 * @param  {object} smartContract Object of
 * @param  {string} hash Hash of the merkle root of the document, not the target hash
 * @return {boolean} Has hash been issued on document store or created on token registry
 */
// const getIssued = async (smartContract, hash) => {
//   try {
//     if (smartContract.type === "DOCUMENT_STORE") {
//       const issued = await execute({
//         network,
//         contractAddress,
//         method: "isIssued",
//         args: [`0x${hash}`]
//       });
//       return issued;
//     } else if (smartContract.type === "TOKEN_REGISTRY") {
//       const issued = await execute({
//         network,
//         contractAddress,
//         method: "ownerOf",
//         args: [`0x${hash}`]
//       });
//       return issued;
//     } else {
//       throw new Error("Unsupported smart contract type");
//     }
//   } catch (e) {
//     // If contract is not deployed, the function will throw.
//     // It should default to false if there is errors.
//     return false;
//   }
// };

const tokenRegistry = require("../common/tokenRegistry");

const isIssuedOnTokenRegistry = async (smartContract, hash) => {
  const contract = contractInstance({ network, contractAddress });
  const result = await contract.functions["ownerOf"]([`0x${hash}`]);
  return result;
};

it("works", async () => {
  const contract = tokenRegistry({
    network: "ropsten",
    contractAddress: "0x48399fb88bcd031c556f53e93f690eec07963af3"
  });
});

// const verifyIssued = (document, smartContracts) => {
//   const documentData = getData(document);
//   const documentcontractAddresses = get(documentData, "issuers", []).map(
//     // Returns the documentStore or certificateStore(openCerts's legacy) address
//     i => i.documentStore || i.certificateStore
//   );
//   const merkleRoot = get(document, "signature.merkleRoot");
//   return getIssuedSummary(documentcontractAddresses, merkleRoot, network);
// };
