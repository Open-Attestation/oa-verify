export const documentRopstenMixedIssuance: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "adb44816-1e3e-43c3-8f49-835ee0ef79a7:string:SGCNM21566325",
    $template: {
      name: "4fb89978-800b-4dae-84d9-b899287fa7b2:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "1e0b6830-7907-4c4f-b6eb-26ddbcf4dd89:string:EMBEDDED_RENDERER",
      url: "d1ef0610-b737-4255-b688-d0f191ecea4c:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "3911b21e-a787-41d2-8cfa-e074fac4e96f:string:DEMO STORE",
        tokenRegistry: "52235eed-ef39-47b0-8f3d-46d20f0ddfb9:string:0x257DFD21f991DA9BD420882365020991eec0494E",
        identityProof: {
          type: "b5a46073-1c7c-4dc4-a209-7bb66d767cc9:string:DNS-TXT",
          location: "0170ca49-42ad-4520-a347-46182b2235df:string:example.tradetrust.io",
        },
      },
      {
        name: "c9a9702a-c392-495f-bdef-7d3379f004ca:string:DEMO STORE",
        documentStore: "dea6ee74-bbfb-47e1-ace0-f6de4b8b446a:string:0xEE1772da1Fe18a4506de2AA0567637E9b7aD27Bf",
        identityProof: {
          type: "4e24bbc4-52ef-48ad-819f-c81ad06d4382:string:DNS-TXT",
          location: "33c4da0d-2330-4a1a-8932-8865aca269fb:string:example.tradetrust.io",
        },
      },
      {
        id: "b91ec331-37f0-4011-93cf-bf9624391488:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "016c596d-afaa-4254-a8f5-51f71692a670:string:DEMO STORE",
        revocation: {
          type: "3e9799cb-6187-4a53-b29d-657f8d9fa0cb:string:NONE",
        },
        identityProof: {
          type: "5bb93c34-0252-4d8b-8c77-afbc878ed7f2:string:DNS-DID",
          key:
            "672297df-72a8-417a-ac6c-ed7b154e70c8:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          location: "55dc441f-61ca-4d6f-9f56-0c751f11f210:string:eexample.tradetrust.io",
        },
      },
      {
        id: "8590313c-8755-4e81-a812-8b02ceccc58f:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "b34ac64b-cf5a-4025-a6db-0b33949be981:string:DEMO STORE",
        revocation: {
          type: "36f5c212-5863-4434-a870-7343018c0307:string:NONE",
        },
        identityProof: {
          type: "382e37a8-b296-4acb-ad33-315d4d7ddadb:string:DID",
          key:
            "159a2583-e1e1-4b33-a5ca-397ef537bf53:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        },
      },
    ],
    recipient: {
      name: "5c326805-3ff7-4dbc-84de-46973fef0cca:string:SG FREIGHT",
      address: {
        street: "f79e01b7-e360-484f-8b13-e1da62041621:string:101 ORCHARD ROAD",
        country: "c6a6c96c-fc82-4c91-8911-1cbd449a05c4:string:SINGAPORE",
      },
      consignment: {
        description: "dae0efef-faa6-44d2-90fe-93835d3523a0:string:16667 CARTONS OF RED WINE",
        quantity: {
          value: "32a553f5-28f9-429b-893e-5fb024605958:number:5000",
          unit: "75060d15-8d4a-4f41-bc11-2f210f04fa99:string:LITRES",
        },
        countryOfOrigin: "e44f847f-1c2d-49e6-8266-94439365d548:string:AUSTRALIA",
        outwardBillNo: "74db08f9-61fd-4d3c-b86c-db972f7d9b9e:string:AQSIQ170923130",
        dateOfDischarge: "8d1a62b8-adc2-49a5-9b40-aa1ed9d1fe30:string:2018-01-26",
        dateOfDeparture: "22b0861c-2ef2-4b0a-9cb4-e52b7f45c037:string:2018-01-30",
        countryOfFinalDestination: "dbc538a3-fe51-43ab-9722-09e0ca32ab72:string:CHINA",
        outgoingVehicleNo: "441b8340-1966-44af-8170-75c93ed5bc02:string:COSCO JAPAN 074E/30-JAN",
      },
      declaration: {
        name: "7bd3ce94-d062-4296-aa2f-b554bc9d05bc:string:PETER LEE",
        designation: "24cdf60c-8765-4b4d-aa33-84111068a143:string:SHIPPING MANAGER",
        date: "73bd3d1b-c4b1-4005-8e07-22e0bd56fdd8:string:2018-01-28",
      },
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "259ba081c4fd06a56f200273d628fb4e72a01a8348afc9e4334b0bfd74fcb386",
    proof: [],
    merkleRoot: "259ba081c4fd06a56f200273d628fb4e72a01a8348afc9e4334b0bfd74fcb386",
  },
  proof: [
    {
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0x51acb43022928e988127d040d9a9de5e3d1b487bf65324d3ed1d284ec6994ff10e9a9985cc2ffded3723afcddf9702b38c854c13be11e326daebaee6778aec4c1c",
    },
  ],
};
