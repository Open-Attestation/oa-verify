import { openAttestationSmartContractExists } from "./openAttestationSmartContractExists";
import { documentRopstenValidWithDocumentStore } from "../../test/fixtures/v3/documentRopstenValid";

describe("OpenAttestationSmartContractExists", () => {
  it("should return an invalid fragment when document has been tampered", async () => {
    const fragment = await openAttestationSmartContractExists.verify(documentRopstenValidWithDocumentStore, {
      network: "ropsten"
    });
    expect(fragment).toStrictEqual({
      name: "OpenAttestationSmartContractExists",
      type: "DOCUMENT_STATUS",
      // data:
      //   'Contract does not exists (ENS name not configured (operation="resolveName(\\"0x8Fc57204c35fb9317D91285eF52D6b892EC08cD4\\")", version=4.0.40))',
      status: "VALID"
    });
  });
});
