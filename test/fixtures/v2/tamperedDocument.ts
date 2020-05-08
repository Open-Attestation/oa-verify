import { SchemaId, v2, WrappedDocument } from "@govtechsg/open-attestation";

interface CustomDocument extends v2.OpenAttestationDocument {
  name: string;
  issuedOn: string;
  transcript: any;
  issuers: { url: string; name: string; certificateStore: string }[];
  recipient: {
    name: string;
    email: string;
    phone: string;
  };
}
export const tamperedDocumentWithCertificateStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  schema: "tradetrust/1.0",
  data: {
    id: "046bebd9-1c59-4d82-b70b-b6c8aa5c502d:string:2018091259",
    name: "e91c1c2e-534b-43d1-b73b-e2de2c799242:string:SEAB Certificate for SEAB",
    issuedOn: "8332eaaa-cb87-46ae-a5d0-1f9cae661fba:string:2018-08-31T23:59:32+08:00",
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        url: "de6fcb26-c53a-49fc-a872-432213d135f3:string:https://www.seab.gov.sg/",
        certificateStore: "4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
      },
    ],
    recipient: {
      name: "9dcfe063-b692-4ff6-901c-134c29e4e1df:string:John Snow",
      email: "03a578d3-ab41-4572-bf7b-fc8763832918:string:johnsnow@gmail.com",
      phone: "a2be0e32-4a9e-45fa-9690-a300fadaa5f7:string:+6588888888",
    },
    transcript: [
      {
        name: "97fb29de-56db-4cde-9032-5ef91423bcf4:string:Introduction to SEAB",
        grade: "df28e06b-d06f-4283-ae72-b5b3e30aee28:string:A+",
        courseCredit: "50dc8869-ef3c-4276-a72e-c247d6e64b72:number:3",
        courseCode: "519f79a3-4f8c-4345-9474-d173e6c9a7fe:string:SEAB-HIST",
        url: "c3954ba1-023c-45ad-bbd4-eb4a8df82dc2:string:https://www.seab.gov.sg/pages/about/introduction",
        description: "8d6e4172-51e2-49ba-b98b-d1c5906a0339:string:Understanding the vision, mission, and values",
      },
      {
        name: "4da6b8d8-21d3-4228-937b-acc65a648bf7:string:SEAB - About Us",
        grade: "1cf384cd-8951-4a56-9e42-e3d9954d0c85:string:A",
        courseCredit: "f000cbd2-cf8d-4bf6-94b7-6e73f8037c3f:number:3",
        courseCode: "d52233d5-a137-4e94-ad75-daac38536c87:string:SEAB-ABT",
        url: "148a3906-8cfe-4971-9f17-6f2751a54b8e:string:https://www.seab.gov.sg/pages/about/aboutus",
        description: "69179ec5-78fc-427e-8680-ba91f86d761f:string:About the history of SEAB",
      },
    ],
  },
  privacy: {},
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b",
    proof: [],
    merkleRoot: "85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b",
  },
};

export const tamperedDocumentWithInvalidCertificateStore: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  schema: "tradetrust/1.0",
  data: {
    id: "046bebd9-1c59-4d82-b70b-b6c8aa5c502d:string:2018091259",
    name: "e91c1c2e-534b-43d1-b73b-e2de2c799242:string:SEAB Certificate for SEAB",
    issuedOn: "8332eaaa-cb87-46ae-a5d0-1f9cae661fba:string:2018-08-31T23:59:32+08:00",
    issuers: [
      {
        name: "1f525e1b-50c3-49b7-bfbf-0f110453ff3b:string:Singapore Examination and Assessment Board",
        url: "de6fcb26-c53a-49fc-a872-432213d135f3:string:https://www.seab.gov.sg/",
        certificateStore: "4b467479-77ed-47c7-bfdf-7be8e6618dcd:string:0x20bc9C354A18C8178A713B9BcCFFaC2152b53991",
      },
    ],
    recipient: {
      name: "9dcfe063-b692-4ff6-901c-134c29e4e1df:string:John Snow",
      email: "03a578d3-ab41-4572-bf7b-fc8763832918:string:johnsnow@gmail.com",
      phone: "a2be0e32-4a9e-45fa-9690-a300fadaa5f7:string:+6588888888",
    },
    transcript: [
      {
        name: "97fb29de-56db-4cde-9032-5ef91423bcf4:string:Introduction to SEAB",
        grade: "df28e06b-d06f-4283-ae72-b5b3e30aee28:string:A+",
        courseCredit: "50dc8869-ef3c-4276-a72e-c247d6e64b72:number:3",
        courseCode: "519f79a3-4f8c-4345-9474-d173e6c9a7fe:string:SEAB-HIST",
        url: "c3954ba1-023c-45ad-bbd4-eb4a8df82dc2:string:https://www.seab.gov.sg/pages/about/introduction",
        description: "8d6e4172-51e2-49ba-b98b-d1c5906a0339:string:Understanding the vision, mission, and values",
      },
      {
        name: "4da6b8d8-21d3-4228-937b-acc65a648bf7:string:SEAB - About Us",
        grade: "1cf384cd-8951-4a56-9e42-e3d9954d0c85:string:A",
        courseCredit: "f000cbd2-cf8d-4bf6-94b7-6e73f8037c3f:number:3",
        courseCode: "d52233d5-a137-4e94-ad75-daac38536c87:string:SEAB-ABT",
        url: "148a3906-8cfe-4971-9f17-6f2751a54b8e:string:https://www.seab.gov.sg/pages/about/aboutus",
        description: "69179ec5-78fc-427e-8680-ba91f86d761f:string:About the history of SEAB",
      },
    ],
  },
  privacy: {},
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b",
    proof: [],
    merkleRoot: "85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b",
  },
};
