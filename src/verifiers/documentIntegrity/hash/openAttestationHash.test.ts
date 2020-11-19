import { openAttestationHash } from "./openAttestationHash";
import { tamperedDocumentWithCertificateStore } from "../../../../test/fixtures/v2/tamperedDocument";
import { document } from "../../../../test/fixtures/v2/document";
import { verificationBuilder } from "../../verificationBuilder";

const verify = verificationBuilder([openAttestationHash], { network: "ropsten" });

describe("OpenAttestationHash", () => {
  it("should return a skipped fragment when document is missing target hash", async () => {
    const newDocument = {
      ...tamperedDocumentWithCertificateStore,
      signature: { ...tamperedDocumentWithCertificateStore.signature },
    };
    delete newDocument.signature.targetHash;
    const fragment = await verify(newDocument);
    expect(fragment).toStrictEqual([
      {
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message: "Document does not have merkle root, target hash or data.",
        },
        status: "SKIPPED",
      },
    ]);
  });
  it("should return a skipped fragment when document is missing merkle root", async () => {
    const newDocument = {
      ...tamperedDocumentWithCertificateStore,
      signature: { ...tamperedDocumentWithCertificateStore.signature },
    };
    delete newDocument.signature.merkleRoot;
    const fragment = await verify(newDocument);
    expect(fragment).toStrictEqual([
      {
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message: "Document does not have merkle root, target hash or data.",
        },
        status: "SKIPPED",
      },
    ]);
  });
  it("should return a skipped fragment when document is missing data", async () => {
    const newDocument = {
      ...tamperedDocumentWithCertificateStore,
      data: { ...tamperedDocumentWithCertificateStore.data },
    };
    delete newDocument.data;
    const fragment = await verify(newDocument);
    expect(fragment).toStrictEqual([
      {
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message: "Document does not have merkle root, target hash or data.",
        },
        status: "SKIPPED",
      },
    ]);
  });

  it("should return an invalid fragment when document has been tampered", async () => {
    const fragment = await verify(tamperedDocumentWithCertificateStore);
    expect(fragment).toStrictEqual([
      {
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
        data: false,
        reason: {
          code: 0,
          codeString: "DOCUMENT_TAMPERED",
          message: "Document has been tampered with",
        },
        status: "INVALID",
      },
    ]);
  });
  it("should return a valid fragment when document has not been tampered", async () => {
    const fragment = await verify(document);
    expect(fragment).toStrictEqual([
      {
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY",
        data: true,
        status: "VALID",
      },
    ]);
  });
});
