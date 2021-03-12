import { v2, v3, SchemaId, WrappedDocument } from "@govtechsg/open-attestation";
import { isObfuscated, getObfuscatedData } from "./utils";

const documentNotObfuscatedV2: WrappedDocument<v2.OpenAttestationDocument> = {
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

const documentObfuscatedV2: WrappedDocument<v2.OpenAttestationDocument> = {
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

const documentObfuscatedV3 = {
  version: SchemaId.v3,
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
  ],
  type: ["VerifiableCredential"],
  issuanceDate: "2010-01-01T20:20:20Z",
  credentialSubject: {
    id: "some:thing:here",
  },
  issuer: {
    id: "https://www.openattestation.com",
    name: "Demo Issuer",
  },
  openAttestationMetadata: {
    template: {
      name: "main",
      type: "EMBEDDED_RENDERER",
      url: "https://tutorial-renderer.openattestation.com",
    },
    proof: {
      type: "OpenAttestationProofMethod",
      method: "DOCUMENT_STORE",
      value: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
    },
    identityProof: {
      type: "DNS-TXT",
      identifier: "demo-tradetrust.openattestation.com",
    },
  },
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "797faecb7662eca4e73a82c25a2387d57acd666354c228291fcd664e6aaeb1ba",
    proofs: [],
    merkleRoot: "797faecb7662eca4e73a82c25a2387d57acd666354c228291fcd664e6aaeb1ba",
    salts:
      "W3sidmFsdWUiOiI3YTZmODA4MTRmMTZkZmNmMmRmNWEyYTExMjdkMjJhYzk4MjUyZDg2NzI5YzFjZTA4ZTg5NWVjYzAzZDNjOGQ5IiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiNzU1ODk2YjI2NjdjN2Y4YmM3YTNkZjhiMGI1Yzk0YTk3NTc3NGRhNDdmOWUyMjk3ODMwOTVkMzk5OTQwNmFiYiIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiI3MmZlOTIxZDJlNmQ4ZTNlNGJmNmY3MDVlODBmODdiNWI3ZDE0NTEyMGMzNzA3MDFjZWZhNGUxZWJjZThhNjU3IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjIzM2ZmNjEwMTY1MDU0OGQ1MzFjMWIxZWU3ZDVlMzJkOWE4YTNiMjM2MzljOTc1ZjYxNzY5YTkyNDdjNzNmODIiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiZTZmNDU1ZTk0NTA0MGJiNWYxOTQ5ZDJjODAzNTA5ODZmNThhMDU1MGJkOTY2YzU1ZGYwNjk3MjIyNzE1ZTBjZSIsInBhdGgiOiJAY29udGV4dFszXSJ9LHsidmFsdWUiOiIzN2RhYzFjN2RmMGI0NmM5ZTQyZDljODA0Zjk3YmJlMjNhM2MxZjI5ZDU4Mjk3NjhiMzU0NmVjZDgyZTk2MGZiIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiMDQ5ODEyNDk1ODM0NDI3NTFlOGRiMTg2OTE3ZjBkOGQxNDE1MWI4YmJkOTg0NmE4MzRhMGExODU5N2Y0MDZmMSIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiMmQ2YTQxZGEzMDNlY2VkNTc0NjY1Nzk4YTAyYmYwODNmZGViMzg5YjIyZGI2Y2Y0MDZiNDRlMTA1OGMxOTE4MSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiJkNzE1MWVjNzFkYmE5YWFjNDg5ZjNjMDBjMzAwODcyOTJjMzIxZWY5M2ZhNzIwYTUzODQ1NzFkZDQ2ZDBkMjk0IiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJmNTE3YTU1ZDA3NTA4MGUxZDIzNjQ4ZmJkZjMzNThmNjMxODllZmU2ZjBkMWU4YWFmM2UzNjJiYmMzNzVlZTUxIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjZmN2U5Y2I5ODlkMjYyMjZiMjU0OTExYTlkZTYxZTQ5ZTZlNTIyNjQ3NTI3ZmIzOTM4MTczZTVmMjViODVmMTUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIyMWU0MmUyYzFiNzRiMzUzYmMxNjdiNWNlMWQxY2U2YTAyYjY0NWY5MmZkMjM3MDFjZjBkZjJlYTAyYTVkN2JhIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiMGYzNzYzM2FkYjIyZmMwMWY5MGViY2YyMzRmYzQ5ZWY2M2ZjNjEyOTY5NWIxYjFjYzdmOWE3YzA3N2I3YTFiMSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiMDRmYzc1MmVjOWQ4N2EzMzkzMWM4MzZiMzZmZGE2ZWFkOWI1ZjM2NWEzYzI2YTU3ZTYzMDlkYzEzNjQwYWNhMCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6IjM2NWI3NTJkMzczYzQxNWZmMTU3NTNkMTExMzBkOWFlZGQwNWNiOWYzYjBkMjViMWRlNWU3NTIxZjBmNTUxZjMiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6IjhkNWE1MWZlYzY0ZmU4NDM1Y2Y4Nzc4MTM1Yzk0OGUyNDEwNzFlNDZkZjI0ZGJmY2Y2MTM4OGVhMzg4ZjFiNDUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiODE4M2UxMDI2YWM5YjU3MzdiMmE2MmMxOTdmNDQ1Y2NlMDA3MWQ2N2VkZjAzMWI5NmY1NTZjNjVhOTRhODZiNCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiMjgwZjg3MGJjOWM5ODJhNThkMGM2Y2JkOGQyY2Q3YTk0NjQwYTE5MDE2NWM5ODMxNTU4MzkwNjc3ODFkMGI0NCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmlkZW50aWZpZXIifV0=",
    privacy: {
      obfuscated: ["e411260249d681968bdde76246350f7ca1c9bf1fae59b6bbf147692961b12e26"],
    },
  },
} as WrappedDocument<v3.OpenAttestationDocument>;

const documentNotObfuscatedV3 = {
  version: SchemaId.v3,
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
  ],
  type: ["VerifiableCredential"],
  issuanceDate: "2010-01-01T20:20:20Z",
  credentialSubject: {
    id: "some:thing:here",
  },
  issuer: {
    id: "https://www.openattestation.com",
    name: "Demo Issuer",
  },
  openAttestationMetadata: {
    template: {
      name: "main",
      type: "EMBEDDED_RENDERER",
      url: "https://tutorial-renderer.openattestation.com",
    },
    proof: {
      type: "OpenAttestationProofMethod",
      method: "DOCUMENT_STORE",
      value: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
    },
    identityProof: {
      type: "DNS-TXT",
      identifier: "demo-tradetrust.openattestation.com",
    },
  },
  recipient: {
    name: "Mary Jane",
  },
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "797faecb7662eca4e73a82c25a2387d57acd666354c228291fcd664e6aaeb1ba",
    proofs: [],
    merkleRoot: "797faecb7662eca4e73a82c25a2387d57acd666354c228291fcd664e6aaeb1ba",
    salts:
      "W3sidmFsdWUiOiI3YTZmODA4MTRmMTZkZmNmMmRmNWEyYTExMjdkMjJhYzk4MjUyZDg2NzI5YzFjZTA4ZTg5NWVjYzAzZDNjOGQ5IiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiNzU1ODk2YjI2NjdjN2Y4YmM3YTNkZjhiMGI1Yzk0YTk3NTc3NGRhNDdmOWUyMjk3ODMwOTVkMzk5OTQwNmFiYiIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiI3MmZlOTIxZDJlNmQ4ZTNlNGJmNmY3MDVlODBmODdiNWI3ZDE0NTEyMGMzNzA3MDFjZWZhNGUxZWJjZThhNjU3IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjIzM2ZmNjEwMTY1MDU0OGQ1MzFjMWIxZWU3ZDVlMzJkOWE4YTNiMjM2MzljOTc1ZjYxNzY5YTkyNDdjNzNmODIiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiZTZmNDU1ZTk0NTA0MGJiNWYxOTQ5ZDJjODAzNTA5ODZmNThhMDU1MGJkOTY2YzU1ZGYwNjk3MjIyNzE1ZTBjZSIsInBhdGgiOiJAY29udGV4dFszXSJ9LHsidmFsdWUiOiIzN2RhYzFjN2RmMGI0NmM5ZTQyZDljODA0Zjk3YmJlMjNhM2MxZjI5ZDU4Mjk3NjhiMzU0NmVjZDgyZTk2MGZiIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiMDQ5ODEyNDk1ODM0NDI3NTFlOGRiMTg2OTE3ZjBkOGQxNDE1MWI4YmJkOTg0NmE4MzRhMGExODU5N2Y0MDZmMSIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiMmQ2YTQxZGEzMDNlY2VkNTc0NjY1Nzk4YTAyYmYwODNmZGViMzg5YjIyZGI2Y2Y0MDZiNDRlMTA1OGMxOTE4MSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiJkNzE1MWVjNzFkYmE5YWFjNDg5ZjNjMDBjMzAwODcyOTJjMzIxZWY5M2ZhNzIwYTUzODQ1NzFkZDQ2ZDBkMjk0IiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJmNTE3YTU1ZDA3NTA4MGUxZDIzNjQ4ZmJkZjMzNThmNjMxODllZmU2ZjBkMWU4YWFmM2UzNjJiYmMzNzVlZTUxIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjZmN2U5Y2I5ODlkMjYyMjZiMjU0OTExYTlkZTYxZTQ5ZTZlNTIyNjQ3NTI3ZmIzOTM4MTczZTVmMjViODVmMTUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIyMWU0MmUyYzFiNzRiMzUzYmMxNjdiNWNlMWQxY2U2YTAyYjY0NWY5MmZkMjM3MDFjZjBkZjJlYTAyYTVkN2JhIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiMGYzNzYzM2FkYjIyZmMwMWY5MGViY2YyMzRmYzQ5ZWY2M2ZjNjEyOTY5NWIxYjFjYzdmOWE3YzA3N2I3YTFiMSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiMDRmYzc1MmVjOWQ4N2EzMzkzMWM4MzZiMzZmZGE2ZWFkOWI1ZjM2NWEzYzI2YTU3ZTYzMDlkYzEzNjQwYWNhMCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6IjM2NWI3NTJkMzczYzQxNWZmMTU3NTNkMTExMzBkOWFlZGQwNWNiOWYzYjBkMjViMWRlNWU3NTIxZjBmNTUxZjMiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6IjhkNWE1MWZlYzY0ZmU4NDM1Y2Y4Nzc4MTM1Yzk0OGUyNDEwNzFlNDZkZjI0ZGJmY2Y2MTM4OGVhMzg4ZjFiNDUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiODE4M2UxMDI2YWM5YjU3MzdiMmE2MmMxOTdmNDQ1Y2NlMDA3MWQ2N2VkZjAzMWI5NmY1NTZjNjVhOTRhODZiNCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiMjgwZjg3MGJjOWM5ODJhNThkMGM2Y2JkOGQyY2Q3YTk0NjQwYTE5MDE2NWM5ODMxNTU4MzkwNjc3ODFkMGI0NCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmlkZW50aWZpZXIifSx7InZhbHVlIjoiNjFiOGZjZGM1OTQ4M2JmNzEzNzBmMjk4NjIzY2YwMjM0NGYyOTFhZWVkOGEzM2VkNDY1OWZkOGU3MDZlNTlmMyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9XQ==",
    privacy: {
      obfuscated: [],
    },
  },
} as WrappedDocument<v3.OpenAttestationDocument>;

describe("getObfuscated", () => {
  it("should return false when there is no obfuscated data in document v2", () => {
    expect(isObfuscated(documentNotObfuscatedV2)).toBe(false);
  });

  it("should return true where there is obfuscated data in document v2", () => {
    expect(isObfuscated(documentObfuscatedV2)).toBe(true);
  });

  it("should return empty array when there is no obfuscated data in document v2", () => {
    expect(getObfuscatedData(documentNotObfuscatedV2)).toHaveLength(0);
  });

  it("should return array of hashes when there is obfuscated data in document v2", () => {
    const obfuscatedData = getObfuscatedData(documentObfuscatedV2);
    expect(obfuscatedData?.length).toBe(1);
    expect(obfuscatedData?.[0]).toBe("45c49a0e6efbde83c602cf6bbe4aa356d495feaf78a9a309cc1bad101f5c52f4");
  });

  it("should return false when there is no obfuscated data in document v3", () => {
    expect(isObfuscated(documentNotObfuscatedV3)).toBe(false);
  });

  it("should return true where there is obfuscated data in document v3", () => {
    expect(isObfuscated(documentObfuscatedV3)).toBe(true);
  });

  it("should return empty array when there is no obfuscated data in document v3", () => {
    expect(getObfuscatedData(documentNotObfuscatedV3)).toHaveLength(0);
  });

  it("should return array of hashes when there is obfuscated data in document v3", () => {
    const obfuscatedData = getObfuscatedData(documentObfuscatedV3);
    expect(obfuscatedData?.length).toBe(1);
    expect(obfuscatedData?.[0]).toBe("e411260249d681968bdde76246350f7ca1c9bf1fae59b6bbf147692961b12e26");
  });
});
