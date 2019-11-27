import { SignedDocument } from "@govtechsg/open-attestation";
import { verifyHash } from "./hash/hash";
import { verifyIssued } from "./issued/verify";
import { verifyRevoked } from "./revoked/verify";
import { documentToSmartContracts } from "./common/smartContract/documentToSmartContracts";
import { OpenAttestationContract } from "./types";

type ResolveType<T> = T extends (...args: any[]) => Promise<infer U> ? U : T;

type VerificationChecks = [
  ReturnType<typeof verifyHash>,
  ReturnType<typeof verifyIssued>,
  ReturnType<typeof verifyRevoked>
];

type VerificationChecksWithValidity = [
  ReturnType<typeof verifyHash>,
  ReturnType<typeof verifyIssued>,
  ReturnType<typeof verifyRevoked>,
  Promise<boolean>
];

const getAllChecks = (
  document: SignedDocument,
  smartContracts: OpenAttestationContract[]
): VerificationChecks => [
  verifyHash(document),
  verifyIssued(document, smartContracts),
  verifyRevoked(document, smartContracts)
];

const isDocumentValid = (
  hash: ResolveType<typeof verifyHash>,
  issued: ResolveType<typeof verifyIssued>,
  revoked: ResolveType<typeof verifyRevoked>
) => hash.checksumMatch && issued.issuedOnAll && !revoked.revokedOnAny;

/**
 * @param  {object} document Entire document object to be validated
 * @param  {string} network Network to check against, defaults to "homestead". Other valid choices: "ropsten", "kovan", etc
 * @returns
 */
export const verify = async (
  document: SignedDocument,
  network = "homestead"
) => {
  const smartContracts = documentToSmartContracts(document, network);
  const checks = getAllChecks(document, smartContracts);
  const [hash, issued, revoked] = await Promise.all(checks);

  return {
    hash,
    issued,
    revoked,
    valid: isDocumentValid(hash, issued, revoked)
  };
};

/**
 * @param  {object} document Entire document object to be validated
 * @param  {string} network Network to check against, defaults to "homestead". Other valid choices: "ropsten", "kovan", etc
 * @returns  {array} Array of promises, each promise corresponds to a verification check.
 *                   The last promise resolves to the overall validity based on all the checks.
 */
export const verifyWithIndividualChecks = (
  document: SignedDocument,
  network = "homestead"
): VerificationChecksWithValidity => {
  const smartContracts = documentToSmartContracts(document, network);
  const [hash, issued, revoked] = getAllChecks(document, smartContracts);

  // If any of the checks are invalid, resolve the overall validity early
  const valid = Promise.all([
    new Promise(async (resolve, reject) =>
      (await hash).checksumMatch ? resolve() : reject()
    ),
    new Promise(async (resolve, reject) =>
      (await issued).issuedOnAll ? resolve() : reject()
    ),
    new Promise(async (resolve, reject) =>
      (await revoked).revokedOnAny ? reject() : resolve()
    )
  ])
    .then(() => true)
    .catch(() => false);

  return [hash, issued, revoked, valid];
};

export default verify; // backward compatible
