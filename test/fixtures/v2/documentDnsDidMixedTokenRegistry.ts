export const documentDnsDidMixedTokenRegistryInvalid: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "9786e905-b7b4-4350-bd03-c24d3cd126f7:string:SGCNM21566325",
    $template: {
      name: "a0414285-7a0a-4ee0-abc9-f5a747956cac:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "1b4c544b-38fb-4198-8a47-0cbedc8912e4:string:EMBEDDED_RENDERER",
      url: "2931df4d-275b-4306-b1c2-2dfe63a07b8b:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "4b5696c5-1a16-4d5a-8b3b-34a3c9e77d48:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "12d16f53-cabc-4a05-b754-a7b6e19541bb:string:DEMO STORE",
        revocation: { type: "f616b59c-10d4-4321-b3c5-8a68b6cde69e:string:NONE" },
        identityProof: {
          type: "30260b01-59ea-4f98-9ac8-f01e7a2fdb3b:string:DNS-DID",
          key:
            "fde9b540-0e21-4a22-a055-d0238c226911:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          location: "600bf394-130b-4440-a294-3c838e6b4dd4:string:example.com",
        },
      },
      {
        name: "eded8bed-d5d2-4d4a-993f-f347d1d27523:string:DEMO STORE",
        tokenRegistry: "5768a07f-5dd0-4432-9a06-17f0e6e24c89:string:0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
        identityProof: {
          type: "827202b9-fe95-420b-a7fe-e8c9eb02a673:string:DNS-TXT",
          location: "68a2c24c-14e6-4bf4-8f59-8cac38067bfe:string:tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "38aa1bad-4b94-4ac0-84c2-dab180cde903:string:SG FREIGHT",
      address: {
        street: "56f34fcb-db0b-4110-b118-55612a68b6c2:string:101 ORCHARD ROAD",
        country: "08ea59a8-af0a-4d8f-a61b-b10801c560af:string:SINGAPORE",
      },
    },
    consignment: {
      description: "589cc4bb-1c64-4f17-8874-45455e0a7c6e:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "a76dcc2b-ed0e-4a7e-bc58-5009eecbbc64:number:5000",
        unit: "fd4b29b2-2c6c-4f1a-8357-cec57d66df6c:string:LITRES",
      },
      countryOfOrigin: "fed2ff09-944b-422f-b596-ec76aaee7316:string:AUSTRALIA",
      outwardBillNo: "8679db7b-1830-4319-b0ba-14ca508ffa4c:string:AQSIQ170923130",
      dateOfDischarge: "c7076463-9dbe-4294-ae34-3f97e372ee93:string:2018-01-26",
      dateOfDeparture: "19e1e5f1-af19-4d48-a21d-63b678e4478c:string:2018-01-30",
      countryOfFinalDestination: "9c09a0cc-35b1-4a6d-91d1-7a3454b6c1c1:string:CHINA",
      outgoingVehicleNo: "48189627-95be-4409-8d2d-cebb8f2ec2fb:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "36a654a2-d668-46b5-9ed5-5a7de35c3d9a:string:PETER LEE",
      designation: "64559706-cc9e-464d-8d2e-9a46ecf7ad40:string:SHIPPING MANAGER",
      date: "ebd98e6b-3541-46a2-9237-245dae5b74d7:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "ee1548c091767b09be53a54e576341d8fd07d1ba3fb17873ad334e22f4a28dcc",
    proof: [],
    merkleRoot: "ee1548c091767b09be53a54e576341d8fd07d1ba3fb17873ad334e22f4a28dcc",
  },
  proof: [
    {
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0xd05bb71bdb6f78451e2d12851825421666c6c5e355f516325ce5002a0586f89f6ebbd465227bec59c745dd26918dd8dab9122dcd398256d8e487e0ecf82a53421b",
    },
  ],
};

export const documentDnsDidMixedTokenRegistryValid: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "7746e414-5b1e-4497-b3f2-ae30a1d766ca:string:SGCNM21566325",
    $template: {
      name: "10a917b1-b8da-4daa-b115-19571c233102:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "31524d9c-f406-4a93-affe-617b7ccbabb9:string:EMBEDDED_RENDERER",
      url: "a503fb11-4cdd-4ef6-8381-7092857a321b:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "c6b0f1f7-1e1d-47b4-9eb6-8db9d072b144:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "df597fac-5886-42e5-9859-822bfc897fea:string:DEMO STORE",
        revocation: { type: "a13d5e6d-b566-446e-aab9-ce18901199bb:string:NONE" },
        identityProof: {
          type: "f06b7de2-b0a0-4f8a-ae9f-5d3b57996222:string:DNS-DID",
          key:
            "6848a56a-927b-4b78-a028-1f749950b431:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          location: "5aed1f89-5dec-4296-aa5f-41902c344312:string:example.tradetrust.io",
        },
      },
      {
        name: "61c8f21a-1d24-4ed6-b12f-8cce0f85a1a7:string:DEMO STORE",
        tokenRegistry: "c256d47c-efd5-4b84-8b55-9f6f97dd8c88:string:0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
        identityProof: {
          type: "2d0551a9-ffa1-44ec-8ef2-6e2cb3baf276:string:DNS-TXT",
          location: "fa306803-4a9d-4959-9bc6-8379d27760a0:string:tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "441e25a8-adc0-4d9f-a57d-43a7acf44c63:string:SG FREIGHT",
      address: {
        street: "f3c69786-b96f-4806-ac3d-748d039bfb80:string:101 ORCHARD ROAD",
        country: "22370452-6a31-4189-bc6d-1b1b7ac5bc45:string:SINGAPORE",
      },
    },
    consignment: {
      description: "5018b9f8-a92b-48e1-85e7-11fbdde783cc:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "583b8fd8-fca5-4575-b957-9e21b8b32b5b:number:5000",
        unit: "51a5552c-4ea0-4b47-bbba-c633e9a27c51:string:LITRES",
      },
      countryOfOrigin: "e11325d6-d527-4887-a81e-eba9526829e0:string:AUSTRALIA",
      outwardBillNo: "26c55eb5-11d4-487f-b96a-5f0dd460fb09:string:AQSIQ170923130",
      dateOfDischarge: "0ee92f67-d538-4ec3-9794-2f3b37e964fa:string:2018-01-26",
      dateOfDeparture: "6063d2b6-fda2-42d8-9780-e7d73ef97109:string:2018-01-30",
      countryOfFinalDestination: "ab979384-cd78-4f4e-b0ec-9235993515d8:string:CHINA",
      outgoingVehicleNo: "d4e7d1da-3adb-456c-a203-3df9f78ae23e:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "a07d1811-57ce-48fb-a2b8-ca33c63610f2:string:PETER LEE",
      designation: "a6153112-5299-43ae-9752-e34e37c63d13:string:SHIPPING MANAGER",
      date: "505b1345-1413-4fff-ad33-4f5c1f26688e:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "3795511eabef18fa494b20e4634f8a138bf69376eaf42dedd29766bf3d47d703",
    proof: [],
    merkleRoot: "3795511eabef18fa494b20e4634f8a138bf69376eaf42dedd29766bf3d47d703",
  },
  proof: [
    {
      created: "2021-03-25T07:52:31.291Z",
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0xd05bb71bdb6f78451e2d12851825421666c6c5e355f516325ce5002a0586f89f6ebbd465227bec59c745dd26918dd8dab9122dcd398256d8e487e0ecf82a53421b",
    },
  ],
};
