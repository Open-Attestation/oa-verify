export const documentDnsDidSigned: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "cfd355d4-6cbb-48eb-ac57-4feb49cc8ee7:string:SGCNM21566325",
    $template: {
      name: "778cc6a0-153a-4562-96b6-3528bef74f51:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "7adc647c-2222-46e1-9e48-21d7648e3469:string:EMBEDDED_RENDERER",
      url: "65a266a6-f946-4f16-9791-3761680963a9:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "2ad7b7bf-6393-4652-8f8c-abffb0bf67d6:string:DEMO STORE",
        revocation: { type: "aedab589-b5f3-4fc1-a319-622f2598f4c5:string:NONE" },
        identityProof: {
          type: "92e015c0-4088-4a98-ab71-773f2a168812:string:DNS-DID",
          id: "93b65e69-3f22-457c-bc70-94fe8cb6dbe4:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          purpose: "00155b5c-bf3d-4fc4-b797-213a65b7c874:string:DOCUMENT_ISSUANCE",
          key: {
            id:
              "77ef8de2-3eb1-42c0-a704-3b14b7d72e27:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            type: "ed3d6420-00d2-4d85-b851-dfdbf153530b:string:Secp256k1VerificationKey2018",
            ethereumAddress: "8bfc8b01-d42f-4e73-99c9-08be7dc58118:string:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            owner: "cbf141ba-c73c-4d11-b61f-96b09b1a54c4:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          },
          location: "5e7cf7d2-e52e-4b01-927b-3de070d619bd:string:example.tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "53c65319-2437-46cd-8ef5-dd7777b8e8e4:string:SG FREIGHT",
      address: {
        street: "1bc8ae6e-2d19-4ceb-bd7a-adbf2f848e5a:string:101 ORCHARD ROAD",
        country: "6179b694-90b0-4ce0-8961-16f43f58b3ac:string:SINGAPORE",
      },
    },
    consignment: {
      description: "0e3537ec-cdee-4ef2-8d9c-22d8bcfa543c:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "fd190e78-8ef7-45b9-a554-527de49521c7:number:5000",
        unit: "59a36848-f1eb-4269-b226-ef7ea6005442:string:LITRES",
      },
      countryOfOrigin: "5b6b125b-9feb-4282-8927-f134dcbe9e67:string:AUSTRALIA",
      outwardBillNo: "c6aaaf13-4d18-4705-80e3-38edc9a24fd9:string:AQSIQ170923130",
      dateOfDischarge: "1b019370-16e2-463a-8735-5be309540a24:string:2018-01-26",
      dateOfDeparture: "3da430d9-8505-40fb-a077-e731649d87e2:string:2018-01-30",
      countryOfFinalDestination: "3333b8bf-22fd-4ed2-8e25-3e139febf072:string:CHINA",
      outgoingVehicleNo: "6667f659-e9f0-4537-ae29-378bcd65427a:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "5d07e4ef-280d-4564-b03a-987b411ec20d:string:PETER LEE",
      designation: "3203412b-b77c-46ad-befe-2a14e74d566c:string:SHIPPING MANAGER",
      date: "3154e2b7-18e9-4bc3-8961-e1afc3e92b49:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "69fe778652b6a94959bc16400440c3a3dae4ce744622430e705939fafb23d01f",
    proof: [],
    merkleRoot: "69fe778652b6a94959bc16400440c3a3dae4ce744622430e705939fafb23d01f",
  },
  proof: [
    {
      type: "DidGenericSignature",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0xcf9275ba546ccc752ff26b5e6072be661dbc066b2427760986d5aa03b108f48c3e8505d8e55c843137a9aa26f5c44a6136b5a16fce2c453b627088cd0fe194771c",
    },
  ],
};
