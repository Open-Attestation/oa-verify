import { isValid } from "./validator";
import { VerificationFragment } from "./types/core";

describe("isValid", () => {
  it("should throw an error when no fragments are provided", () => {
    expect(() => isValid([])).toThrowError("Please provide at least one verification fragment to check");
  });
  it("should throw an error when empty types are provided", () => {
    const verificationFragment: VerificationFragment = {
      status: "VALID",
      name: "any",
      type: "DOCUMENT_STATUS"
    };
    expect(() => isValid([verificationFragment], [])).toThrowError("Please provide at least one type to check");
  });

  describe("with one provided type", () => {
    it("should return false when there is only one valid fragment for a different type", () => {
      const verificationFragment: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_STATUS"
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there is only one invalid fragment for the provided type", () => {
      const verificationFragment: VerificationFragment = {
        status: "ERROR",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there is only one error fragment for the provided type", () => {
      const verificationFragment: VerificationFragment = {
        status: "ERROR",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there is only one skipped fragment for the provided type", () => {
      const verificationFragment: VerificationFragment = {
        status: "SKIPPED",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there are only multiple skipped fragment for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "SKIPPED",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      const verificationFragment2: VerificationFragment = {
        status: "SKIPPED",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return true when there is only one valid fragment for the provided type", () => {
      const verificationFragment: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    });
    it("should return true when there are only multiple valid fragment for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      const verificationFragment2: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    });
    it("should return true when there is one valid fragment for the provided type and one error fragment for a different type", () => {
      const validVerificationFragment: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      const errorVerificationFragment: VerificationFragment = {
        status: "ERROR",
        name: "any",
        type: "DOCUMENT_STATUS"
      };
      expect(isValid([validVerificationFragment, errorVerificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(
        true
      );
    });
    it("should return true when there is one skipped fragment and one valid for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "SKIPPED",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      const verificationFragment2: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    });
    it("should return false when there is one error fragment and one valid for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "ERROR",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      const verificationFragment2: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there is one invalid fragment and one valid for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "INVALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      const verificationFragment2: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY"
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
  });

  describe("with default types", () => {
    const documentStatusFragment: VerificationFragment = {
      status: "VALID",
      type: "DOCUMENT_STATUS",
      name: "any"
    };
    const documentIntegrityFragment: VerificationFragment = {
      status: "VALID",
      type: "DOCUMENT_INTEGRITY",
      name: "any"
    };
    const issuerIdentityFragment: VerificationFragment = {
      status: "VALID",
      type: "ISSUER_IDENTITY",
      name: "any"
    };
    it("should return true if there is only one valid fragment for every types", () => {
      expect(isValid([documentIntegrityFragment, documentStatusFragment, issuerIdentityFragment])).toStrictEqual(true);
    });
    it("should return false if there is only one valid fragment for DOCUMENT_INTEGRITY and DOCUMENT_STATUS", () => {
      expect(isValid([documentIntegrityFragment, documentStatusFragment])).toStrictEqual(false);
    });
    it("should return false if there is only one valid fragment for DOCUMENT_INTEGRITY and ISSUER_IDENTITY", () => {
      expect(isValid([documentIntegrityFragment, issuerIdentityFragment])).toStrictEqual(false);
    });
    it("should return false if there is only one valid fragment for DOCUMENT_STATUS and ISSUER_IDENTITY", () => {
      expect(isValid([documentStatusFragment, issuerIdentityFragment])).toStrictEqual(false);
    });
    it("should return false if there is only one valid fragment for every types and one error fragment for DOCUMENT_STATUS", () => {
      const errorDocumentStatusFragment: VerificationFragment = {
        status: "ERROR",
        type: "DOCUMENT_STATUS",
        name: "any"
      };
      expect(
        isValid([
          documentStatusFragment,
          errorDocumentStatusFragment,
          documentIntegrityFragment,
          issuerIdentityFragment
        ])
      ).toStrictEqual(false);
    });
    it("should return true if there is only one valid fragment for every types and one more valid fragment for DOCUMENT_STATUS", () => {
      const validDocumentStatusFragment: VerificationFragment = {
        status: "VALID",
        type: "DOCUMENT_STATUS",
        name: "any"
      };
      expect(
        isValid([
          documentStatusFragment,
          validDocumentStatusFragment,
          documentIntegrityFragment,
          issuerIdentityFragment
        ])
      ).toStrictEqual(true);
    });
    it("should return false if there is only one valid fragment for every types and one invalid fragment for DOCUMENT_INTEGRITY", () => {
      const invalidDocumentIntegrityFragment: VerificationFragment = {
        status: "INVALID",
        type: "DOCUMENT_INTEGRITY",
        name: "any"
      };
      expect(
        isValid([
          documentStatusFragment,
          invalidDocumentIntegrityFragment,
          documentIntegrityFragment,
          issuerIdentityFragment
        ])
      ).toStrictEqual(false);
    });
    it("should return false if there is only one valid fragment for DOCUMENT_STATUS / ISSUER_IDENTITY and one skipped fragment for DOCUMENT_INTEGRITY", () => {
      const skippedDocumentIntegrityFragment: VerificationFragment = {
        status: "SKIPPED",
        type: "DOCUMENT_INTEGRITY",
        name: "any"
      };
      expect(isValid([documentStatusFragment, skippedDocumentIntegrityFragment, issuerIdentityFragment])).toStrictEqual(
        false
      );
    });
    it("should return false if there is only one error fragment for every types", () => {
      expect(
        isValid([
          { ...documentIntegrityFragment, status: "ERROR" },
          { ...documentStatusFragment, status: "ERROR" },
          { ...issuerIdentityFragment, status: "ERROR" }
        ])
      ).toStrictEqual(false);
    });
    it("should return false if there is only one invalid fragment for every types", () => {
      expect(
        isValid([
          { ...documentIntegrityFragment, status: "INVALID" },
          { ...documentStatusFragment, status: "INVALID" },
          { ...issuerIdentityFragment, status: "INVALID" }
        ])
      ).toStrictEqual(false);
    });
    it("should return false if there is only one skipped fragment for every types", () => {
      expect(
        isValid([
          { ...documentIntegrityFragment, status: "SKIPPED" },
          { ...documentStatusFragment, status: "SKIPPED" },
          { ...issuerIdentityFragment, status: "SKIPPED" }
        ])
      ).toStrictEqual(false);
    });
  });
});
