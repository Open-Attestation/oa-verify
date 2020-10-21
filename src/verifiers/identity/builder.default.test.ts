import { issuerIdentityVerifierBuilder, IssuerIdentityVerifier, IssuerIdentityVerifierDefinition } from "./builder";
import dnsTxtVerifier from "./verifiers/dnsTxt/dnsTxt";

import { documentRopstenValidWithToken } from "../../../test/fixtures/v2/documentRopstenValidWithToken";
import { documentRopstenValidWithDocumentStore } from "../../../test/fixtures/v3/documentRopstenValid";

it("works for v2", async () => {
  const verifier = issuerIdentityVerifierBuilder([dnsTxtVerifier]);
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
          "verifier": "OpenAttestationDnsTxt",
        },
      ],
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "VALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});

it("works for v3", async () => {
  const verifier = issuerIdentityVerifierBuilder([dnsTxtVerifier]);
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
        "verifier": "OpenAttestationDnsTxt",
      },
      "name": "OpenAttestationIssuerIdentityVerifier",
      "status": "VALID",
      "type": "ISSUER_IDENTITY",
    }
  `);
});
