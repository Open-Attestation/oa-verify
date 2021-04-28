export const documentDidMixedTokenRegistry: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "d1ac6885-4874-4a58-b8be-e7a77394cab3:string:SGCNM21566325",
    $template: {
      name: "03d57283-6708-4b41-a353-77c51482a66c:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "6376de63-a270-4c32-b5ed-5f07c74690ca:string:EMBEDDED_RENDERER",
      url: "cb970225-54fc-4af5-a8a6-b8dd2f03a561:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "76f6aed2-3df9-4e26-94df-2087a1cbef96:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "74370115-61fe-4525-83ad-c18fbf76ac89:string:DEMO STORE",
        revocation: { type: "6ebb23bb-d83d-4ca9-8523-d8618b6c34d5:string:NONE" },
        identityProof: {
          type: "1fd92bf6-0b01-4705-8b04-805747b7eec1:string:DID",
          key:
            "3e1d0a2e-6b33-45ee-addd-c7fc4a39276a:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        },
      },
      {
        name: "b11c04a0-5cda-4066-9b97-9faa40a56d8e:string:DEMO STORE",
        tokenRegistry: "5f86b163-9546-446e-8cd0-d82cca92bd0c:string:0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
        identityProof: {
          type: "79fc0ddf-5880-4e67-8fa0-1c0f937e5cf4:string:DNS-TXT",
          location: "e6dcdbfc-9c29-4852-82cf-9d25c086eac6:string:tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "cb8877ab-cdca-4150-8a57-54a471016b3b:string:SG FREIGHT",
      address: {
        street: "ff30ea3d-24f5-4037-b164-42ced9144975:string:101 ORCHARD ROAD",
        country: "0d38260b-b6b5-49ae-bc6d-873fcc924bf7:string:SINGAPORE",
      },
    },
    consignment: {
      description: "e3b6f085-f2fc-495c-8a85-006ab6a947c8:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "ce772105-828f-4af0-af06-c6fd22cdd62a:number:5000",
        unit: "ebcb0261-d6a3-46a0-9d57-d19fbda7eaf9:string:LITRES",
      },
      countryOfOrigin: "c6c7a77d-cada-494e-bd16-d4b87a1bcc67:string:AUSTRALIA",
      outwardBillNo: "7c3e4832-56dd-4b07-a59f-aba34fdcc7ee:string:AQSIQ170923130",
      dateOfDischarge: "5132b797-033e-4a4a-b154-7a2bf4ab75cd:string:2018-01-26",
      dateOfDeparture: "1079d65f-767d-4866-8174-7bd424e8c65e:string:2018-01-30",
      countryOfFinalDestination: "df7bba94-4dbc-41bb-a4ec-40bf4804d951:string:CHINA",
      outgoingVehicleNo: "3c7eb8a9-ca34-46a9-bc52-ecfe087a9d9a:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "9ffde9a1-8d3c-4839-a64f-9474d4b1c5e0:string:PETER LEE",
      designation: "445c12d0-0e9d-4d7b-a436-8a1310066220:string:SHIPPING MANAGER",
      date: "791192b2-dd1a-40c9-8158-2188338162a9:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "1938abeb1de47174949bb01fccefdda17f19a932bc79cb121119855f4aa89471",
    proof: [],
    merkleRoot: "1938abeb1de47174949bb01fccefdda17f19a932bc79cb121119855f4aa89471",
  },
  proof: [
    {
      created: "2021-03-25T07:52:31.291Z",
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0xc0d9a94cb981d2f70432032f711b363e191a885a2802e02209d0e5db1983fba618a82c769ba0edc866f9f9166c006dd018455138ff29124b825d531ab2be70db1c",
    },
  ],
};
