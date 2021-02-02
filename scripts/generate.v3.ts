/* eslint-disable @typescript-eslint/no-empty-function,camelcase */
import { __unsafe__use__it__at__your__own__risks__wrapDocument, v3 } from "@govtechsg/open-attestation";
import { writeFileSync } from "fs";
import { Wallet, utils } from "ethers";
import { execSync } from "child_process";
import {
  baseDidDocument,
  baseDnsDidDocument,
  baseDocumentStoreDocument,
  baseTokenRegistryDocument,
} from "../test/fixtures/v3/documents";
import { getLogger } from "../src/common/logger";

const { info } = getLogger("generate.v3");

// DNS: example.tradetrust.io
// Addr: 0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89
// Key: 0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655
const wallet = new Wallet("0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655");

const ethereumDocumentConfig = {
  network: "ropsten",
  dns: "demo-tradetrust.openattestation.com",
  documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
  tokenRegistry: "0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
  wallet: {
    address: "0x1245e5B64D785b25057f7438F715f4aA5D965733",
    key: "0x416f14debf10172f04bef09f9b774480561ee3f05ee1a6f75df3c71ec0c60666",
  },
  timeout: 5 * 60 * 1000, // 5 min timeout for contract to execute
};

const generateDnsDid = async () => {
  info("Generating DNS-DID files");
  writeFileSync("./test/fixtures/v3/dnsdid.json", JSON.stringify(baseDnsDidDocument, null, 2));
  const wrappedBaseDnsDidDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(baseDnsDidDocument);
  writeFileSync("./test/fixtures/v3/dnsdid-wrapped.json", JSON.stringify(wrappedBaseDnsDidDocument, null, 2));
  const { merkleRoot } = wrappedBaseDnsDidDocument.proof;
  const signature = await wallet.signMessage(utils.arrayify(`0x${merkleRoot}`));
  const signedDnsDidDocument: v3.SignedWrappedDocument = {
    ...wrappedBaseDnsDidDocument,
    proof: {
      ...wrappedBaseDnsDidDocument.proof,
      key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature,
    },
  };
  writeFileSync("./test/fixtures/v3/dnsdid-signed.json", JSON.stringify(signedDnsDidDocument, null, 2));
  const validSignatureWithoutDnsTxt = {
    ...baseDnsDidDocument,
    openAttestationMetadata: {
      ...baseDnsDidDocument.openAttestationMetadata,
      identityProof: {
        type: v3.IdentityProofType.DNSDid,
        identifier: "notinuse.tradetrust.io",
      },
    },
  };
  const wrappedInvalidDnsDidDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(
    validSignatureWithoutDnsTxt
  );
  const signatureForInvalidDocument = await wallet.signMessage(utils.arrayify(`0x${wrappedInvalidDnsDidDocument.proof.merkleRoot}`));
  const signedInvalidDnsDidDocument: v3.SignedWrappedDocument = {
    ...wrappedInvalidDnsDidDocument,
    proof: {
      ...wrappedInvalidDnsDidDocument.proof,
      key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature: signatureForInvalidDocument,
    },
  };
  writeFileSync("./test/fixtures/v3/dnsdid-invalid-signed.json", JSON.stringify(signedInvalidDnsDidDocument, null, 2));
};

const generateDid = async () => {
  info("Generating DID files");
  writeFileSync("./test/fixtures/v3/did.json", JSON.stringify(baseDidDocument, null, 2));
  const wrappedBaseDidDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(baseDidDocument);
  writeFileSync("./test/fixtures/v3/did-wrapped.json", JSON.stringify(wrappedBaseDidDocument, null, 2));
  const { merkleRoot } = wrappedBaseDidDocument.proof;
  const signature = await wallet.signMessage(utils.arrayify(`0x${merkleRoot}`));
  const signedDidDocument: v3.SignedWrappedDocument = {
    ...wrappedBaseDidDocument,
    proof: {
      ...wrappedBaseDidDocument.proof,
      key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature,
    },
  };
  writeFileSync("./test/fixtures/v3/did-signed.json", JSON.stringify(signedDidDocument, null, 2));
  const validSignatureWithoutDnsTxt = {
    ...baseDidDocument,
    openAttestationMetadata: {
      ...baseDidDocument.openAttestationMetadata,
      identityProof: {
        type: v3.IdentityProofType.DNSDid,
        identifier: "notinuse.tradetrust.io",
      },
    },
  };
  const wrappedInvalidDnsDidDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(
    validSignatureWithoutDnsTxt
  );
  const signatureForInvalidDocument = await wallet.signMessage(utils.arrayify(`0x${wrappedInvalidDnsDidDocument.proof.merkleRoot}`));
  const signedInvalidDnsDidDocument: v3.SignedWrappedDocument = {
    ...wrappedInvalidDnsDidDocument,
    proof: {
      ...wrappedInvalidDnsDidDocument.proof,
      key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature: signatureForInvalidDocument,
    },
  };
  writeFileSync("./test/fixtures/v3/did-invalid-signed.json", JSON.stringify(signedInvalidDnsDidDocument, null, 2));
};

const generateDocumentStore = async () => {
  info("Generating Document Store files");
  writeFileSync("./test/fixtures/v3/documentStore.json", JSON.stringify(baseDocumentStoreDocument, null, 2));
  const wrappedBaseDocumentStoreDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(
    baseDocumentStoreDocument
  );
  writeFileSync(
    "./test/fixtures/v3/documentStore-wrapped.json",
    JSON.stringify(wrappedBaseDocumentStoreDocument, null, 2)
  );
  const issuedBaseDocumentStoreDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(
    baseDocumentStoreDocument
  );
  writeFileSync(
    "./test/fixtures/v3/documentStore-issued.json",
    JSON.stringify(issuedBaseDocumentStoreDocument, null, 2)
  );
  const revokedBaseDocumentStoreDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(
    baseDocumentStoreDocument
  );
  writeFileSync(
    "./test/fixtures/v3/documentStore-revoked.json",
    JSON.stringify(revokedBaseDocumentStoreDocument, null, 2)
  );
  const invalidDnsDocumentStoreDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument({
    ...baseDocumentStoreDocument,
    openAttestationMetadata: {
      ...baseDocumentStoreDocument.openAttestationMetadata,
      identityProof: {
        type: v3.IdentityProofType.DNSTxt,
        identifier: "notinuse.tradetrust.io",
      },
    },
  });
  writeFileSync(
    "./test/fixtures/v3/documentStore-invalid-issued.json",
    JSON.stringify(invalidDnsDocumentStoreDocument, null, 2)
  );
  info("Issuing document(1/3)...");
  const cmdIssue1 = `oa document-store issue -h 0x${issuedBaseDocumentStoreDocument.proof.merkleRoot} -a ${ethereumDocumentConfig.documentStore} -k ${ethereumDocumentConfig.wallet.key} -n ${ethereumDocumentConfig.network}`;
  execSync(cmdIssue1, { timeout: ethereumDocumentConfig.timeout });
  info("Issuing document(2/3)...");
  const cmdIssue2 = `oa document-store issue -h 0x${revokedBaseDocumentStoreDocument.proof.merkleRoot} -a ${ethereumDocumentConfig.documentStore} -k ${ethereumDocumentConfig.wallet.key} -n ${ethereumDocumentConfig.network}`;
  execSync(cmdIssue2, { timeout: ethereumDocumentConfig.timeout });
  info("Issuing document(3/3)...");
  const cmdIssue3 = `oa document-store issue -h 0x${invalidDnsDocumentStoreDocument.proof.merkleRoot} -a ${ethereumDocumentConfig.documentStore} -k ${ethereumDocumentConfig.wallet.key} -n ${ethereumDocumentConfig.network}`;
  execSync(cmdIssue3, { timeout: ethereumDocumentConfig.timeout });
  info("Revoking document...");
  const cmdRevoke = `oa document-store revoke -h 0x${revokedBaseDocumentStoreDocument.proof.merkleRoot} -a ${ethereumDocumentConfig.documentStore} -k ${ethereumDocumentConfig.wallet.key} -n ${ethereumDocumentConfig.network}`;
  execSync(cmdRevoke, { timeout: ethereumDocumentConfig.timeout });
};

const generateTokenRegistry = async () => {
  info("Generating Token Registry files");
  writeFileSync("./test/fixtures/v3/tokenRegistry.json", JSON.stringify(baseTokenRegistryDocument, null, 2));
  const wrappedBaseTokenRegistryDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(
    baseTokenRegistryDocument
  );
  writeFileSync(
    "./test/fixtures/v3/tokenRegistry-wrapped.json",
    JSON.stringify(wrappedBaseTokenRegistryDocument, null, 2)
  );
  const issuedBaseTokenRegistryDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(
    baseTokenRegistryDocument
  );
  writeFileSync(
    "./test/fixtures/v3/tokenRegistry-issued.json",
    JSON.stringify(issuedBaseTokenRegistryDocument, null, 2)
  );
  const invalidDnsTokenRegistryDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument({
    ...baseTokenRegistryDocument,
    openAttestationMetadata: {
      ...baseTokenRegistryDocument.openAttestationMetadata,
      identityProof: {
        type: v3.IdentityProofType.DNSTxt,
        identifier: "notinuse.tradetrust.io",
      },
    },
  });
  writeFileSync(
    "./test/fixtures/v3/tokenRegistry-invalid-issued.json",
    JSON.stringify(invalidDnsTokenRegistryDocument, null, 2)
  );
  const cmdIssue1 = `oa token-registry mint -a ${ethereumDocumentConfig.tokenRegistry} --tokenId 0x${issuedBaseTokenRegistryDocument.proof.merkleRoot} --to ${ethereumDocumentConfig.wallet.address} -k ${ethereumDocumentConfig.wallet.key} -n ${ethereumDocumentConfig.network}`;
  info("Issuing document(1/2)...");
  execSync(cmdIssue1, { timeout: ethereumDocumentConfig.timeout });
  info("Issuing document(2/2)...");
  const cmdIssue2 = `oa token-registry mint -a ${ethereumDocumentConfig.tokenRegistry} --tokenId 0x${invalidDnsTokenRegistryDocument.proof.merkleRoot} --to ${ethereumDocumentConfig.wallet.address} -k ${ethereumDocumentConfig.wallet.key} -n ${ethereumDocumentConfig.network}`;
  execSync(cmdIssue2, { timeout: ethereumDocumentConfig.timeout });
};

const run = async () => {
  await generateDid();
  await generateDnsDid();
  await generateDocumentStore();
  await generateTokenRegistry();
};

run();
