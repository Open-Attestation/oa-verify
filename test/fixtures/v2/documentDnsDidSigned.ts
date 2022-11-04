export const documentDnsDidSigned: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "9e311b70-979d-4728-af5a-e37c777cbbfd:string:SGCNM21566325",
    $template: {
      name: "1ecc233b-d3e4-431d-9cfb-14f080b5576e:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "9f27a50f-158a-4286-b4d9-92a7ae13be30:string:EMBEDDED_RENDERER",
      url: "09263ccd-e804-4d07-9582-0646600c69e2:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "140c686a-4017-421c-a5e9-fdb07c1accd0:string:did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
        name: "6c0c26dc-f744-4af6-9ccc-ab2f67248e1b:string:DEMO STORE",
        revocation: {
          type: "7432f2cc-00d8-4c58-a5d0-f922f21c8614:string:REVOCATION_STORE",
          location: "dbe5fb41-b2a5-47bd-85d1-fea9d1b4caef:string:0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
        },
        identityProof: {
          type: "0c12407d-31a4-4a4e-839e-f5f8bb77c317:string:DNS-DID",
          key:
            "1949b9e6-7dc2-49c8-bf07-e88931ceef59:string:did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
          location: "0259c7c5-b373-467c-95f9-a63b8be53b13:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "779ac49c-fa53-4c8c-abdf-95996303ceca:string:AUS FREIGHT",
      address: {
        street: "daf7f3c9-cd36-4346-bd8b-136e6947042a:string:101 APPLE ROAD",
        country: "0092049b-7f24-41da-be58-98c12a8e54b6:string:AUSTRALIA",
      },
    },
    consignment: {
      description: "e8d63dc8-336b-47ed-8c32-f885a13bb3f9:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "ffe30ea1-0926-4689-9808-5a5d1e95bd26:string:5000",
        unit: "e33096b6-a55d-42f3-82fd-afd79c5a21a6:string:LITRES",
      },
      countryOfOrigin: "3b9ee621-df41-440c-82d9-b7aed1e06db1:string:AUSTRALIA",
      outwardBillNo: "a7af0df6-b3bd-477d-887a-05bcd0e53e04:string:AQSIQ170923150",
      dateOfDischarge: "85e1e2be-1f7d-43de-987d-810a8371eb04:string:2018-01-26",
      dateOfDeparture: "96afa038-4f13-4dd4-b4e8-12adf1a261c2:string:2018-01-30",
      countryOfFinalDestination: "80e2c732-c59f-4f94-88a7-5f6c575eda3b:string:CHINA",
      outgoingVehicleNo: "b3f98636-2c62-40ab-bfa4-8b3f414068f6:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "ed764112-16fa-4627-9541-7cd99ddc2ca3:string:PETER LEE",
      designation: "cf9221f7-4861-446a-a554-3efb54edeff3:string:SHIPPING MANAGER",
      date: "e7c1b037-56f4-45ec-9903-3c2dd330d39f:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "a428e123d99b68a76228f8d5255e27e9d158147767ad3e54e9ef2fe117a2b446",
    proof: [
      "2328c806fcc07f91df394965e0050130089882f7e1059747859387a38e5a6542",
      "4ddcee582f5ea9e24c1c4983fb365714dc444ba15e89d76eb05cd87886a92732",
    ],
    merkleRoot: "3752f29527952e7ccc6bf4da614d80f2fec9e5bd8b71adf10beb4e6763e6c233",
  },
  proof: [
    {
      type: "OpenAttestationSignature2018",
      created: "2022-10-27T07:52:38.199Z",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
      signature:
        "0x0cc602d746237f445af62a32aeb8e93701a96600b450d8b02005ec230d88351e40f89b31f8e0b13df35175cfd1321862098ce4aa34ed0686738f5322e9fea97e1c",
    },
  ],
};
