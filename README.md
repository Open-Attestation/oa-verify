# @govtechsg/oa-verify

[![CircleCI](https://circleci.com/gh/Open-Attestation/oa-verify.svg?style=svg)](https://circleci.com/gh/Open-Attestation/oa-verify)

Library to verify any [OpenAttestation](https://github.com/Open-Attestation/open-attestation) document. This library implements [the verifier ADR](https://github.com/Open-Attestation/adr/blob/master/verifier.md).

## Installation

```sh
npm install @govtechsg/oa-verify
```

## Usage

```typescript
import { documentRopstenValidWithToken } from "./test/fixtures/v2/documentRopstenValidWithToken";
import { verify, isValid } from "@govtechsg/oa-verify";

verify(documentRopstenValidWithToken, { network: "ropsten" }).then(console.log); // see below
console.log(isValid(results)); // display true
```

```json
[
  {
    "data": true,
    "status": "VALID",
    "name": "OpenAttestationHash",
    "type": "DOCUMENT_INTEGRITY"
  },
  {
    "message": "Document issuers doesn't have \"documentStore\" or \"certificateStore\" property or DOCUMENT_STORE method",
    "name": "OpenAttestationEthereumDocumentStoreIssued",
    "status": "SKIPPED",
    "type": "DOCUMENT_STATUS"
  },
  {
    "data": {
      "details": [
        {
          "address": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe",
          "minted": true
        }
      ],
      "mintedOnAll": true
    },
    "status": "VALID",
    "name": "OpenAttestationEthereumTokenRegistryMinted",
    "type": "DOCUMENT_STATUS"
  },
  {
    "message": "Document issuers doesn't have \"documentStore\" or \"certificateStore\" property or DOCUMENT_STORE method",
    "name": "OpenAttestationEthereumDocumentStoreRevoked",
    "status": "SKIPPED",
    "type": "DOCUMENT_STATUS"
  },
  {
    "data": [
      {
        "dns": "example.tradetrust.io",
        "identified": true,
        "smartContract": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
      }
    ],
    "status": "VALID",
    "name": "OpenAttestationDnsTxt",
    "type": "ISSUER_IDENTITY"
  }
]
```

## Advanced usage

### Verify

By default the provided `verify` method performs multiple checks on a document

- for the type `DOCUMENT_STATUS`: it runs `OpenAttestationEthereumDocumentStoreIssued`, `OpenAttestationEthereumDocumentStoreRevoked` and `OpenAttestationEthereumTokenRegistryIssued` verifiers
- for the type `DOCUMENT_INTEGRITY`: it runs `OpenAttestationHash` verifier
- for the type `ISSUER_IDENTITY`: it runs `OpenAttestationDnsTxt` verifier

All those verifiers are exported as `openAttestationVerifiers`

You can build your own verify method or you own verifiers:

```typescript
import { verificationBuilder, openAttestationVerifiers } from "@govtechsg/oa-verify";

// creating your own verify using default exported verifiers
const verify = verificationBuilder(openAttestationVerifiers); // this verify is equivalent to the one exported by the library
const verify = verificationBuilder([openAttestationVerifiers[0], openAttestationVerifiers[1]]); // this verify only run 2 verifiers

// creating your own verify using custom verifier
import { verificationBuilder, openAttestationVerifiers, Verifier } from "@govtechsg/oa-verify";
const customVerifier: Verifier = {
  skip: () => {
    // return a SkippedVerificationFragment if the verifier should be skipped or throw an error if it should always run
  },
  test: () => {
    // return true or false
  },
  verify: async document => {
    // perform checks and returns a fragment
  }
};

// create your own verify function with all verifiers and your custom one
const verify = verificationBuilder([...openAttestationVerifiers, customVerifier]);
```

### isValid

By default, `isValid` perform checks on every types that exists for a fragment:

- `DOCUMENT_STATUS`
- `DOCUMENT_INTEGRITY`
- `ISSUER_IDENTITY`
  it ensures that for every types, there is at least one `VALID` fragment and no `INVALID` or `ERROR` fragment.

The function allow to specify as a second parameters the list of types on which to perform the checks

```typescript
import { documentRopstenValidWithCertificateStore } from "./test/fixtures/v2/documentRopstenValidWithCertificateStore";
import { verify, isValid } from "@govtechsg/oa-verify";

const fragments = verify(documentRopstenValidWithCertificateStore, { network: "ropsten" });
isValid(fragments); // display false because ISSUER_IDENTITY is INVALID
isValid(fragments, ["DOCUMENT_INTEGRITY", "DOCUMENT_STATUS"]); // display true because those types are VALID
```

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)
