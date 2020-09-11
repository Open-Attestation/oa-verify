export const documentDidCustomRevocation: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "875d57ec-2768-408a-b8d3-bb5ebda17b80:string:SGCNM21566325",
    $template: {
      name: "1449b124-9bc4-4722-bed1-47272c69f802:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "ba303026-4130-4801-a6a0-1d17db61a6c5:string:EMBEDDED_RENDERER",
      url: "87c3c915-4d6e-4f27-b7d1-614181d2f620:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        id: "21d8b192-f449-4413-a311-5c9e211082d6:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        name: "f1ca0af7-5e9a-45f3-8635-720babd76387:string:DEMO STORE",
        revocation: {
          type: "edcb13e4-1e1a-4317-a194-ec372345c14f:string:CUSTOM",
          foo: "4f18c9c0-e872-44b0-961e-23c3e6b7be50:string:bar",
        },
        identityProof: {
          type: "877d7405-ee94-434a-a258-ec6add2877d5:string:DID",
          key:
            "37fec355-da53-4c2f-b8d7-b064b305e879:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        },
      },
    ],
    recipient: {
      name: "8a5bffe7-ceb1-41b9-b240-84025eebdc0c:string:SG FREIGHT",
      address: {
        street: "83265d64-7fc8-4201-b21e-0b87d5bc8007:string:101 ORCHARD ROAD",
        country: "beb02ccd-02cf-48c2-adb2-9ea1b55442b0:string:SINGAPORE",
      },
    },
    consignment: {
      description: "bfd4a9ae-47fb-4b72-a131-1827d45f8b72:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "003d32f5-e663-48f1-ac7d-db4ae1f79cce:number:5000",
        unit: "2dac8afd-3a2b-43f5-9853-b92ad5727fd2:string:LITRES",
      },
      countryOfOrigin: "20e4cadc-41e8-49b0-bad9-534f4cdae00f:string:AUSTRALIA",
      outwardBillNo: "3cb5790f-379d-4360-884b-d45345437394:string:AQSIQ170923130",
      dateOfDischarge: "1d774eb3-759d-4d3e-a38f-1aaa5579a3fe:string:2018-01-26",
      dateOfDeparture: "0538a21c-acdd-4de3-aa33-9000b818dc9a:string:2018-01-30",
      countryOfFinalDestination: "2a55a98e-0043-4f26-b23b-7b08d2c30505:string:CHINA",
      outgoingVehicleNo: "154ae7f3-74dc-4972-b001-275a929cb72a:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "397bd565-7902-4201-92fd-2a7b3686d740:string:PETER LEE",
      designation: "53feef96-c973-4f03-bdee-3bae76b139e3:string:SHIPPING MANAGER",
      date: "52c7a56b-23ab-41b5-b7f6-a86e9fbeae44:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "eea9ad6c2998a3d00fe70f91b3c6cefcd7a5c2068e6b13c9d93c00e5d4fcec1a",
    proof: [],
    merkleRoot: "eea9ad6c2998a3d00fe70f91b3c6cefcd7a5c2068e6b13c9d93c00e5d4fcec1a",
  },
  proof: [
    {
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0x5fff5ed3d62fbe92b7a358260f924ea31ba57c53d01fe849d4fc3843beec4b7345a1c00035cf96f11cab9d908ad10aac8d077d5feca2c393240c9cc9e0b9c7e81b",
    },
  ],
};
