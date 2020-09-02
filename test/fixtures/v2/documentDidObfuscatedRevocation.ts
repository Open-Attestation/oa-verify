export const documentDidObfuscatedRevocation: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "c4deaa44-b58a-4c9f-b66b-30c0c28f81c9:string:SGCNM21566325",
    $template: {
      name: "0b0220dc-e16e-4ef4-8a4c-7ffd021d9c58:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "7247b6c5-0bed-4393-ac85-a97482ae208a:string:EMBEDDED_RENDERER",
      url: "1b8fe35e-c338-4061-bb22-17a791ad06b8:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "48c17918-af33-4578-a0ce-0efbcad6a088:string:DEMO STORE",
        identityProof: {
          type: "4d9787d9-05f5-48fe-9e4f-8d8577c1612d:string:DID",
          id: "859aae23-cf04-45bb-b687-43e4d20b0790:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          purpose: "7f2b206e-1113-430f-b059-19cc9c8b5694:string:DOCUMENT_ISSUANCE",
          key: {
            id:
              "bdfdb9d3-eb25-437e-8d9b-36fef84430c1:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            type: "aad3b14c-930c-45ee-8d00-94cd28696028:string:Secp256k1VerificationKey2018",
            ethereumAddress: "e33ec706-af23-4a20-9395-3a5ca273f725:string:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            owner: "1b55da7c-cb73-44a1-9499-4aac5c6478a2:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          },
        },
      },
    ],
    recipient: {
      name: "c94682ae-3c60-4d78-ba5c-32133a0ac8e3:string:SG FREIGHT",
      address: {
        street: "eb2563d0-642e-4ab1-9756-75c5fe219a70:string:101 ORCHARD ROAD",
        country: "6b13f61c-ffa0-44f9-b84b-7cf71f202cc4:string:SINGAPORE",
      },
    },
    consignment: {
      description: "cd7c8fa1-42e0-41b5-97c1-08540a7b4770:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "8479ec0a-c8d0-4c86-8117-a25a31c0670d:number:5000",
        unit: "57fdf963-fc94-4a9c-99e8-5f9ec076b754:string:LITRES",
      },
      countryOfOrigin: "50f56128-3f61-4318-b2e2-37124b9273dd:string:AUSTRALIA",
      outwardBillNo: "050fd84b-7229-4ab8-9b20-8ffc5786f7fd:string:AQSIQ170923130",
      dateOfDischarge: "a50ca7fe-0b99-4bd4-b72c-f38fbc79c520:string:2018-01-26",
      dateOfDeparture: "2895e14b-9de6-4d03-88b1-0b5d2f5ed3ef:string:2018-01-30",
      countryOfFinalDestination: "e9f9a317-db5f-4eed-a50e-9d861cdc91c6:string:CHINA",
      outgoingVehicleNo: "4cbbb08a-3c33-4662-920c-d5ec669157c2:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "46ddec62-8f62-485b-aca3-98693ae78420:string:PETER LEE",
      designation: "31a90254-0f93-4273-919d-2e61b7ad0493:string:SHIPPING MANAGER",
      date: "5fed8d09-4a7d-4041-8e30-0f3466def614:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "2a77f5aea82add5574eaa4f4bde9a6c9e0230fb6e99489edfd5e51dce81be055",
    proof: [],
    merkleRoot: "2a77f5aea82add5574eaa4f4bde9a6c9e0230fb6e99489edfd5e51dce81be055",
  },
  proof: [
    {
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0x0974ce1ed68a24f90f4b8d1a797f59674e13bad9f9caa2e59ae5206101d8dad16b464c83c1cbf65c40e2a99fdd2f34b2c570c36c8b648713b51b8903416b2acc1b",
    },
  ],
  privacy: {
    obfuscatedData: ["fc3cb56fe0c9a5ac1a91af35b1d3a61c976a0158a35dc0709550c97b21a8b2ae"],
  },
};
