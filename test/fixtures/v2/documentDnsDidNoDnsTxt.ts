export const documentDnsDidNoDnsTxt: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "e3c28bb6-2d76-4fb4-9ee1-05a41afe9c42:string:SGCNM21566325",
    $template: {
      name: "80c3721b-9a53-45d6-a640-c880208dd479:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "87940099-cea2-4ce6-a4cf-6afe995b82cb:string:EMBEDDED_RENDERER",
      url: "bd983975-4c48-4a24-bb45-d4eaf933b010:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "13657cb7-f8c2-4742-8d75-2c6c728d5cfd:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "b735c8da-dfe5-4e8b-8fca-d668ca7109c8:string:DEMO STORE",
        revocation: { type: "adec602e-b8a1-49c6-b0d6-1c10022e0ee3:string:NONE" },
        identityProof: {
          type: "35a65289-4ca0-4e73-ab7e-c4d50949c186:string:DNS-DID",
          key:
            "37f0906b-0c43-4ce4-80d3-e239b79ef087:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          location: "cf6df0b9-daca-4998-bb77-86b251d23f36:string:example.com",
        },
      },
    ],
    recipient: {
      name: "bea2a061-fdfd-46dc-aeae-dbd860d9d995:string:SG FREIGHT",
      address: {
        street: "f71591ee-e700-482b-b4ff-048c1810ebdf:string:101 ORCHARD ROAD",
        country: "c59b4c56-48fe-49e0-810b-1fa7981d58f9:string:SINGAPORE",
      },
    },
    consignment: {
      description: "dcc4063e-ad49-422b-980f-ccf52d3c98a6:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "5e1accca-a1a7-44a0-8604-e54acf2442b7:number:5000",
        unit: "ec669ca1-d892-432b-8251-a27137a4b5ec:string:LITRES",
      },
      countryOfOrigin: "a2f88c34-aaec-416b-868d-de3488f34d63:string:AUSTRALIA",
      outwardBillNo: "0c774978-b299-4c1f-836c-ac6aaa7caeba:string:AQSIQ170923130",
      dateOfDischarge: "602a8488-1466-4c2b-b2f9-1357d90b09a5:string:2018-01-26",
      dateOfDeparture: "417cbf7e-da31-4ee5-8592-f3ae06217e04:string:2018-01-30",
      countryOfFinalDestination: "183de2df-8df8-4e51-8ef9-36908da7f1ce:string:CHINA",
      outgoingVehicleNo: "7925a245-79a3-47bb-b09e-050796f4abdf:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "e7220c86-0ca5-4a90-8536-311952ac82df:string:PETER LEE",
      designation: "ddfb2c03-2657-4543-bcc5-a95f95189074:string:SHIPPING MANAGER",
      date: "261243b3-2124-49b3-8601-5a66fe448be7:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "4fafb6ff912d651c32cf30ebd8163b3fb95c789120800458b8214e16efabe517",
    proof: [],
    merkleRoot: "4fafb6ff912d651c32cf30ebd8163b3fb95c789120800458b8214e16efabe517",
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
