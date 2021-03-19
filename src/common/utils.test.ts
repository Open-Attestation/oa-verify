import {
  getDocumentIntegrityFragments,
  getDocumentStatusFragments,
  getFragmentByName,
  getIssuerIdentityFragments,
  getOpenAttestationDidIdentityProofFragment,
  getOpenAttestationDidSignedDocumentStatusFragment,
  getOpenAttestationDnsDidIdentityProofFragment,
  getOpenAttestationDnsTxtIdentityProofFragment,
  getOpenAttestationEthereumDocumentStoreStatusFragment,
  getOpenAttestationEthereumTokenRegistryStatusFragment,
  getOpenAttestationHashFragment,
} from "./utils";
import { AllVerificationFragment } from "..";

const fragments: AllVerificationFragment[] = [
  {
    data: true,
    name: "OpenAttestationHash",
    status: "VALID",
    type: "DOCUMENT_INTEGRITY",
  },
  {
    name: "OpenAttestationEthereumTokenRegistryStatus",
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: {
      details: {
        issuance: [
          {
            address: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
            issued: true,
          },
        ],
        revocation: [
          {
            address: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
            revoked: false,
          },
        ],
      },
      issuedOnAll: true,
      revokedOnAny: false,
    },
    name: "OpenAttestationEthereumDocumentStoreStatus",
    status: "VALID",
    type: "DOCUMENT_STATUS",
  },
  {
    name: "OpenAttestationDidSignedDocumentStatus",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document was not signed by DID directly",
    },
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
  },
  {
    data: [
      {
        location: "example.openattestation.com",
        status: "VALID",
        value: "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
      },
    ],
    name: "OpenAttestationDnsTxtIdentityProof",
    status: "VALID",
    type: "ISSUER_IDENTITY",
  },
  {
    name: "OpenAttestationDnsDidIdentityProof",
    reason: {
      code: 0,
      codeString: "SKIPPED",
      message: "Document was not issued using DNS-DID",
    },
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
  },
  {
    data: {
      did: "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
      verified: true,
    },
    name: "OpenAttestationDidIdentityProof",
    status: "ERROR",
    reason: {
      code: 0,
      codeString: "OOPS",
      message: "Document was oopsed",
    },
    type: "ISSUER_IDENTITY",
  },
];

describe("getFragmentByName", () => {
  it("should return undefined when fragment does not exist", () => {
    expect(getFragmentByName("NOPE")(fragments)).toMatchInlineSnapshot(`undefined`);
  });
  it("should return OpenAttestationHash fragment", () => {
    expect(getOpenAttestationHashFragment(fragments)).toMatchInlineSnapshot(`
      Object {
        "data": true,
        "name": "OpenAttestationHash",
        "status": "VALID",
        "type": "DOCUMENT_INTEGRITY",
      }
    `);
  });
  it("should return OpenAttestationDnsTxtIdentityProof fragment", () => {
    expect(getOpenAttestationDnsTxtIdentityProofFragment(fragments)).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "location": "example.openattestation.com",
            "status": "VALID",
            "value": "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
          },
        ],
        "name": "OpenAttestationDnsTxtIdentityProof",
        "status": "VALID",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
  it("should return OpenAttestationDnsDidIdentityProof fragment", () => {
    expect(getOpenAttestationDnsDidIdentityProofFragment(fragments)).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationDnsDidIdentityProof",
        "reason": Object {
          "code": 0,
          "codeString": "SKIPPED",
          "message": "Document was not issued using DNS-DID",
        },
        "status": "SKIPPED",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
  it("should return OpenAttestationDidIdentityProof fragment", () => {
    expect(getOpenAttestationDidIdentityProofFragment(fragments)).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "did": "did:ethr:ropsten:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
          "verified": true,
        },
        "name": "OpenAttestationDidIdentityProof",
        "reason": Object {
          "code": 0,
          "codeString": "OOPS",
          "message": "Document was oopsed",
        },
        "status": "ERROR",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
  it("should return OpenAttestationDidSignedDocumentStatus fragment", () => {
    expect(getOpenAttestationDidSignedDocumentStatusFragment(fragments)).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationDidSignedDocumentStatus",
        "reason": Object {
          "code": 0,
          "codeString": "SKIPPED",
          "message": "Document was not signed by DID directly",
        },
        "status": "SKIPPED",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });
  it("should return OpenAttestationEthereumDocumentStoreStatus fragment", () => {
    expect(getOpenAttestationEthereumDocumentStoreStatusFragment(fragments)).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "details": Object {
            "issuance": Array [
              Object {
                "address": "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
                "issued": true,
              },
            ],
            "revocation": Array [
              Object {
                "address": "0x532C9Ff853CA54370D7492cD84040F9f8099f11B",
                "revoked": false,
              },
            ],
          },
          "issuedOnAll": true,
          "revokedOnAny": false,
        },
        "name": "OpenAttestationEthereumDocumentStoreStatus",
        "status": "VALID",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });
  it("should return OpenAttestationEthereumTokenRegistryStatus fragment", () => {
    expect(getOpenAttestationEthereumTokenRegistryStatusFragment(fragments)).toMatchInlineSnapshot(`
      Object {
        "name": "OpenAttestationEthereumTokenRegistryStatus",
        "reason": Object {
          "code": 4,
          "codeString": "SKIPPED",
          "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
        },
        "status": "SKIPPED",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });
});

describe("getFragmentsByType", () => {
  it("should return DOCUMENT_INTEGRITY fragments", () => {
    const documentIntegrityFragments = getDocumentIntegrityFragments(fragments);
    expect(documentIntegrityFragments.map((fragment) => fragment.name)).toMatchInlineSnapshot(`
      Array [
        "OpenAttestationHash",
      ]
    `);
  });
  it("should return DOCUMENT_STATUS fragments", () => {
    const documentStatusFragments = getDocumentStatusFragments(fragments);
    expect(documentStatusFragments.map((fragment) => fragment.name)).toMatchInlineSnapshot(`
      Array [
        "OpenAttestationEthereumTokenRegistryStatus",
        "OpenAttestationEthereumDocumentStoreStatus",
        "OpenAttestationDidSignedDocumentStatus",
      ]
    `);
  });
  it("should return ISSUER_IDENTITY fragments", () => {
    const issuerIdentityFragments = getIssuerIdentityFragments(fragments);
    expect(issuerIdentityFragments.map((fragment) => fragment.name)).toMatchInlineSnapshot(`
      Array [
        "OpenAttestationDnsTxtIdentityProof",
        "OpenAttestationDnsDidIdentityProof",
        "OpenAttestationDidIdentityProof",
      ]
    `);
  });
});
