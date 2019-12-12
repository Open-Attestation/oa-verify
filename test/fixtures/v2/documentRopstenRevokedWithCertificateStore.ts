import { WrappedDocument } from "@govtechsg/open-attestation";

export const documentRopstenRevokedWithCertificateStore: WrappedDocument = {
  version: "open-attestation/2.0",
  schema: "tradetrust/1.0",
  data: {
    id: "753b6c77-426c-4d08-ab62-8ab789151db7:string:SGCNM21566325",
    $template: {
      name: "c2b7f21b-b429-4b1f-95e2-cace8e711255:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "bcefdcaa-3605-4240-bdab-3163ae541af7:string:EMBEDDED_RENDERER",
      url: "8f5c3f14-2a45-404a-a7e0-7d91263b3711:string:https://demo-cnm.openattestation.com"
    },
    issuers: [
      {
        name: "fca9c7f0-84cb-456b-83de-612ecf89112f:string:DEMO STORE",
        certificateStore: "abec04c0-bd39-4827-82e3-5a69889bf073:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        identityProof: {
          type: "01dcfdbe-7284-4c60-8166-9346dd6dfb89:string:DNS-TXT",
          location: "bc14e9b4-8058-439e-9be1-5bbc60edca25:string:example.tradetrust.io"
        }
      }
    ],
    recipient: {
      name: "019e1c9a-886a-4a15-bf84-e44e14a94ba8:string:SG FREIGHT",
      address: {
        street: "4ab5aac8-bd9a-4159-9f1b-b22ebac07011:string:101 ORCHARD ROAD",
        country: "3ae27860-2631-4141-a0bf-6b8d9c1397af:string:SINGAPORE"
      }
    },
    consignment: {
      description: "7fa4d11a-53c4-459c-9fcd-ca8eaa9ff9b2:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "29c1c1da-c665-49b8-a82d-adc4de8ce2d6:number:5000",
        unit: "5001ffde-7cc6-4d78-aed1-0a80d8c4fc1c:string:LITRES"
      },
      countryOfOrigin: "cf857f1c-9250-496d-a510-2e58a24fc34e:string:AUSTRALIA",
      outwardBillNo: "065b77d0-250b-4d74-8551-bfe8a7152371:string:AQSIQ170923130",
      dateOfDischarge: "a1e11609-4cb8-422e-afea-f625d6bb2ba5:string:2018-01-26",
      dateOfDeparture: "6ec43de7-6e18-4d67-93e5-dd1d74e7e833:string:2018-01-30",
      countryOfFinalDestination: "d64b9086-75a3-4a52-a81f-8aad0fe841dd:string:CHINA",
      outgoingVehicleNo: "edd89e4e-86c0-4381-9d91-6019808441a5:string:COSCO JAPAN 074E/30-JAN"
    },
    declaration: {
      name: "d4b92d61-deb9-4939-808e-7b9b4d04bf52:string:PETER LEE",
      designation: "40c6219d-d70a-4255-aa66-ec9b658f40ca:string:SHIPPING MANAGER",
      date: "9186a79c-a8c0-4ae4-bd38-2a39ae499d3b:string:2018-01-28"
    }
  },
  privacy: {
    obfuscatedData: []
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "a874e4c79b27ddd3701984aaff9bc8bd30248f3214401d53ff238286900204a6",
    proof: [],
    merkleRoot: "a874e4c79b27ddd3701984aaff9bc8bd30248f3214401d53ff238286900204a6"
  }
};
