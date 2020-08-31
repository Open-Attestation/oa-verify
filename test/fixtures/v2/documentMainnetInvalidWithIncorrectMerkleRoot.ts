import { v2, WrappedDocument, SchemaId } from "@govtechsg/open-attestation";

interface CustomDocument extends v2.OpenAttestationDocument {
  recipient: {
    name: string;
    address: {
      street: string;
      country: string;
    };
  };
  certification: any;
  consignment: any;
  declaration: any;
}
export const documentMainnetInvalidWithIncorrectMerkleRoot: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  schema: "tradetrust/v1.0",
  data: {
    id: "26e3bba1-7649-420e-a27e-f38fdbec3469:string:SGCNM21566325",
    $template: {
      name: "8fb7df2e-3ba1-479e-a355-5467d38bd52c:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "3ce0413d-9047-4a18-8789-7483632a512e:string:EMBEDDED_RENDERER",
      url: "983fff6e-5385-4bd0-a635-c20a50c27691:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "c1414e34-a87b-467c-946b-361edb0d426d:string:TradeTrust Demo",
        documentStore: "7762001c-bf13-4ec3-b5a5-adcc149d039f:string:0x6d71da10Ae0e5B73d0565E2De46741231Eb247C7",
        identityProof: {
          type: "1416fc74-d941-4370-8cfb-88997097e309:string:DNS-TXT",
          location: "f542bcfc-00fb-4926-9145-bc22adff4edb:string:demo.tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "9727b3c8-2d64-43ca-9fc4-9ce4ee7fa203:string:SG FREIGHT",
      address: {
        street: "ecf485df-8ff4-416e-bde2-63e1b6072e0a:string:101 ORCHARD ROAD",
        country: "47929d19-ec95-4869-b6a4-c706ec50530a:string:SINGAPORE",
      },
    },
    consignment: {
      description: "eb8ef708-0335-4ece-8bbb-139b06f264e8:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "556317b3-1fb1-4334-a7d7-f88a7477d268:number:5000",
        unit: "10c54e5a-4f7d-45d5-801b-c17787b2d770:string:LITRES",
      },
      countryOfOrigin: "4b3d95fd-6aaf-4694-a994-8b4cc9f2eaa0:string:AUSTRALIA",
      outwardBillNo: "cee74dbd-6117-490c-9bff-9665ea0cbabe:string:AQSIQ170923130",
      dateOfDischarge: "b2b91700-a71f-44e0-ac7c-16ddbe1b5577:string:2018-01-26",
      dateOfDeparture: "f3bb7427-86b4-4a75-adf6-a41c675a9f0f:string:2018-01-30",
      countryOfFinalDestination: "4fdd92ba-2ec9-4eb3-9bde-2c167e957e12:string:CHINA",
      outgoingVehicleNo: "4d9c9e3e-e844-4660-96c3-4a8bf07e22f2:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "882d9945-b2c1-4b22-ba82-3d9e049af588:string:PETER LEE",
      designation: "370d8b2f-78ea-4235-ab91-e1a426deef91:string:SHIPPING MANAGER",
      date: "92c1285c-71e8-4494-b082-ed29ff3668b9:string:2018-01-28",
    },
    certification: {
      name: "1a60ca05-c279-466e-8905-7e6ef4e6054e:string:DEMO JOHN TAN",
      designation: "d75ff67f-b931-4161-84d8-6fd514d646a3:string:DEMO",
      date: "ea2b71b1-e347-4074-8bdd-e95fee8297f0:string:2018-01-28",
    },
  },
  privacy: {
    obfuscatedData: [
      "323cf61a32c24a193aea9609caeeb5b5cf5d47a8fa1dbc8f67921f330dd406e5",
      "f03cbac0ac3876ccb82e489140fc8a6cd93126f1d60161ae319558a25df985b7",
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "61dc9186345e05cc2ae53dc72af880a3b66e2fa7983feaa6254d1518540de50a",
    proof: [],
    // merkleRoot's last 2 characters have been removed to make it even-length (62 char), but not 64 char
    merkleRoot: "61dc9186345e05cc2ae53dc72af880a3b66e2fa7983feaa6254d1518540de5",
  },
};
