export const documentDidCustomRevocation: any = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    id: "3b015577-0f88-4568-9b71-b9e3bc3a9d22:string:SGCNM21566325",
    $template: {
      name: "23db7ca9-825c-4178-b951-f53a1c1ba8f9:string:CERTIFICATE_OF_NON_MANIPULATION",
      type: "f31b4c6e-f68a-4de9-bd94-1a84e2a2bbbf:string:EMBEDDED_RENDERER",
      url: "2746d44a-a5da-4fb3-a334-c4e2b7ebd181:string:https://demo-cnm.openattestation.com",
    },
    issuers: [
      {
        name: "dd05a2ed-04c8-4713-b108-72bb7ea4e47a:string:DEMO STORE",
        revocation: {
          type: "a1829139-a274-409e-a21e-7d08666d2952:string:CUSTOM",
          foo: "5f626461-63f0-453f-a875-b9c8b03fe920:string:BAR",
        },
        identityProof: {
          type: "c1230275-89b3-4c44-b755-626b854a89e5:string:DID",
          id: "86eac6e9-7442-4099-a01e-6304eb03cdaa:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          purpose: "4f6704ef-278b-4751-b6c1-07e2dcf31eda:string:DOCUMENT_ISSUANCE",
          key: {
            id:
              "38de287f-5d23-4789-8df8-c60043ab202f:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            type: "dd9e4541-36c1-4e59-8087-7f2e05413461:string:Secp256k1VerificationKey2018",
            ethereumAddress: "5bbc7f70-e0bb-4f32-a7d5-b0c5df82f5a5:string:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            owner: "68c4ed9f-2a72-4b31-a29c-777494e7e8e8:string:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          },
        },
      },
    ],
    recipient: {
      name: "b6e85c9f-cbbc-4aa9-ac43-0b17b1133283:string:SG FREIGHT",
      address: {
        street: "becaa52d-2d57-4984-8df3-6f83fdf7d4cc:string:101 ORCHARD ROAD",
        country: "cc6cf75e-3d6b-4c1a-a619-5d9f4b898684:string:SINGAPORE",
      },
    },
    consignment: {
      description: "662aad56-c334-475c-9e81-140130de4863:string:16667 CARTONS OF RED WINE",
      quantity: {
        value: "513997aa-fad1-4a3f-82d1-9b77643267d7:number:5000",
        unit: "79e25740-22a2-4111-8c9b-1f348b8d5035:string:LITRES",
      },
      countryOfOrigin: "879e30bf-3de3-4c82-b7ea-0f7593ae195d:string:AUSTRALIA",
      outwardBillNo: "3a303587-ed64-494b-87dd-27995bf0f5c9:string:AQSIQ170923130",
      dateOfDischarge: "9e937f2f-fc94-4f64-944b-6fd3d151d312:string:2018-01-26",
      dateOfDeparture: "29af5d36-bba2-48cd-b87f-3c889093bff6:string:2018-01-30",
      countryOfFinalDestination: "a523c2ab-8dcd-4598-8da2-8112a8b2addc:string:CHINA",
      outgoingVehicleNo: "dea8373e-114a-4a9d-a5ec-119accd7b027:string:COSCO JAPAN 074E/30-JAN",
    },
    declaration: {
      name: "45e4fad8-7671-46ce-ad8c-a7cb1a4ce5fe:string:PETER LEE",
      designation: "9bd77cf3-2240-473d-9c5b-9cbfdb2581e6:string:SHIPPING MANAGER",
      date: "94eb16ce-47ef-4b70-a139-bf268f676db8:string:2018-01-28",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "b51cb42afd96ddfb6698b32224ef9b79e57914c718ada76a85d4d1f8292828d3",
    proof: [],
    merkleRoot: "b51cb42afd96ddfb6698b32224ef9b79e57914c718ada76a85d4d1f8292828d3",
  },
  proof: [
    {
      type: "OpenAttestationSignature2018",
      proofPurpose: "assertionMethod",
      verificationMethod: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0x1b9a0c17f613685ab9b82bca4c6e13c380bdee50ed127f690201bf8dba906e2c7c8bf74a6baedd76ea362893864437056a5ad7ef6678e74b2afcdcf6560199581c",
    },
  ],
};
