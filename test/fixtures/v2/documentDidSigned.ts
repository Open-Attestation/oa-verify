export const documentDidSigned: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "c3b43b01-75dd-45d7-bdaf-74a492c0fb4a:string:SGCNM21566325",
    $template: {
      name: "5f8a8324-fa3b-4e3b-81e8-940fca2fe169:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "8e554aa1-56ba-45a5-b078-f7e061b13b0b:string:EMBEDDED_RENDERER",
      url: "fa1fc35f-49ac-4e09-9b9e-46d4c007f6d3:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "67fa28bf-483d-4aaa-bc8a-89006e6f03b9:string:did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
        name: "0324b7c4-c806-4e0a-b9e1-e24e6ca4139d:string:DEMO STORE",
        revocation: {
          type: "a067bbe3-dff5-40c6-9422-584235c57a7e:string:REVOCATION_STORE",
          location: "0fde8a61-9b87-4881-bdaf-335484771848:string:0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
        },
        identityProof: {
          type: "aa9eb261-43b8-4121-867b-be805c526da0:string:DID",
          key:
            "43771c2e-b8c7-49b2-a274-17f4d4982bec:string:did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
        },
      },
    ],
    recipient: {
      name: "db253694-2cc3-4911-845e-272dc8671663:string:AUS FREIGHT",
      address: {
        street: "82679ca5-4ea0-4bcb-b917-fc49e386ac5c:string:101 APPLE ROAD",
        country: "20491ded-2895-4ee3-b2ad-4e16a4515c22:string:AUSTRALIA",
      },
    },
    consignment: {
      description: "e6ade4ce-5a11-488e-9507-a95fa5229679:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "af96fb9f-f244-4361-aaa3-adac581fd57a:string:5000",
        unit: "eea4921b-e24e-4946-9cae-46e80fe84d5d:string:LITRES",
      },
      countryOfOrigin: "585f7416-6a20-4230-8cfc-5ed89719e55b:string:AUSTRALIA",
      outwardBillNo: "0d746b5d-a30e-4db8-8806-529755234c18:string:AQSIQ170923150",
      dateOfDischarge: "547b717b-8b83-4d26-bb6f-16044d7a9275:string:2018-01-26",
      dateOfDeparture: "22aa8673-fc46-4eeb-baa6-ad69f258adaa:string:2018-01-30",
      countryOfFinalDestination: "9e11e058-1030-4454-bbdc-11b9fafd7796:string:CHINA",
      outgoingVehicleNo: "2af1326e-3149-4ddd-8014-7314cda8c3cb:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "0b4092fa-2a80-4304-a5c3-bde34f4931be:string:PETER LEE",
      designation: "5dca9da0-a7d3-4078-8411-852be410fd8b:string:SHIPPING MANAGER",
      date: "eca81dc4-54f8-435f-9b96-2104ff79355a:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "ff892056d1397e1146b625ac40d77bb4c5c3b47e22858729a65197fd5e89e683",
    proof: [
      "abe59845be21c1607b0cbdab0f622e0d82019fe316072de312bab6b700d9ad13",
      "ee52e200f490b1331ae6877d7b0992572fdcaf6168bcfc1ff879d1fc5f1e06d9",
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
