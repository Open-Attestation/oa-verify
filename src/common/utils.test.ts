import { AllVerificationFragment } from "..";
import { InvalidVerificationFragment, ProviderDetails } from "../types/core";
import {
  certificateNotIssued,
  certificateRevoked,
  contractNotFound,
  generateProvider,
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
  invalidArgument,
  isDocumentStoreAddressOrTokenRegistryAddressInvalid,
  serverError,
  unhandledError,
} from "./utils";

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
      did: "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
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
          "did": "did:ethr:goerli:0x0cE1854a3836daF9130028Cf90D6d35B1Ae46457",
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
      PROVIDER_NETWORK: "",
      PROVIDER_API_KEY: "",
      PROVIDER_ENDPOINT_TYPE: "",
      PROVIDER_ENDPOINT_URL: "",
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.spyOn(console, "warn").mockRestore();
  });

  it("should use the details provided as top priority", () => {
    const options = {
      network: "goerli",
      providerType: "infura",
      apiKey: "bb46da3f80e040e8ab73c0a9ff365d18",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;

    expect(provider?._network?.name).toEqual("goerli");
    expect(provider?.apiKey).toEqual("bb46da3f80e040e8ab73c0a9ff365d18");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should use the default values to generate the provider if user did not specify any provider details", () => {
    const provider = generateProvider() as any;
    expect(provider?._network?.name).toEqual("homestead");
    expect(provider?.apiKey).toEqual("84842078b09946638c03157f83405213");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should use the default alchemy apiKey if no apiKey specified", () => {
    const options = {
      network: "goerli",
      providerType: "alchemy",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?.connection?.url).toMatch(/(alchemy)/i);
    expect(provider?.apiKey).toEqual("_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC");
  });

  it("should use the default jsonrpc url which is localhost:8545", () => {
    const options = {
      network: "goerli",
      providerType: "jsonrpc",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?.connection?.url).toMatch(/(localhost:8545)/i);
  });

  it("should still generate a provider even if only one option (network) is provided", () => {
    const options = { network: "goerli" } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("goerli");
    expect(provider?.apiKey).toEqual("84842078b09946638c03157f83405213");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should still generate a provider even if only one option (provider) is provided", () => {
    const options = { providerType: "infura" } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("homestead");
    expect(provider?.apiKey).toEqual("84842078b09946638c03157f83405213");
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
      "We could not link the apiKey provided to a provider, please state the provider to use in the parameter."
    );
  });

  it("should throw an error when if process.env is using the wrong value for PROVIDER", () => {
    process.env.PROVIDER_ENDPOINT_TYPE = "ABC";
    expect(() => generateProvider()).toThrowError(
      "The provider provided is not on the list of providers. Please use one of the following: infura, alchemy or jsonrpc."
    );
  });

  it("should use the process.env values if there is one, should not use the default values, for infura test case", () => {
    process.env.PROVIDER_NETWORK = "goerli";
    process.env.PROVIDER_API_KEY = "env123123";

    const provider = generateProvider() as any;
    expect(provider?._network?.name).toEqual("goerli");
    expect(provider?._network?.name).not.toEqual("mainnet");
    expect(provider?.apiKey).toEqual("env123123");
    expect(provider?.apiKey).not.toEqual("bb46da3f80e040e8ab73c0a9ff365d18");
    expect(provider?.connection?.url).toMatch(/(infura)/i);
  });

  it("should use the process.env values if there is one, should not use the default values, for alchemy test case", () => {
    process.env.PROVIDER_NETWORK = "goerli";
    process.env.PROVIDER_API_KEY = "env789789";

    const options = {
      providerType: "alchemy",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("goerli");
    expect(provider?._network?.name).not.toEqual("mainnet");
    expect(provider?.apiKey).toEqual("env789789");
    expect(provider?.apiKey).not.toEqual("OlOgD-8qs5l3pQm-B_fcrMAmHTmAwkGj");
    expect(provider?.connection?.url).toMatch(/(alchemy)/i);
  });

  it("should use the process.env values if there is one, should not use the default values, for Json RPC test case", () => {
    process.env.PROVIDER_ENDPOINT_URL = "www.1234.com";

    const options = {
      providerType: "jsonrpc",
    } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?.connection?.url).toMatch(/(www.1234.com)/i);
  });

  it("should override the process.env value with the function parameter value", () => {
    process.env.PROVIDER_NETWORK = "sepolia";
    process.env.PROVIDER_API_KEY = "env789789";

    const options = { network: "goerli", providerType: "alchemy", apiKey: "abc123" } as ProviderDetails;
    const provider = generateProvider(options) as any;
    expect(provider?._network?.name).toEqual("goerli");
    expect(provider?._network?.name).not.toEqual("sepolia");
    expect(provider?.apiKey).toEqual("abc123");
    expect(provider?.apiKey).not.toEqual("env789789");
    expect(provider?.connection?.url).toMatch(/(alchemy)/i);
  });
});

describe("isDocumentStoreAddressOrTokenRegistryAddressInvalid", () => {
  it("should return true if document store address is invalid", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 1,
        codeString: "1",
        message: "Invalid document store address",
      },
    };
    expect(isDocumentStoreAddressOrTokenRegistryAddressInvalid([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if document store address is valid", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 2,
        codeString: "2",
        message: "some other error",
      },
    };
    expect(isDocumentStoreAddressOrTokenRegistryAddressInvalid([verificationFragment])).toStrictEqual(false);
  });
  it("should return true if token registry address is invalid", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 1,
        codeString: "1",
        message: "Invalid token registry address",
      },
    };
    expect(isDocumentStoreAddressOrTokenRegistryAddressInvalid([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if token registry address is valid", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 2,
        codeString: "2",
        message: "some other error",
      },
    };
    expect(isDocumentStoreAddressOrTokenRegistryAddressInvalid([verificationFragment])).toStrictEqual(false);
  });
});

describe("contractNotFound", () => {
  it("should return true if contract is not found in document store", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 1,
        codeString: "1",
        message: "Contract is not found",
      },
    };
    expect(contractNotFound([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if contract is found in document store", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 2,
        codeString: "2",
        message: "some other error",
      },
    };
    expect(contractNotFound([verificationFragment])).toStrictEqual(false);
  });
});

describe("certificateNotIssued", () => {
  it("should return true if document not issued in document store", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 1,
        codeString: "1",
        message: "Contract is not found",
      },
    };
    expect(certificateNotIssued([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if document is issued in document store", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 2,
        codeString: "2",
        message: "Some Error",
      },
    };
    expect(certificateNotIssued([verificationFragment])).toStrictEqual(false);
  });
  it("should return true if document not minted in token registry", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 1,
        codeString: "1",
        message: "Invalid token registry address",
      },
    };
    expect(isDocumentStoreAddressOrTokenRegistryAddressInvalid([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if document is minted in token registry", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 2,
        codeString: "2",
        message: "Some error",
      },
    };
    expect(isDocumentStoreAddressOrTokenRegistryAddressInvalid([verificationFragment])).toStrictEqual(false);
  });
});

describe("certificateRevoked", () => {
  it("should return true if error reason is that document is revoked in document store", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 5,
        codeString: "5",
        message: "Document has been revoked",
      },
    };
    expect(certificateRevoked([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if error reason is that document is not revoked in document store", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 3,
        codeString: "3",
        message: "Some error, Document not revoked",
      },
    };
    expect(certificateRevoked([verificationFragment])).toStrictEqual(false);
  });
});

describe("invalidArgument", () => {
  it("should return true if error is caused by an invalid merkle root in document store issued fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 1,
        codeString: "1",
        message: "Invalid call arguments",
      },
    };
    expect(invalidArgument([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if error is caused by an invalid merkle root in document store issued fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 3,
        codeString: "3",
        message: "Some other error",
      },
    };
    expect(invalidArgument([verificationFragment])).toStrictEqual(false);
  });
  it("should return true if error is not caused by an invalid merkle root in token registry issued fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 6,
        codeString: "6",
        message: "Invalid contract arguments",
      },
    };
    expect(invalidArgument([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if error is not caused by an invalid merkle root in token registry issued fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 2,
        codeString: "2",
        message: "Some other error",
      },
    };
    expect(invalidArgument([verificationFragment])).toStrictEqual(false);
  });
});

describe("serverError", () => {
  it("should return true of the reason of the error is that we can't connect to Ethereum for document store issued fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 500,
        codeString: "500",
        message: "Server error",
      },
    };
    expect(serverError([verificationFragment])).toStrictEqual(true);
  });
  it("should return true of the reason of the error is that we can't connect to Ethereum for token registry minted fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 500,
        codeString: "500",
        message: "Server error",
      },
    };
    expect(serverError([verificationFragment])).toStrictEqual(true);
  });
  it("should return false of the reason of the error is not that we can't connect to Ethereum for document store issued fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 3,
        codeString: "3",
        message: "Some other error",
      },
    };
    expect(serverError([verificationFragment])).toStrictEqual(false);
  });
  it("should return false of the reason of the error is not that we can't connect to Ethereum for token registry minted fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 5,
        codeString: "5",
        message: "Some other error",
      },
    };
    expect(serverError([verificationFragment])).toStrictEqual(false);
  });
});

describe("unhandledError", () => {
  it("should return true if there are some unhandled errors from document store issued fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 3,
        codeString: "3",
        message: "Some unhandled error",
      },
    };
    expect(unhandledError([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if not some unhandled errors from document store issued fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumDocumentStoreStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 1,
        codeString: "1",
        message: "Some other error",
      },
    };
    expect(unhandledError([verificationFragment])).toStrictEqual(false);
  });
  it("should return true if there are some unhandled errors from token registry minted fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 3,
        codeString: "3",
        message: "Some unhandled error",
      },
    };
    expect(unhandledError([verificationFragment])).toStrictEqual(true);
  });
  it("should return false if not some unhandled errors from token registry minted fragment", () => {
    const verificationFragment: InvalidVerificationFragment<any> = {
      status: "INVALID",
      name: "OpenAttestationEthereumTokenRegistryStatus",
      type: "DOCUMENT_STATUS",
      data: {},
      reason: {
        code: 5,
        codeString: "5",
        message: "Some other error",
      },
    };
    expect(unhandledError([verificationFragment])).toStrictEqual(false);
  });
});
