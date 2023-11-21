import { v3, WrappedDocument } from "@tradetrust-tt/tradetrust";
import { document } from "../../../../test/fixtures/v2/document";
import { tamperedDocument } from "../../../../test/fixtures/v2/tamperedDocument";
import sampleWrappedV3 from "../../../../test/fixtures/v3/did-wrapped.json";
import { verificationBuilder } from "../../verificationBuilder";
import { openAttestationHash } from "./openAttestationHash";

const validV3Document = sampleWrappedV3 as WrappedDocument<v3.OpenAttestationDocument>;

const verify = verificationBuilder([openAttestationHash], { network: "goerli" });

describe("OpenAttestationHash", () => {
  describe("v2", () => {
    it("should return a skipped fragment when document is missing target hash", async () => {
      const newDocument = {
        ...tamperedDocument,
        signature: { ...tamperedDocument.signature },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error I really want to delete this :)
      delete newDocument.signature.targetHash;
      const fragment = await verify(newDocument);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message: "Document does not have merkle root, target hash or data.",
          },
          status: "SKIPPED",
        },
      ]);
    });
    it("should return a skipped fragment when document is missing merkle root", async () => {
      const newDocument = {
        ...tamperedDocument,
        signature: { ...tamperedDocument.signature },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error I really want to delete this :)
      delete newDocument.signature.merkleRoot;
      const fragment = await verify(newDocument);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message: "Document does not have merkle root, target hash or data.",
          },
          status: "SKIPPED",
        },
      ]);
    });
    it("should return a skipped fragment when document is missing data", async () => {
      const newDocument = {
        ...tamperedDocument,
        data: { ...tamperedDocument.data },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error I really want to delete this :)
      delete newDocument.data;
      const fragment = await verify(newDocument);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message: "Document does not have merkle root, target hash or data.",
          },
          status: "SKIPPED",
        },
      ]);
    });
    it("should return an invalid fragment when document has been tampered", async () => {
      const fragment = await verify(tamperedDocument);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          data: false,
          reason: {
            code: 0,
            codeString: "DOCUMENT_TAMPERED",
            message: "Document has been tampered with",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should return a valid fragment when document has not been tampered", async () => {
      const fragment = await verify(document);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          data: true,
          status: "VALID",
        },
      ]);
    });
  });
  describe("v3", () => {
    it("should return valid fragment for correctly wrapped file", async () => {
      const fragment = await verify(validV3Document);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          data: true,
          status: "VALID",
        },
      ]);
    });
    it("should return invalid fragment for integrity check when document has been tampered", async () => {
      const tamperedDocument = {
        ...validV3Document,
        issuer: {
          id: "https://example.com",
          name: "DEMO STORES",
        },
      };
      const fragment = await verify(tamperedDocument);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          data: false,
          reason: {
            code: 0,
            codeString: "DOCUMENT_TAMPERED",
            message: "Document has been tampered with",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should skip if the merkle root is missing", async () => {
      const tamperedDocument = {
        ...validV3Document,
        proof: {
          type: "OpenAttestationMerkleProofSignature2018",
          proofPurpose: "assertionMethod",
          targetHash: "cb994c76a17f54bb6cd1d3a9292b7918a481317d3c2435b6df78db04c10a74ba",
          proofs: [],
          salts:
            "W3sidmFsdWUiOiIxZDVlMmRhMjNkNDk4MmI5NGVjMTZmMzgwZWI5NmNiMDVlMDQ2ZWQ0NjVmNzk4ZGM2ZGMwYWE4NDJjMDYxZjUwIiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiYTA0MWRjMzkzNTc1NWI4MzQwODA5ZmMwMmQyY2QzNDRkMDA4MzQxZjRhNWNmNmFiMWZjMGJkMGIzYmEzN2E0ZiIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiIyZTMxOWQ5Mjk2YjczMzFjMjU1ODgxZGY0MmNhYWQ4ZjRmODNmNGIzOTEwZTQzZDFkZDAxNzNiZGQxNmZiNGE0IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjkyMDI5NWY2YTY0YmViMjRkMGQ5MzcwYzRiMWYxNzQwYmZmYWQwZWRjNjQxZWRmNjIzODM4NGJkZmE5NDdhNWEiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiNDJjMTNhYjRkNjBkNDBkMzI5OTE5MmMzZmFlZDBmMDdjNzJlNWRiNDljZGU3ZDJjYzM5ZmRiNjBjYTgxNGMxYiIsInBhdGgiOiJAY29udGV4dFszXSJ9LHsidmFsdWUiOiIwNDE1ZDEwYmIyNTNmMGYzZjY2MWYwN2YwNzI5ZGJiYjcyYjQ1MTIwYWNmNjEwYjM1YWIyZTYwYjdmMjU4YjNhIiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI5NDhlZGE5YzU3YWYwNTZlMTc2YmVjODE2YTAzNjJmZjVmYWVjMjkwYTJiM2U4MzY2MzcwMzk4ZWE4MWFjOTVjIiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiMWZkYWZlZTNkMTdjOGViM2NmMzcwYmRjNDVkNTdiY2IyZTdjNjQ4M2Y3MGU0NmFmNGEyODk5OWUyMDM5NmFkMiIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiNmQ4ZGFiZjdiNGQ4YTI4NDhkYWY2NzcxNTA5MDE1NWQwODg3MjUzZjE1N2MwOGFhMjY2MmY3YzUwNjBlNWVkMyIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiZTkxZWE0ZjJiNjBkZDJmNjg0MjRhY2I1MTcxY2UxMTFkYzEzZDRmNTY2MWIzZGExYjA5ODBiZjg1ZWM2MGU1ZSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMzIzZWFlMjFlMmU2NTE3MzY3YmZjZDE4NTkwMDE2YzY4NzM0ZGZlZDBhYzRjNzExY2E4MjQwYTg1NDkxN2MzZiIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiI5NjdlNzkxNTJlYzQwZDg3YjBkNzYxNzYyZjllODJlMzE4YzM4MzA4Nzk3NWQ3NjA3YjE0NGM0Zjg3NDY0MTkyIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiNTFkY2IxODk4YmRkZmVkZjA0ZTVlODM5Y2JlN2RlZGQ3NTkxNWIyNmEwZTAwZjUzNTU2NzdhZTZjMzRkNTg0MiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjNhNDFjMjY5MzQ2ZmQ1N2IyMGY1YmZkOTM3MmM1MTMwYTNmNThjZDU2NDA4NzczNTI5MjFmZGEyMTQzMmYzMmUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMzE2NWJmOGJkNDFkNmZiMTA0NDg2MTI0ODIxYzExZDdhNjQ3NDAwYjliZjE5YWExMTEyMTA5YWQyODA5NjdhNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1swXS50eXBlIn0seyJ2YWx1ZSI6IjQzZjNkYTYzZjdkOGQyZjAwNDMzMDEwNTRlZjY4Njk0MjU3MTZiMjIzMWM2OTY3M2FlZDY5NzBlMWVmOWRlNDAiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJkMmM2N2RjNDliZGEyNWNiZWMwOWE3ZmJjMzI3ZGM4NTRhMzkzYzliNGY1ZTg1MWYxM2U1YzFmN2M2MjEzOWNjIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmNsYXNzWzFdLnR5cGUifSx7InZhbHVlIjoiMTUzYWJhZjM3Zjk5YTBkNThhYWQxOTlhOTBjOGJjMTA2MmQ5MTRlNDliMzdmMjJhMzA2YmIyZGEzNTY1YzFmMiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1sxXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjI4NWIxM2RjNzA5MjY0ZWZkMzVhMGM5YTQ0MTcwMWI4MjBhNTQ1ZDVjOWQyNmMxNjAxOGQ2MDkyNzE1NDU5MmUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiI4YjM4ZWEzYWU1OTJiNDU4ZmU0MTg5NTg1MTNkNGJiZmNmMTEyYTBiMjM1NTNmNTFmODhlOGNhNjIxZjhlNWFiIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiZmI5OGUxN2FiMmFkYjFiZTAwYzE2ZGIzZTYwZTYyN2QyMDAxYzc3NjU2YTkwNTUwOGNiZmI3YTg4YzhjZDBkOSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiN2M5MWNjOWJhMGNiNWExODc0MzcyMWRiMWJiOWJiOTJlYmJjMzQwZTk1YmNiN2RlN2NkNjJiODAyNjAyNGNiMyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6ImIyODlmNzgxMDZkZDI2YzJjODJjZDViMGUxMmYxMmRhY2JhM2RkZjViYWFiYzEyZGZjNDU4MTA1OWI1YjUzMDIiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6Ijg3Nzk3YTYxYjBkMzUwYTMwYmNlNWUwNzJmNjJiN2Q3MmYyYWMyNWVlMzJjZWU5OTA4MDBkODE4ZTQ5NDgyODQiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiMDI4ZWNhZmU5M2UwNzNlOWJiNDViODVjZGZlMDc0ODQ3Yjk2ZWZiYzA1OGUzNzAwOWM3NzU0NzE4ZDMyNjRlZiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi5yZXZvY2F0aW9uLnR5cGUifSx7InZhbHVlIjoiMjAwYjA5MmYzNTlhM2MxYTE3NDYwMWY1MTgzY2JjZDk4MjE1OWRlYTY2NWNhYzgxZWRmZjE5ODkxNWY4NzQwYyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiNDNlOWNiMjU3OTIzYTQ2NDE3ODI1NTdmNjA4NWQ3NzkxZGYzOGYxOWE0NzA5MTE3ZmNlYjM1M2Y0NGFjMzBjZiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImY2N2IxYjdjNmI2YWM5NWE3Yzk1NmM3NzcwYjU4MTczMDlmNzA2MzE5MDBhZjYxNzFkNjllZmM2MmM1OTFjMjYiLCJwYXRoIjoiYXR0YWNobWVudHNbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiYmNjYzU1YjJjOWM4NmI4ODhhMTc0NDExMjk2MjljNzAzMDNkYTRjMzgwOTc2Njg1NzQ0M2RhOTFhMGY1NmRhNCIsInBhdGgiOiJhdHRhY2htZW50c1swXS5taW1lVHlwZSJ9LHsidmFsdWUiOiJlZmUwZjIyNjUyOWVjNTZhY2MyYzZhNzZiMTdmMjc3YmY3YjVjOWMwY2ZmMDMxNzA2YzUzODg2MTVkMzQ3Y2E4IiwicGF0aCI6ImF0dGFjaG1lbnRzWzBdLmRhdGEifV0=",
          privacy: {
            obfuscated: [],
          },
        },
      };
      const fragment = await verify(tamperedDocument as any);
      expect(fragment[0].status).toBe("SKIPPED");
    });
    it("should fail if the merkle root is empty", async () => {
      const tamperedDocument = {
        ...validV3Document,
        proof: {
          type: "OpenAttestationMerkleProofSignature2018",
          proofPurpose: "assertionMethod",
          targetHash: "cb994c76a17f54bb6cd1d3a9292b7918a481317d3c2435b6df78db04c10a74ba",
          proofs: [],
          merkleRoot: "",
          salts:
            "W3sidmFsdWUiOiIxZDVlMmRhMjNkNDk4MmI5NGVjMTZmMzgwZWI5NmNiMDVlMDQ2ZWQ0NjVmNzk4ZGM2ZGMwYWE4NDJjMDYxZjUwIiwicGF0aCI6InZlcnNpb24ifSx7InZhbHVlIjoiYTA0MWRjMzkzNTc1NWI4MzQwODA5ZmMwMmQyY2QzNDRkMDA4MzQxZjRhNWNmNmFiMWZjMGJkMGIzYmEzN2E0ZiIsInBhdGgiOiJAY29udGV4dFswXSJ9LHsidmFsdWUiOiIyZTMxOWQ5Mjk2YjczMzFjMjU1ODgxZGY0MmNhYWQ4ZjRmODNmNGIzOTEwZTQzZDFkZDAxNzNiZGQxNmZiNGE0IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjkyMDI5NWY2YTY0YmViMjRkMGQ5MzcwYzRiMWYxNzQwYmZmYWQwZWRjNjQxZWRmNjIzODM4NGJkZmE5NDdhNWEiLCJwYXRoIjoiQGNvbnRleHRbMl0ifSx7InZhbHVlIjoiNDJjMTNhYjRkNjBkNDBkMzI5OTE5MmMzZmFlZDBmMDdjNzJlNWRiNDljZGU3ZDJjYzM5ZmRiNjBjYTgxNGMxYiIsInBhdGgiOiJAY29udGV4dFszXSJ9LHsidmFsdWUiOiIwNDE1ZDEwYmIyNTNmMGYzZjY2MWYwN2YwNzI5ZGJiYjcyYjQ1MTIwYWNmNjEwYjM1YWIyZTYwYjdmMjU4YjNhIiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI5NDhlZGE5YzU3YWYwNTZlMTc2YmVjODE2YTAzNjJmZjVmYWVjMjkwYTJiM2U4MzY2MzcwMzk4ZWE4MWFjOTVjIiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiMWZkYWZlZTNkMTdjOGViM2NmMzcwYmRjNDVkNTdiY2IyZTdjNjQ4M2Y3MGU0NmFmNGEyODk5OWUyMDM5NmFkMiIsInBhdGgiOiJpc3N1YW5jZURhdGUifSx7InZhbHVlIjoiNmQ4ZGFiZjdiNGQ4YTI4NDhkYWY2NzcxNTA5MDE1NWQwODg3MjUzZjE1N2MwOGFhMjY2MmY3YzUwNjBlNWVkMyIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiZTkxZWE0ZjJiNjBkZDJmNjg0MjRhY2I1MTcxY2UxMTFkYzEzZDRmNTY2MWIzZGExYjA5ODBiZjg1ZWM2MGU1ZSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMzIzZWFlMjFlMmU2NTE3MzY3YmZjZDE4NTkwMDE2YzY4NzM0ZGZlZDBhYzRjNzExY2E4MjQwYTg1NDkxN2MzZiIsInBhdGgiOiJpc3N1ZXIubmFtZSJ9LHsidmFsdWUiOiI5NjdlNzkxNTJlYzQwZDg3YjBkNzYxNzYyZjllODJlMzE4YzM4MzA4Nzk3NWQ3NjA3YjE0NGM0Zjg3NDY0MTkyIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiNTFkY2IxODk4YmRkZmVkZjA0ZTVlODM5Y2JlN2RlZGQ3NTkxNWIyNmEwZTAwZjUzNTU2NzdhZTZjMzRkNTg0MiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjNhNDFjMjY5MzQ2ZmQ1N2IyMGY1YmZkOTM3MmM1MTMwYTNmNThjZDU2NDA4NzczNTI5MjFmZGEyMTQzMmYzMmUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMzE2NWJmOGJkNDFkNmZiMTA0NDg2MTI0ODIxYzExZDdhNjQ3NDAwYjliZjE5YWExMTEyMTA5YWQyODA5NjdhNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1swXS50eXBlIn0seyJ2YWx1ZSI6IjQzZjNkYTYzZjdkOGQyZjAwNDMzMDEwNTRlZjY4Njk0MjU3MTZiMjIzMWM2OTY3M2FlZDY5NzBlMWVmOWRlNDAiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJkMmM2N2RjNDliZGEyNWNiZWMwOWE3ZmJjMzI3ZGM4NTRhMzkzYzliNGY1ZTg1MWYxM2U1YzFmN2M2MjEzOWNjIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmNsYXNzWzFdLnR5cGUifSx7InZhbHVlIjoiMTUzYWJhZjM3Zjk5YTBkNThhYWQxOTlhOTBjOGJjMTA2MmQ5MTRlNDliMzdmMjJhMzA2YmIyZGEzNTY1YzFmMiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5jbGFzc1sxXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjI4NWIxM2RjNzA5MjY0ZWZkMzVhMGM5YTQ0MTcwMWI4MjBhNTQ1ZDVjOWQyNmMxNjAxOGQ2MDkyNzE1NDU5MmUiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEudGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiI4YjM4ZWEzYWU1OTJiNDU4ZmU0MTg5NTg1MTNkNGJiZmNmMTEyYTBiMjM1NTNmNTFmODhlOGNhNjIxZjhlNWFiIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiZmI5OGUxN2FiMmFkYjFiZTAwYzE2ZGIzZTYwZTYyN2QyMDAxYzc3NjU2YTkwNTUwOGNiZmI3YTg4YzhjZDBkOSIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS50ZW1wbGF0ZS51cmwifSx7InZhbHVlIjoiN2M5MWNjOWJhMGNiNWExODc0MzcyMWRiMWJiOWJiOTJlYmJjMzQwZTk1YmNiN2RlN2NkNjJiODAyNjAyNGNiMyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi50eXBlIn0seyJ2YWx1ZSI6ImIyODlmNzgxMDZkZDI2YzJjODJjZDViMGUxMmYxMmRhY2JhM2RkZjViYWFiYzEyZGZjNDU4MTA1OWI1YjUzMDIiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6Ijg3Nzk3YTYxYjBkMzUwYTMwYmNlNWUwNzJmNjJiN2Q3MmYyYWMyNWVlMzJjZWU5OTA4MDBkODE4ZTQ5NDgyODQiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudmFsdWUifSx7InZhbHVlIjoiMDI4ZWNhZmU5M2UwNzNlOWJiNDViODVjZGZlMDc0ODQ3Yjk2ZWZiYzA1OGUzNzAwOWM3NzU0NzE4ZDMyNjRlZiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi5yZXZvY2F0aW9uLnR5cGUifSx7InZhbHVlIjoiMjAwYjA5MmYzNTlhM2MxYTE3NDYwMWY1MTgzY2JjZDk4MjE1OWRlYTY2NWNhYzgxZWRmZjE5ODkxNWY4NzQwYyIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiNDNlOWNiMjU3OTIzYTQ2NDE3ODI1NTdmNjA4NWQ3NzkxZGYzOGYxOWE0NzA5MTE3ZmNlYjM1M2Y0NGFjMzBjZiIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImY2N2IxYjdjNmI2YWM5NWE3Yzk1NmM3NzcwYjU4MTczMDlmNzA2MzE5MDBhZjYxNzFkNjllZmM2MmM1OTFjMjYiLCJwYXRoIjoiYXR0YWNobWVudHNbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiYmNjYzU1YjJjOWM4NmI4ODhhMTc0NDExMjk2MjljNzAzMDNkYTRjMzgwOTc2Njg1NzQ0M2RhOTFhMGY1NmRhNCIsInBhdGgiOiJhdHRhY2htZW50c1swXS5taW1lVHlwZSJ9LHsidmFsdWUiOiJlZmUwZjIyNjUyOWVjNTZhY2MyYzZhNzZiMTdmMjc3YmY3YjVjOWMwY2ZmMDMxNzA2YzUzODg2MTVkMzQ3Y2E4IiwicGF0aCI6ImF0dGFjaG1lbnRzWzBdLmRhdGEifV0=",
          privacy: {
            obfuscated: [],
          },
        },
      };
      const fragment = await verify(tamperedDocument as any);
      expect(fragment).toStrictEqual([
        {
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          data: false,
          reason: {
            code: 0,
            codeString: "DOCUMENT_TAMPERED",
            message: "Document has been tampered with",
          },
          status: "INVALID",
        },
      ]);
    });
    it("should skip if its not a recognizable document", async () => {
      const fragment = await verify({} as any);
      expect(fragment).toStrictEqual([
        {
          status: "SKIPPED",
          name: "OpenAttestationHash",
          type: "DOCUMENT_INTEGRITY",
          reason: {
            code: 2,
            codeString: "SKIPPED",
            message: `Document does not have merkle root, target hash or data.`,
          },
        },
      ]);
    });
  });
});
