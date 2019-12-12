/**
 * @jest-environment node
 */

import { isValid, verify } from "./index";
import { documentMainnetValidWithCertificateStore } from "../test/fixtures/v2/documentMainnetValidWithCertificateStore";
import { tamperedDocumentWithCertificateStore } from "../test/fixtures/v2/tamperedDocument";
import { documentRopstenValidWithCertificateStore } from "../test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { documentRopstenValidWithToken } from "../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenRevokedWithToken } from "../test/fixtures/v2/documentRopstenRevokedWithToken";

describe("verify(integration)", () => {
  it("should fail for OpenAttestationHash and OpenAttestationEthereumDocumentStoreIssued when document's hash is invalid and was not issued", async () => {
    const results = await verify(tamperedDocumentWithCertificateStore, {
      network: "ropsten"
    });

    expect(results).toStrictEqual([
      {
        data: false,
        message: "Certificate has been tampered with",
        status: "INVALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: [
            {
              address: "0x20bc9C354A18C8178A713B9BcCFFaC2152b53990",
              error:
                'call exception (address="0x20bc9C354A18C8178A713B9BcCFFaC2152b53990", method="isIssued(bytes32)", args=["0x85df2b4e905a82cf10c317df8f4b659b5cf38cc12bd5fbaffba5fc901ef0011b"], version=4.0.40)',
              issued: false
            }
          ],
          issuedOnAll: false
        },
        message: "Certificate has not been issued",
        status: "INVALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
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
        message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`,
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
        message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
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
        message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`,
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
        message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
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
        message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`,
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
        message:
          'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
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
        message:
          'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: [
          {
            dns: "example.tradetrust.io",
            identified: true,
            smartContract: "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
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
        message:
          'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
        name: "OpenAttestationEthereumDocumentStoreIssued",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: [
            {
              address: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
              error:
                'call revert exception (address="0x48399Fb88bcD031C556F53e93F690EEC07963Af3", args=["0x1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef"], method="ownerOf(uint256)", errorSignature="Error(string)", errorArgs=[["ERC721: owner query for nonexistent token"]], reason=["ERC721: owner query for nonexistent token"], transaction={"to":{},"data":"0x6352211e1e63c39cdd668da652484fd781f8c0812caadad0f6ebf71bf68bf3670242d1ef"}, version=4.0.40)',
              minted: false
            }
          ],
          mintedOnAll: false
        },
        message: "Certificate has not been minted",
        status: "INVALID",
        name: "OpenAttestationEthereumTokenRegistryMinted",
        type: "DOCUMENT_STATUS"
      },
      {
        message:
          'Document issuers doesn\'t have "documentStore" or "certificateStore" property or DOCUMENT_STORE method',
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: [
          {
            dns: "tradetrust.io",
            identified: true,
            smartContract: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3"
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
