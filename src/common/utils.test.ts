import { v2, SchemaId, WrappedDocument } from "@govtechsg/open-attestation";
import { isObfuscated, getObfuscatedData } from "./utils";

const documentRopstenNotObfuscated: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    $template: {
      name: "fdb9d37a-ac86-4956-887c-d221c8e0cd62:string:main",
      type: "31f7607f-54b9-46e7-8c1d-9c013c2ecd88:string:EMBEDDED_RENDERER",
      url: "744f3009-426f-4ab7-91be-72abc02332e1:string:https://tutorial-renderer.openattestation.com",
    },
    recipient: {
      name: "f948b6d5-c75c-4c43-99f3-216efac4e00b:string:John Doe",
    },
    issuers: [
      {
        name: "d722d892-03c5-479d-af14-e4e7c6a4b822:string:Demo Issuer",
        documentStore: "0aaf2824-6679-4bda-a669-b94ce50ef590:string:0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
        identityProof: {
          type: "af17ca30-0e7f-4fd9-848e-815f12badd6f:string:DNS-TXT",
          location: "39c6d282-3061-492c-ae56-85745cc3edb7:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692",
    proof: [],
    merkleRoot: "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692",
  },
};

const documentRopstenObfuscated: WrappedDocument<v2.OpenAttestationDocument> = {
  version: SchemaId.v2,
  data: {
    $template: {
      name: "fdb9d37a-ac86-4956-887c-d221c8e0cd62:string:main",
      type: "31f7607f-54b9-46e7-8c1d-9c013c2ecd88:string:EMBEDDED_RENDERER",
      url: "744f3009-426f-4ab7-91be-72abc02332e1:string:https://tutorial-renderer.openattestation.com",
    },
    recipient: {},
    issuers: [
      {
        name: "d722d892-03c5-479d-af14-e4e7c6a4b822:string:Demo Issuer",
        documentStore: "0aaf2824-6679-4bda-a669-b94ce50ef590:string:0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
        identityProof: {
          type: "af17ca30-0e7f-4fd9-848e-815f12badd6f:string:DNS-TXT",
          location: "39c6d282-3061-492c-ae56-85745cc3edb7:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692",
    proof: [],
    merkleRoot: "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692",
  },
  privacy: {
    obfuscatedData: ["45c49a0e6efbde83c602cf6bbe4aa356d495feaf78a9a309cc1bad101f5c52f4"],
  },
};

describe("getObfuscated", () => {
  it("should return false when there is no obfuscated data in v2 document", () => {
    expect(isObfuscated(documentRopstenNotObfuscated)).toBe(false);
  });

  it("should return true where there is obfuscated data in v2 document", () => {
    expect(isObfuscated(documentRopstenObfuscated)).toBe(true);
  });

  it("should return undefined when there is no obfuscated data in v2 document", () => {
    expect(getObfuscatedData(documentRopstenNotObfuscated)).toBe(undefined);
  });

  it("should return array of hashes when there is obfuscated data in v2 document", () => {
    const obfuscatedData = getObfuscatedData(documentRopstenObfuscated);
    expect(obfuscatedData?.length).toBe(1);
    expect(obfuscatedData?.[0]).toBe("45c49a0e6efbde83c602cf6bbe4aa356d495feaf78a9a309cc1bad101f5c52f4");
  });
});
