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
  generateProvider,
} from "./utils";
import { AllVerificationFragment } from "..";
import { ProviderDetails } from "../types/core";

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

describe("generateProvider", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {
      NETWORK: "",
      INFURA_API_KEY: "",
      ALCHEMY_API_KEY: "",
      ETHERSCAN_API_KEY: "",
    };
  });

  it("should use the details provided as top priority", () => {
    const options = {
      network: "ropsten",
      provider: "infura",
      apiKey: "bb46da3f80e040e8ab73c0a9ff365d18",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;

    expect(provider?._network?.name).toEqual("ropsten");
    expect(provider?.apiKey).toEqual("bb46da3f80e040e8ab73c0a9ff365d18");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should use the default values to generate the provider if user did not specify any provider details", () => {
    const provider = generateProvider() as any;
    expect(provider?._network?.name).toEqual("homestead");
    expect(provider?.apiKey).toEqual("bb46da3f80e040e8ab73c0a9ff365d18");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should use the default etherscan apiKey if no apiKey specified", () => {
    const options = {
      network: "ropsten",
      provider: "etherscan",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?.baseUrl).toMatch(/(etherscan)/i);
    expect(provider?.apiKey).toEqual("3TDJ85CXAA4NCTBMP3UE98UR48NC2XKVGG");
  });

  it("should use the default alchemy apiKey if no apiKey specified", () => {
    const options = {
      network: "ropsten",
      provider: "alchemy",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?.connection?.url).toMatch(/(alchemy)/i);
    expect(provider?.apiKey).toEqual("OlOgD-8qs5l3pQm-B_fcrMAmHTmAwkGj");
  });

  it("should use the default jsonrpc url which is localhost:8545", () => {
    const options = {
      network: "ropsten",
      provider: "jsonrpc",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?.connection?.url).toMatch(/(localhost:8545)/i);
  });

  it("should still generate a provider even if only one option (network) is provided", () => {
    const options = { network: "ropsten" } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("ropsten");
    expect(provider?.apiKey).toEqual("bb46da3f80e040e8ab73c0a9ff365d18");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should still generate a provider even if only one option (provider) is provided", () => {
    const options = { provider: "infura" } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("homestead");
    expect(provider?.apiKey).toEqual("bb46da3f80e040e8ab73c0a9ff365d18");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should still generate a provider even if only one option (url) is provided", () => {
    const options = { url: "www.123.com" } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?.connection?.url).toMatch(/(www.123.com)/i);
  });

  it("should throw an error and not generate a provider when only one option (apikey) is provided", () => {
    const options = { apiKey: "abc123" } as ProviderDetails;
    expect(() => {
      generateProvider(options);
    }).toThrowError(
      "We could link the apiKey provided to a provider, please state the provider to use in the parameter."
    );
  });

  it("should use the process.env values if there is one, should not use the default values, for infura test case", () => {
    process.env.NETWORK = "rinkeby";
    process.env.INFURA_API_KEY = "env123123";

    const provider = generateProvider() as any;
    expect(provider?._network?.name).toEqual("rinkeby");
    expect(provider?._network?.name).not.toEqual("mainnet");
    expect(provider?.apiKey).toEqual("env123123");
    expect(provider?.apiKey).not.toEqual("bb46da3f80e040e8ab73c0a9ff365d18");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should use the process.env values if there is one, should not use the default values, for etherscan test case", () => {
    process.env.NETWORK = "rinkeby";
    process.env.ETHERSCAN_API_KEY = "env456456";

    const options = {
      provider: "etherscan",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("rinkeby");
    expect(provider?._network?.name).not.toEqual("mainnet");
    expect(provider?.apiKey).toEqual("env456456");
    expect(provider?.apiKey).not.toEqual("3TDJ85CXAA4NCTBMP3UE98UR48NC2XKVGG");
    expect(provider?.baseUrl).toMatch(/(etherscan)/i);
  });

  it("should use the process.env values if there is one, should not use the default values, for alchemy test case", () => {
    process.env.NETWORK = "rinkeby";
    process.env.ALCHEMY_API_KEY = "env789789";

    const options = {
      provider: "alchemy",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("rinkeby");
    expect(provider?._network?.name).not.toEqual("mainnet");
    expect(provider?.apiKey).toEqual("env789789");
    expect(provider?.apiKey).not.toEqual("OlOgD-8qs5l3pQm-B_fcrMAmHTmAwkGj");
    expect(provider?.connection?.url).toMatch(/(alchemy)/i);
  });

  it("should override the process.env value with the function parameter value", () => {
    process.env.NETWORK = "rinkeby";
    process.env.ALCHEMY_API_KEY = "env789789";

    const options = { network: "ropsten", provider: "alchemy", apiKey: "abc123" } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("ropsten");
    expect(provider?._network?.name).not.toEqual("rinkeby");
    expect(provider?.apiKey).toEqual("abc123");
    expect(provider?.apiKey).not.toEqual("env789789");
    expect(provider?.connection?.url).toMatch(/(alchemy)/i);
  });
});
