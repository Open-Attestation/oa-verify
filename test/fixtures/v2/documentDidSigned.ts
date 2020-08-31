export const documentDidSigned: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "ac5083f4-d511-4a84-8d53-2051ca1ca9ca:string:SGCNM21566325",
    $template: {
      name: "4c5c62ed-0a45-49a7-a2f5-e1c8ed9334c4:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "85b18667-e94c-46c6-b7b7-0d733ba0ae19:string:EMBEDDED_RENDERER",
      url: "00517936-2d08-4e83-9bda-1036cc5e597a:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "daee1635-dc03-4db5-95cc-7a201623511b:string:DEMO STORE",
        documentStore: "1fa8fdc4-6812-45ae-9b97-1bad31040945:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        identityProof: {
          type: "0e5072a7-fd97-443c-84cf-cc861ac28473:string:DID",
          id: "1a1dfae1-983d-4125-8469-5bcc79e0045a:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          purpose: "162e50b7-ed34-4150-a661-4c27a02d0d2a:string:DOCUMENT_ISSUANCE",
          key: {
            id: "f955362b-74e8-4922-8244-47852ed54723:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#owner",
            type: "2da38fd4-d57c-475d-96fb-11c8f22889aa:string:Secp256k1VerificationKey2018",
            ethereumAddress: "688b3495-215c-4971-bad5-f6bd9201fd8e:string:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            owner: "ea406c1e-ef5a-48e6-95b7-60c92022c8e2:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          },
        },
      },
    ],
    recipient: {
      name: "42abe8f9-620b-4ec7-a83d-42c39fcbde46:string:SG FREIGHT",
      address: {
        street: "96505c27-19a8-4f2a-8725-0fd8a1d9b37c:string:101 ORCHARD ROAD",
        country: "d0ad8cd3-59f0-461a-a38f-4842699aa3d0:string:SINGAPORE",
      },
    },
    consignment: {
      description: "4d3af027-0257-4d9f-a795-868c1d93ef3c:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "31984bb2-c332-425e-9339-8b8fa33d80ca:number:5000",
        unit: "f2bfb077-8179-4e65-abc2-7847dd21f1dc:string:LITRES",
      },
      countryOfOrigin: "8427e986-2408-4619-8baf-462c86ec65de:string:AUSTRALIA",
      outwardBillNo: "05dc1365-50bf-48a5-a201-bd781e948905:string:AQSIQ170923130",
      dateOfDischarge: "75054c80-2867-4e6f-8b0a-fc9de865c999:string:2018-01-26",
      dateOfDeparture: "67e0c354-df2b-4d6d-9f87-32161bbe4590:string:2018-01-30",
      countryOfFinalDestination: "d5cdbb5f-3dd9-4201-a78c-fd2e89ef5470:string:CHINA",
      outgoingVehicleNo: "8c8cf7f3-e8f7-43e6-8fcb-c071f310393e:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "c2d376bf-30cf-4d25-bbec-a4b769b9052a:string:PETER LEE",
      designation: "68c06ab0-961e-4342-904a-1cc3f44f0384:string:SHIPPING MANAGER",
      date: "160af630-0e98-49b6-9bf5-27f9d05a4eb1:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "9f9118b68d1e0311987b2f7f6c382dd623e25d6ee2c20eec5e0963fe631e234c",
    proof: [],
    merkleRoot: "9f9118b68d1e0311987b2f7f6c382dd623e25d6ee2c20eec5e0963fe631e234c",
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
