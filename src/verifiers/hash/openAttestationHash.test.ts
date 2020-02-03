import { openAttestationHash } from "./openAttestationHash";
import { tamperedDocumentWithCertificateStore } from "../../../test/fixtures/v2/tamperedDocument";
import { document } from "../../../test/fixtures/v2/document";

describe("OpenAttestationHash", () => {
  it("should return an invalid fragment when document has been tampered", async () => {
    const fragment = await openAttestationHash.verify(tamperedDocumentWithCertificateStore, { network: "" });
    expect(fragment).toStrictEqual({
      name: "OpenAttestationHash",
      type: "DOCUMENT_INTEGRITY",
      data: false,
      reason: {
        code: 0,
        codeString: "DOCUMENT_TAMPERED",
        message: "Certificate has been tampered with"
      },
      status: "INVALID"
    });
  });
  it("should return a valid fragment when document has not been tampered", async () => {
    const fragment = await openAttestationHash.verify(document, { network: "" });
    expect(fragment).toStrictEqual({
      name: "OpenAttestationHash",
      type: "DOCUMENT_INTEGRITY",
      data: true,
      status: "VALID"
    });
  });
});
