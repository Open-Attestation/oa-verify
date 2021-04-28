export const documentDnsDidSigned: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "9a472a0a-42db-4559-baf2-90d6fcc2b113:string:SGCNM21566325",
    $template: {
      name: "e2da3963-d070-43e0-9cce-888886cd3173:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "f6b1b012-7dcb-4725-952d-228708746a21:string:EMBEDDED_RENDERER",
      url: "f64728c6-b985-465c-a31c-d2c98d5e055a:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "27f71dea-839c-4484-8a72-72f974a3c093:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "cc8465bc-4432-47cf-94bf-0ee0c8c49c22:string:DEMO STORE",
        revocation: { type: "85debc04-1698-4a1b-b6ac-7ef7e8f9d4b4:string:NONE" },
        identityProof: {
          type: "767bd2d0-f1e4-4471-81a0-c4056d42f592:string:DNS-DID",
          key:
            "5edf0191-5492-4659-891b-84e68793c9be:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          location: "ad412e6a-a9b6-40e6-bb17-18b097d86833:string:example.tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "243cdac1-8d75-47ca-a4f3-b9e305f16f50:string:SG FREIGHT",
      address: {
        street: "241f4d4f-ddeb-4344-a0e5-6a766b664c38:string:101 ORCHARD ROAD",
        country: "b66e2078-1bb2-41e3-b60b-0a16b6b79639:string:SINGAPORE",
      },
    },
    consignment: {
      description: "77d0a5c6-e383-485c-b0bf-1439a1f67ae4:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "cd54295b-e569-4461-8b3d-5eae4f12f86d:number:5000",
        unit: "c4f4b1b4-3f05-469c-9f79-8eea65cfb9e1:string:LITRES",
      },
      countryOfOrigin: "89377474-29b7-44eb-8a2e-d2d8f4c2ba25:string:AUSTRALIA",
      outwardBillNo: "8c8e7f1b-6ec0-429f-8536-739b149507f9:string:AQSIQ170923130",
      dateOfDischarge: "32ef239d-d98a-4712-a40a-330d39d4db16:string:2018-01-26",
      dateOfDeparture: "a068e31d-9f2b-4698-b4d0-69bf9181d1d6:string:2018-01-30",
      countryOfFinalDestination: "2ef9d520-dd2c-4076-a2af-bf1e6bd9bd61:string:CHINA",
      outgoingVehicleNo: "099c443a-c51e-4446-ae2c-0ba90d6d2510:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "b9915d76-bf07-427d-952d-2c77eca55cc3:string:PETER LEE",
      designation: "d04e3577-515c-4fad-aa66-47319ce3b970:string:SHIPPING MANAGER",
      date: "ffd492e3-88f6-4803-a2eb-1a6395197909:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "d0ebc96b62001b10348d3f9931f91b3c7aa421445f9719a984d67c22465a86c5",
    proof: [],
    merkleRoot: "d0ebc96b62001b10348d3f9931f91b3c7aa421445f9719a984d67c22465a86c5",
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
