import { getData, utils, v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { Contract } from "ethers";
import { Hash, isWrappedV3Document, VerificationFragmentType, Verifier } from "../../types/core";
import { OpenAttestationEthereumDocumentStoreRevokedCode } from "../../types/error";
import {
  createDocumentStoreContract,
  getIssuersDocumentStore,
  isRevokedOnDocumentStore
} from "../../common/smartContract/documentStoreContractInterface";
import { contractRevoked, getErrorReason } from "../../common/smartContract/documentStoreErrors";

interface Status {
  revoked: boolean;
  address: string;
  reason?: any;
}

const getIntermediateHashes = (targetHash: Hash, proofs: Hash[] = []) => {
  const hashes = [`0x${targetHash}`];
  proofs.reduce((prev, curr) => {
    const next = utils.combineHashString(prev, curr);
    hashes.push(`0x${next}`);
    return next;
  }, targetHash);
  return hashes;
};

// Given a list of hashes, check against one smart contract if any of the hash has been revoked
export const isAnyHashRevoked = async (smartContract: Contract, intermediateHashes: Hash[]) => {
  const revokedStatusDeferred = intermediateHashes.map(hash =>
    isRevokedOnDocumentStore(smartContract, hash).then(status => (status ? hash : undefined))
  );
  const revokedStatuses = await Promise.all(revokedStatusDeferred);
  return revokedStatuses.find(hash => hash);
};

const name = "OpenAttestationEthereumDocumentStoreRevoked";
const type: VerificationFragmentType = "DOCUMENT_STATUS";
export const openAttestationEthereumDocumentStoreRevoked: Verifier<
  WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>
> = {
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpenAttestationEthereumDocumentStoreRevokedCode.SKIPPED,
        codeString:
          OpenAttestationEthereumDocumentStoreRevokedCode[OpenAttestationEthereumDocumentStoreRevokedCode.SKIPPED],
        message: `Document issuers doesn't have "documentStore" or "certificateStore" property or ${v3.Method.DocumentStore} method`
      }
    });
  },
  test: document => {
    if (isWrappedV3Document(document)) {
      const documentData = getData(document);
      return documentData.proof.method === v3.Method.DocumentStore;
    }
    const documentData = getData(document);
    return documentData.issuers.every(issuer => "documentStore" in issuer || "certificateStore" in issuer);
  },
  verify: async (document, options) => {
    try {
      const documentStores = getIssuersDocumentStore(document);
      const merkleRoot = `0x${document.signature.merkleRoot}`;
      const { targetHash } = document.signature;
      const proofs = document.signature.proof || [];
      const statuses: Status[] = await Promise.all(
        documentStores.map(async documentStore => {
          try {
            const contract = createDocumentStoreContract(documentStore, options);
            const intermediateHashes = getIntermediateHashes(targetHash, proofs);
            const revokedHash = await isAnyHashRevoked(contract, intermediateHashes);

            const status: Status = {
              revoked: !!revokedHash,
              address: documentStore
            };
            if (revokedHash) {
              status.reason = contractRevoked(merkleRoot, documentStore);
            }
            return status;
          } catch (e) {
            return { revoked: true, address: documentStore, reason: getErrorReason(e, documentStore) };
          }
        })
      );
      const revoked = statuses.find(status => status.revoked);
      if (revoked) {
        return {
          name,
          type,
          data: { revokedOnAny: true, details: isWrappedV3Document(document) ? statuses[0] : statuses },
          reason: revoked.reason,
          status: "INVALID"
        };
      }
      return {
        name,
        type,
        data: { revokedOnAny: false, details: isWrappedV3Document(document) ? statuses[0] : statuses },
        status: "VALID"
      };
    } catch (e) {
      return {
        name,
        type,
        data: e,
        reason: {
          message: e.message,
          code: OpenAttestationEthereumDocumentStoreRevokedCode.UNEXPECTED_ERROR,
          codeString:
            OpenAttestationEthereumDocumentStoreRevokedCode[
              OpenAttestationEthereumDocumentStoreRevokedCode.UNEXPECTED_ERROR
            ]
        },
        status: "ERROR"
      };
    }
  }
};
