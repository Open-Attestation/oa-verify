export const documentDnsDidSigned: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "256f0427-4b74-4e66-8ac4-72ff7ac77689:string:SGCNM21566325",
    $template: {
      name: "e1aea4d3-4abc-42c7-a544-0ac39036fca8:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "0dc652bf-13b3-41de-a9da-85e0a85d873a:string:EMBEDDED_RENDERER",
      url: "331a275a-c921-4a49-992f-18fa468a1565:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "75d5e567-ce12-4aef-af4a-f60a8bfd9716:string:DEMO STORE",
        documentStore: "fc650c64-5307-4cb9-b393-7421a46d1687:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        identityProof: {
          type: "553af6e1-8d2f-4b0b-922f-09511220df96:string:DNS-DID",
          id: "edc5da75-7cde-4067-a793-3be2e960a4bb:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          purpose: "b634904f-214c-44d7-b14c-6cd5a7abcd57:string:DOCUMENT_ISSUANCE",
          key: {
            id: "3d9e1971-0b90-4b3f-840f-570f0d386b22:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#owner",
            type: "dccb642d-62ef-4e03-8846-3c38569a2b54:string:Secp256k1VerificationKey2018",
            ethereumAddress: "850a1a51-8ecd-47d8-855a-8a653462d9ef:string:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            owner: "cf1393b6-ed68-4e04-9773-7dc200c29026:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          },
          location: "ef9082ad-57ec-4bdd-af16-7bb79cdfb355:string:example.tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "48a2c609-cc1a-4ebd-accf-ee1d1275e984:string:SG FREIGHT",
      address: {
        street: "92c85c45-3162-4c0e-a3c4-9c1064235e07:string:101 ORCHARD ROAD",
        country: "e7880710-1a1c-4c2e-bae4-39a72e569a87:string:SINGAPORE",
      },
    },
    consignment: {
      description: "c6dc5822-aa8d-448b-9042-effea0e2e989:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "3c45de7f-471e-47c0-a5f7-ae25a85604b6:number:5000",
        unit: "8fe26f91-9856-48a4-97f9-11082c247b3f:string:LITRES",
      },
      countryOfOrigin: "1210cf9d-d9b0-44d9-b784-bb8ea04b026b:string:AUSTRALIA",
      outwardBillNo: "561acfbf-1031-4681-a89d-57fa939f33c3:string:AQSIQ170923130",
      dateOfDischarge: "bbc6d67f-3e45-4fc3-8e14-429b2b1c1e0a:string:2018-01-26",
      dateOfDeparture: "60edf0ee-f8d5-4a14-a2d9-4e5861a79672:string:2018-01-30",
      countryOfFinalDestination: "5b6d2737-97e9-4794-a451-a8005f9ea272:string:CHINA",
      outgoingVehicleNo: "3ad5c01e-f373-4e5b-94fc-4c7e996cd131:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "a8f27931-dcb0-4445-bf9f-a86657e50c75:string:PETER LEE",
      designation: "e9f19e71-6c2a-4026-854c-abc71e77a759:string:SHIPPING MANAGER",
      date: "93580620-bcda-4fd9-994b-26795b4cc4e0:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "9eb87d78a7802742e47ac61b0fa41eb62a70bfac4afb85886c220c242e765884",
    proof: [],
    merkleRoot: "9eb87d78a7802742e47ac61b0fa41eb62a70bfac4afb85886c220c242e765884",
  },
  proof: [
    {
      type: "DidGenericSignature",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#owner",
      signature:
        "0xc2d684525e4e6230a5488a120f78e1246fb4e526366120352f6d57e474fff9d67693d6389cc7e7d829a3e0923cfa69730f2541599fdb0f04e5213e3e28ddfaf21b",
    },
  ],
};
