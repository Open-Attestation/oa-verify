import {
  isValid,
  isDocumentStoreAddressOrTokenRegistryAddressInvalid,
  contractNotFound,
  certificateNotIssued,
  certificateRevoked,
  invalidArgument,
  serverError,
  unhandledError,
} from "./validator";
import { VerificationFragment, InvalidVerificationFragment } from "./types/core";
import { InvalidDocumentStoreDataV2 } from "./verifiers/documentStatus/documentStore/ethereumDocumentStoreStatus.type";

describe("isValid", () => {
  it("should throw an error when no fragments are provided", () => {
    expect(() => isValid([])).toThrowError("Please provide at least one verification fragment to check");
  });
  it("should throw an error when empty types are provided", () => {
    const verificationFragment: VerificationFragment = {
      status: "VALID",
      name: "any",
      type: "DOCUMENT_STATUS",
    };
    expect(() => isValid([verificationFragment], [])).toThrowError("Please provide at least one type to check");
  });

  describe("with one provided type", () => {
    it("should return false when there is only one valid fragment for a different type", () => {
      const verificationFragment: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_STATUS",
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there is only one invalid fragment for the provided type", () => {
      const verificationFragment: VerificationFragment = {
        status: "ERROR",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there is only one error fragment for the provided type", () => {
      const verificationFragment: VerificationFragment = {
        status: "ERROR",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there is only one skipped fragment for the provided type", () => {
      const verificationFragment: VerificationFragment = {
        status: "SKIPPED",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there are only multiple skipped fragment for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "SKIPPED",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      const verificationFragment2: VerificationFragment = {
        status: "SKIPPED",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return true when there is only one valid fragment for the provided type", () => {
      const verificationFragment: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    });
    it("should return true when there are only multiple valid fragment for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      const verificationFragment2: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    });
    it("should return true when there is one valid fragment for the provided type and one error fragment for a different type", () => {
      const validVerificationFragment: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      const errorVerificationFragment: VerificationFragment = {
        status: "ERROR",
        name: "any",
        type: "DOCUMENT_STATUS",
      };
      expect(isValid([validVerificationFragment, errorVerificationFragment], ["DOCUMENT_INTEGRITY"])).toStrictEqual(
        true
      );
    });
    it("should return true when there is one skipped fragment and one valid for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "SKIPPED",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      const verificationFragment2: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
    });
    it("should return false when there is one error fragment and one valid for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "ERROR",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      const verificationFragment2: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
    it("should return false when there is one invalid fragment and one valid for the provided type", () => {
      const verificationFragment1: VerificationFragment = {
        status: "INVALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      const verificationFragment2: VerificationFragment = {
        status: "VALID",
        name: "any",
        type: "DOCUMENT_INTEGRITY",
      };
      expect(isValid([verificationFragment1, verificationFragment2], ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
    });
  });

  describe("with default types", () => {
    const documentStatusFragment: VerificationFragment = {
      status: "VALID",
      type: "DOCUMENT_STATUS",
      name: "any",
    };
    const documentIntegrityFragment: VerificationFragment = {
      status: "VALID",
      type: "DOCUMENT_INTEGRITY",
      name: "any",
    };
    const issuerIdentityFragment: VerificationFragment = {
      status: "VALID",
      type: "ISSUER_IDENTITY",
      name: "any",
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
        name: "any",
      };
      expect(
        isValid([
          documentStatusFragment,
          errorDocumentStatusFragment,
          documentIntegrityFragment,
          issuerIdentityFragment,
        ])
      ).toStrictEqual(false);
    });
    it("should return true if there is only one valid fragment for every types and one more valid fragment for DOCUMENT_STATUS", () => {
      const validDocumentStatusFragment: VerificationFragment = {
        status: "VALID",
        type: "DOCUMENT_STATUS",
        name: "any",
      };
      expect(
        isValid([
          documentStatusFragment,
          validDocumentStatusFragment,
          documentIntegrityFragment,
          issuerIdentityFragment,
        ])
      ).toStrictEqual(true);
    });
    it("should return false if there is only one valid fragment for every types and one invalid fragment for DOCUMENT_INTEGRITY", () => {
      const invalidDocumentIntegrityFragment: VerificationFragment = {
        status: "INVALID",
        type: "DOCUMENT_INTEGRITY",
        name: "any",
      };
      expect(
        isValid([
          documentStatusFragment,
          invalidDocumentIntegrityFragment,
          documentIntegrityFragment,
          issuerIdentityFragment,
        ])
      ).toStrictEqual(false);
    });
    it("should return false if there is only one valid fragment for DOCUMENT_STATUS / ISSUER_IDENTITY and one skipped fragment for DOCUMENT_INTEGRITY", () => {
      const skippedDocumentIntegrityFragment: VerificationFragment = {
        status: "SKIPPED",
        type: "DOCUMENT_INTEGRITY",
        name: "any",
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
          { ...issuerIdentityFragment, status: "ERROR" },
        ])
      ).toStrictEqual(false);
    });
    it("should return false if there is only one invalid fragment for every types", () => {
      expect(
        isValid([
          { ...documentIntegrityFragment, status: "INVALID" },
          { ...documentStatusFragment, status: "INVALID" },
          { ...issuerIdentityFragment, status: "INVALID" },
        ])
      ).toStrictEqual(false);
    });
    it("should return false if there is only one skipped fragment for every types", () => {
      expect(
        isValid([
          { ...documentIntegrityFragment, status: "SKIPPED" },
          { ...documentStatusFragment, status: "SKIPPED" },
          { ...issuerIdentityFragment, status: "SKIPPED" },
        ])
      ).toStrictEqual(false);
    });
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
