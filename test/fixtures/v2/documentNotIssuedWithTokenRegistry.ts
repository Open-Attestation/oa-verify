import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

interface CustomDocument extends v2.OpenAttestationDocument {
  recipient: {
    name: string;
    address: {
      street: string;
      country: string;
    };
  };
  consignment: any;
  declaration: any;
}
export const documentNotIssuedWithTokenRegistry: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "a6d1bed7-4819-47a6-8643-cf1655546fed:string:SGCNM21566325",
    $template: {
      name: "fcc0fc9c-325d-4ab6-a2cb-658edac82118:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "636e41a5-ba82-4841-ba31-a63a6aa842a4:string:EMBEDDED_RENDERER",
      url: "294b25d5-68a2-4681-9486-87df3c783da9:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "71c5b4f1-58c6-4d27-9670-388c7cf4b05e:string:DEMO STORE",
        tokenRegistry: "d3e0ca72-96b4-41b0-b7a6-2ef587363aa6:string:0x921dC7cEF00155ac3A33f04DA7395324d7809757",
        identityProof: {
          type: "97bb92fa-b016-42cd-82f3-184e8c24792e:string:DNS-TXT",
          location: "9034d15c-135d-493b-9e2b-817061c9c3bd:string:demo-tradetrust.openattestation.com",
        },
      },
    ],
    recipient: {
      name: "32b3d684-42a7-4e26-807b-f7e4c3a5bb3e:string:SG FREIGHT",
      address: {
        street: "dfd2aefd-b4ed-434e-bfff-bee42e845f62:string:101 ORCHARD ROAD",
        country: "b6f1e943-abfc-4d41-ac77-47a937412e87:string:SINGAPORE",
      },
    },
    consignment: {
      description: "f530de49-07fc-49ec-a071-f0b8d011d247:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "5fe2abab-0305-4f81-95a4-ca244267cc80:string:5000",
        unit: "a12b43e9-2c23-4bf1-b90f-5108feeef294:string:LITRES",
      },
      countryOfOrigin: "fe821cf7-4e42-4153-8c31-b480eb374667:string:AUSTRALIA",
      outwardBillNo: "4c171bc7-ef6a-43c5-8886-ec35de4b34d2:string:AQSIQ170923130",
      dateOfDischarge: "51e76949-e328-4645-8bfd-6d797d5e50a8:string:2018-01-26",
      dateOfDeparture: "1269315c-9cf3-436d-9ea4-82672726c932:string:2018-01-30",
      countryOfFinalDestination: "3c4ca82a-5f3c-4ae9-89cb-0e6100b392cc:string:CHINA",
      outgoingVehicleNo: "e72830b1-2ce7-4334-8ee2-657e2345414d:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "0116fd8a-8ce7-4841-9a91-ad1a1e86830a:string:PETER LEE",
      designation: "3bfdb115-60d5-4e9f-9e3e-5b2c29220b36:string:SHIPPING MANAGER",
      date: "5cc2bef4-b4d1-46c4-979b-8436e4d8d3df:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "40f9728e5abcd23b220fa62dcd9075eba77229a1cf5330ecc6e0a8d0fe9f9259",
    proof: [],
    merkleRoot: "40f9728e5abcd23b220fa62dcd9075eba77229a1cf5330ecc6e0a8d0fe9f9259",
  },
};
