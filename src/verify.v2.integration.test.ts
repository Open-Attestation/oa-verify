/**
 * @jest-environment node
 */

import { isValid, verify } from "./index";
import { documentMainnetValidWithCertificateStore } from "../test/fixtures/v2/documentMainnetValidWithCertificateStore";
import {
  tamperedDocumentWithCertificateStore,
  tamperedDocumentWithInvalidCertificateStore
} from "../test/fixtures/v2/tamperedDocument";
import { documentRopstenValidWithCertificateStore } from "../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenValidWithToken } from "../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenRevokedWithToken } from "../test/fixtures/v2/documentRopstenRevokedWithToken";

describe("verify(integration)", () => {
  it("should fail for everything when document's hash is invalid and certificate store is invalid", async () => {
    const results = await verify(tamperedDocumentWithCertificateStore, {
      network: "ropsten"
    });

    expect(results).toStrictEqual([
      {
        data: false,
        reason: {
          code: 0,
          codeString: "DOCUMENT_TAMPERED",
          message: "Certificate has been tampered with"
        },
        status: "INVALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: [
            {
              address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
              reason: {
                code: 3,
                codeString: "ETHERS_UNHANDLED_ERROR",
                message: "Error with smart contract 0x20bc9C354A18C8178A713B9BcCFFaC2152b53990: call exception"
              },
              issued: false
            }
          ],
          issuedOnAll: false
        },
        reason: {
          code: 3,
          codeString: "ETHERS_UNHANDLED_ERROR",
          message: "Error with smart contract 0x20bc9C354A18C8178A713B9BcCFFaC2152b53990: call exception"
        },
        status: "INVALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: [
            {
              address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
              revoked: false
            }
          ],
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`
        },
        status: "SKIPPED",
        name: "OpenAttestationDnsTxt",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
  });

  it("should fail for OpenAttestationHash and OpenAttestationEthereumDocumentStoreIssued when document's hash is invalid and was not issued", async () => {
    const results = await verify(tamperedDocumentWithInvalidCertificateStore, {
      network: "ropsten"
    });

    expect(results).toStrictEqual([
      {
        data: false,
        reason: {
          code: 0,
          codeString: "DOCUMENT_TAMPERED",
          message: "Certificate has been tampered with"
        },
        status: "INVALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: [
            {
              address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53991",
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address 0x20bc9C354A18C8178A713B9BcCFFaC2152b53991 is invalid"
              },
              issued: false
            }
          ],
          issuedOnAll: false
        },
        reason: {
          code: 2,
          codeString: "CONTRACT_ADDRESS_INVALID",
          message: "Contract address 0x20bc9C354A18C8178A713B9BcCFFaC2152b53991 is invalid"
        },
        status: "INVALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: [
            {
              address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53991",
              reason: {
                code: 2,
                codeString: "CONTRACT_ADDRESS_INVALID",
                message: "Contract address 0x20bc9C354A18C8178A713B9BcCFFaC2152b53991 is invalid"
              },
              revoked: true
            }
          ],
          revokedOnAny: true
        },
        reason: {
          code: 2,
          codeString: "CONTRACT_ADDRESS_INVALID",
          message: "Contract address 0x20bc9C354A18C8178A713B9BcCFFaC2152b53991 is invalid"
        },
        status: "INVALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`
        },
        status: "SKIPPED",
        name: "OpenAttestationDnsTxt",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
  });

  it("should be valid for all checks when document with certificate store is valid on mainnet", async () => {
    const results = await verify(documentMainnetValidWithCertificateStore, {
      network: "homestead"
    });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: [
            {
              address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
              issued: true
            }
          ],
          issuedOnAll: true
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: [
            {
              address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
              revoked: false
            }
          ],
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`
        },
        status: "SKIPPED",
        name: "OpenAttestationDnsTxt",
        type: "ISSUER_IDENTITY"
      }
    ]);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should be valid for all checks when document with certificate store is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithCertificateStore, {
      network: "ropsten"
    });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            }
          ],
          issuedOnAll: true
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method'
        },
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false
            }
          ],
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 2,
          codeString: "SKIPPED",
          message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`
        },
        status: "SKIPPED",
        name: "OpenAttestationDnsTxt",
        type: "ISSUER_IDENTITY"
      }
    ]);
    // it's not valid on ISSUER_IDENTITY (skipped) so making sure the rest is valid
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(true);
  });

  it("should be valid for all checks when document with token registry is valid on ropsten", async () => {
    const results = await verify(documentRopstenValidWithToken, {
      network: "ropsten"
    });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message:
            'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method'
        },
        name: "OpenAttestationEthereumDocumentStoreIssued",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: [
            {
              address: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
              minted: true
            }
          ],
          mintedOnAll: true
        },
        status: "VALID",
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message:
            'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method'
        },
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: [
          {
            location: "example.tradetrust.io",
            status: "VALID",
            value: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
          }
        ],
        status: "VALID",
        name: "OpenAttestationDnsTxt",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(results)).toStrictEqual(true);
  });

  it("should fail for OpenAttestationEthereumTokenRegistryMinted when document with token registry was not issued ", async () => {
    const results = await verify(documentRopstenRevokedWithToken, {
      network: "ropsten"
    });

    expect(results).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message:
            'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method'
        },
        name: "OpenAttestationEthereumDocumentStoreIssued",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: [
            {
              address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
              reason: {
                code: 1,
                codeString: "DOCUMENT_NOT_MINTED",
                message:
                  "Certificate 0x1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef has not been issued under contract 0x48399Fb88bcD031C556F53e93F690EEC07963Af3"
              },
              minted: false
            }
          ],
          mintedOnAll: false
        },
        reason: {
          code: 1,
          codeString: "DOCUMENT_NOT_MINTED",
          message:
            "Certificate 0x1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef has not been issued under contract 0x48399Fb88bcD031C556F53e93F690EEC07963Af3"
        },
        status: "INVALID",
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS"
      },
      {
        reason: {
          code: 4,
          codeString: "SKIPPED",
          message:
            'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method'
        },
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: [
          {
            location: "tradetrust.io",
            status: "VALID",
            value: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3"
          }
        ],
        status: "VALID",
        name: "OpenAttestationDnsTxt",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(results)).toStrictEqual(false);
    expect(isValid(results, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"])).toStrictEqual(false);
  });
});
