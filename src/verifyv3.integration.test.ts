/**
 * @jest-environment node
 */

import verify from "./index";
import {
  documentRopstenValidWithDocumentStore,
  documentRopstenValidWithTokenRegistry
} from "../test/fixtures/v3/documentRopstenValid";
import { documentRopstenTampered } from "../test/fixtures/v3/documentRopstenTampered";
import { documentRopstenNotIssued } from "../test/fixtures/v3/documentRopstenNotIssued";
import { documentRopstenRevoked } from "../test/fixtures/v3/documentRopstenRevoked";

describe("verify v3(integration)", () => {
  it("returns false if document has been tampered", async () => {
    const results = await verify(documentRopstenTampered, "ropsten");

    expect(results).toEqual(
      expect.objectContaining({
        hash: { checksumMatch: false },
        issued: {
          issuedOnAll: true,
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            }
          ]
        },
        revoked: {
          revokedOnAny: false,
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false
            }
          ]
        },
        valid: false
      })
    );
  });
  it("returns false if document has not been issued", async () => {
    const results = await verify(documentRopstenNotIssued, "ropsten");

    expect(results).toEqual(
      expect.objectContaining({
        hash: { checksumMatch: true },
        issued: {
          issuedOnAll: false,
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: false
            }
          ]
        },
        revoked: {
          revokedOnAny: false,
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false
            }
          ]
        },
        valid: false
      })
    );
  });
  it("returns false if document has been revoked", async () => {
    const results = await verify(documentRopstenRevoked, "ropsten");

    expect(results).toEqual(
      expect.objectContaining({
        hash: { checksumMatch: true },
        issued: {
          issuedOnAll: true,
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            }
          ]
        },
        revoked: {
          revokedOnAny: true,
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: true
            }
          ]
        },
        valid: false
      })
    );
  });
  it("returns true if document is valid with document store", async () => {
    const results = await verify(
      documentRopstenValidWithDocumentStore,
      "ropsten"
    );

    expect(results).toEqual(
      expect.objectContaining({
        hash: { checksumMatch: true },
        issued: {
          issuedOnAll: true,
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              issued: true
            }
          ]
        },
        revoked: {
          revokedOnAny: false,
          details: [
            {
              address: "0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
              revoked: false
            }
          ]
        },
        valid: true
      })
    );
  });
  it("returns true if document is valid with token registry", async () => {
    const results = await verify(
      documentRopstenValidWithTokenRegistry,
      "ropsten"
    );

    expect(results).toEqual(
      expect.objectContaining({
        hash: { checksumMatch: true },
        issued: {
          issuedOnAll: true,
          details: [
            {
              address: "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
              issued: true
            }
          ]
        },
        revoked: {
          revokedOnAny: false,
          details: [
            {
              address: "0xb53499ee758352fAdDfCed863d9ac35C809E2F20",
              revoked: false
            }
          ]
        },
        valid: true
      })
    );
  });
});
