import { __unsafe__use__it__at__your__own__risks__wrapDocument, v3 } from "@govtechsg/open-attestation";
import { baseDidDocument } from "../test/fixtures/v3/documents";
import { writeFileSync } from "fs";
import { Wallet, utils } from "ethers";

// DNS: example.tradetrust.io
// Addr: 0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89
// Key: 0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655
const wallet = new Wallet("0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655");

// Document Store
// DNS: demo-tradetrust.openattestation.com
// DocumentStore: 0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca
// TokenRegistry: 0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B
// Addr: 0x1245e5B64D785b25057f7438F715f4aA5D965733
// Key: 0x416f14debf10172f04bef09f9b774480561ee3f05ee1a6f75df3c71ec0c60666

const generateDnsDid = async () => {
  writeFileSync("./test/fixtures/v3/dnsdid.json", JSON.stringify(baseDidDocument, null, 2));
  const wrappedBaseDnsDidDocument = await __unsafe__use__it__at__your__own__risks__wrapDocument(baseDidDocument);
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
};

const generateDns = async () => {
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
};

const generateDocumentStore = async () => {};
const generateTokenRegistry = async () => {};

const run = async () => {
  await Promise.all([generateDnsDid(), generateDns(), generateDocumentStore(), generateTokenRegistry()]);
};

run();
