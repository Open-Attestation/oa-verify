import { issuerIdentityVerifierBuilder } from "./builder";
import { OpenAttestationDnsTxt } from "./verifiers/dnsTxt/dnsTxt";
import { OpenAttestationDnsDid } from "./verifiers/dnsDid/dnsDid";
import { OpenAttestationDidSignedDidIdentityProof } from "./verifiers/did/did";

import { documentRopstenValidWithToken } from "../../../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenValidWithDocumentStore } from "../../../test/fixtures/v3/documentRopstenValid";
import { documentDidSigned } from "../../../test/fixtures/v2/documentDidSigned";
import { documentDnsDidNoDnsTxt } from "../../../test/fixtures/v2/documentDnsDidNoDnsTxt";
import { documentDnsDidSigned } from "../../../test/fixtures/v2/documentDnsDidSigned";
import {
  documentDnsDidMixedTokenRegistryValid,
  documentDnsDidMixedTokenRegistryInvalid,
} from "../../../test/fixtures/v2/documentDnsDidMixedTokenRegistry";

const verifier = issuerIdentityVerifierBuilder([
  OpenAttestationDnsTxt,
  OpenAttestationDnsDid,
  OpenAttestationDidSignedDidIdentityProof,
]);

it("works for v2", async () => {
  const results = await verifier.verify(documentRopstenValidWithToken, { network: "ropsten" });
  expect(results).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "data": Object {
            "smartContractAddress": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
          },
          "identifier": "example.tradetrust.io",
          "status": "VALID",
          "verifier": "OpenAttestationDnsTxtIdentityProof",
        },
      ],
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "VALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});

it("works for v3", async () => {
  const results = await verifier.verify(
    {
      ...documentRopstenValidWithDocumentStore,
      data: {
        ...documentRopstenValidWithDocumentStore.data,
        issuer: {
          ...documentRopstenValidWithDocumentStore.data.issuer,
          identityProof: {
            ...documentRopstenValidWithDocumentStore.data.issuer.identityProof,
            location: "1d337929-6770-4a05-ace0-1f07c25c7615:string:example.openattestation.com",
          },
        },
      },
    },
    { network: "ropsten" }
  );
  expect(results).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "data": Object {
          "smartContractAddress": "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        },
        "identifier": "example.openattestation.com",
        "status": "VALID",
        "verifier": "OpenAttestationDnsTxtIdentityProof",
      },
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "VALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});

it("works", async () => {
  const results = await verifier.verify(documentDidSigned, { network: "ropsten" });
  expect(results).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "identifier": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
          "status": "VALID",
          "verifier": "OpenAttestationDidIdentityProof",
        },
      ],
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "VALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});

it("works", async () => {
  const results = await verifier.verify(documentDnsDidNoDnsTxt, { network: "ropsten" });
  expect(results).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "data": Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          },
          "identifier": "example.com",
          "status": "INVALID",
          "verifier": "OpenAttestationDnsDidIdentityProof",
        },
      ],
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "INVALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});

it("works", async () => {
  const results = await verifier.verify(documentDnsDidSigned, { network: "ropsten" });
  expect(results).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "data": Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          },
          "identifier": "example.tradetrust.io",
          "status": "VALID",
          "verifier": "OpenAttestationDnsDidIdentityProof",
        },
      ],
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "VALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});

it("works", async () => {
  const results = await verifier.verify(documentDnsDidMixedTokenRegistryValid, { network: "ropsten" });
  expect(results).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "data": Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          },
          "identifier": "example.tradetrust.io",
          "status": "VALID",
          "verifier": "OpenAttestationDnsDidIdentityProof",
        },
        Object {
          "data": Object {
            "smartContractAddress": "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
          },
          "identifier": "tradetrust.io",
          "status": "INVALID",
          "verifier": "OpenAttestationDnsTxtIdentityProof",
        },
      ],
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "INVALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});

it("works", async () => {
  const results = await verifier.verify(documentDnsDidMixedTokenRegistryInvalid, { network: "ropsten" });
  expect(results).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "data": Object {
            "key": "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
          },
          "identifier": "example.com",
          "status": "INVALID",
          "verifier": "OpenAttestationDnsDidIdentityProof",
        },
        Object {
          "data": Object {
            "smartContractAddress": "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
          },
          "identifier": "tradetrust.io",
          "status": "INVALID",
          "verifier": "OpenAttestationDnsTxtIdentityProof",
        },
      ],
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "INVALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});
