export const documentDidObfuscatedRevocation: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "e1917cfe-70fa-4187-ac6d-ccc57c0d4645:string:SGCNM21566325",
    $template: {
      name: "95b39779-f300-43b7-9010-1eb96eafc6b5:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "43e9f19d-1ebd-485d-8cbf-2726c1f7c755:string:EMBEDDED_RENDERER",
      url: "7b0602b0-5e55-42de-813a-27c4f2b54d20:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "6002d4ab-d1a6-447e-9f86-945ee220fedb:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "f46a0b69-983b-4b5e-83f6-aebe14625810:string:DEMO STORE",
        identityProof: {
          type: "c2990f33-814c-4c7f-a14c-8cef4b1aa8ad:string:DID",
          key: "4ef2653f-7fb5-409b-acc1-a76344ff2de0:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        },
      },
    ],
    recipient: {
      name: "a5bcf044-94e4-421e-a0d6-960546dc3b41:string:SG FREIGHT",
      address: {
        street: "1b8dc011-05e0-405e-a687-4b2292a9455a:string:101 ORCHARD ROAD",
        country: "39f0508c-637c-407f-9087-c0d1239c9407:string:SINGAPORE",
      },
    },
    consignment: {
      description: "6819ad4b-ffb2-427c-ac5a-6b812cbefff9:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "fb57e16f-d2f4-4caa-8c37-86514695a3ac:number:5000",
        unit: "b4259694-628d-4dc0-bce1-f7d34bab8a75:string:LITRES",
      },
      countryOfOrigin: "68c4b3bf-6ecf-4b55-894b-3def8c287c6f:string:AUSTRALIA",
      outwardBillNo: "2f5b4abf-47d8-4530-8e13-0f78688637e5:string:AQSIQ170923130",
      dateOfDischarge: "5dde46da-25cb-4721-96c8-a8f7fee4789a:string:2018-01-26",
      dateOfDeparture: "6cc4d4bd-52a4-4998-9cf7-c32a86e78fb0:string:2018-01-30",
      countryOfFinalDestination: "054ea1a5-37ae-4625-b8bf-d2ac43ddfcf2:string:CHINA",
      outgoingVehicleNo: "11ac7f5b-2839-4d27-b4fb-7ac77acb36c7:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "1954f051-1fde-4288-8468-5020dcc883a6:string:PETER LEE",
      designation: "07ff6d5c-40e5-496d-86fd-704866dc8e06:string:SHIPPING MANAGER",
      date: "3873ff50-223f-41d0-b37c-6572328594ae:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "cce7bd33bd80b746b71e943e23ddc88fcb99c9011becdd1b4d8b7ab9567d2adb",
    proof: [],
    merkleRoot: "cce7bd33bd80b746b71e943e23ddc88fcb99c9011becdd1b4d8b7ab9567d2adb",
  },
  privacy: {
    obfuscatedData: ["3dcde1cfa4a6716392514fd5ea8c451c82081a5f2d95f0fc7b045c4f461389ee"],
  },
  proof: [
    {
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0xff0227ce8400a17a2d80073a95fd895f4fed0011954c90eef389bc618087a4b36ed958775420d122e9a6764c6ffe9d3302d4f45fb065d5e962c3572d3872f31a1b",
    },
  ],
};
