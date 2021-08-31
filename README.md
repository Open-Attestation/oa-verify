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

const fragments = await verify(documentRopstenValidWithToken);
console.log(fragments); // see below
console.log(isValid(fragments)); // display true
```

```json
[
  {
    "data": true,
    "name": "OpenAttestationHash",
    "status": "VALID",
    "type": "DOCUMENT_INTEGRITY"
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
    "name": "OpenAttestationEthereumTokenRegistryStatus",
    "status": "VALID",
    "type": "DOCUMENT_STATUS"
  },
  {
    "name": "OpenAttestationEthereumDocumentStoreStatus",
    "reason": {
      "code": 4,
      "codeString": "SKIPPED",
      "message": "Document issuers doesn't have \"documentStore\" or \"certificateStore\" property or DOCUMENT_STORE method"
    },
    "status": "SKIPPED",
    "type": "DOCUMENT_STATUS"
  },
  {
    "name": "OpenAttestationDidSignedDocumentStatus",
    "reason": {
      "code": 0,
      "codeString": "SKIPPED",
      "message": "Document was not signed by DID directly"
    },
    "status": "SKIPPED",
    "type": "DOCUMENT_STATUS"
  },
  {
    "data": [
      {
        "location": "example.tradetrust.io",
        "status": "VALID",
        "value": "0xe59877ac86c0310e9ddaeb627f42fdee5f793fbe"
      }
    ],
    "name": "OpenAttestationDnsTxtIdentityProof",
    "status": "VALID",
    "type": "ISSUER_IDENTITY"
  },
  {
    "name": "OpenAttestationDnsDidIdentityProof",
    "reason": {
      "code": 0,
      "codeString": "SKIPPED",
      "message": "Document was not issued using DNS-DID"
    },
    "status": "SKIPPED",
    "type": "ISSUER_IDENTITY"
  }
]
```

## Advanced usage

### Environment Variables

- `PROVIDER_API_KEY`: let you provide your own PROVIDER API key.
- `PROVIDER_ENDPOINT_URL`: let you provide your preferred JSON-RPC HTTP API URL.
- `PROVIDER_NETWORK`: let you specify the network to use, i.e. "homestead", "mainnet", "ropsten", "rinkeby".
- `PROVIDER_ENDPOINT_TYPE`: let you specify the provider to use, i.e. "infura", "alchemy", "jsonrpc".

_Provider that is supported: Infura, Alchemy, JSON-RPC_

### Switching network

You may build the verifier to verify against a custom network by either:

1. providing your own web3 provider
2. specifying the network name (provider will be using the default ones)

To provide your own provider:

```ts
const verify = verificationBuilder(openAttestationVerifiers, { provider: customProvider });
```

To specify network:

```ts
const verify = verificationBuilder(openAttestationVerifiers, { network: "ropsten" });
```

### Specify resolver

`oa-verify` exposes a method, called `createResolver` that allows you to easily create custom resolvers, to resolve DIDs:

```ts
import { createResolver, verificationBuilder, openAttestationVerifiers } from "@govtechsg/oa-verify";

const resolver = createResolver({
  networks: [{ name: "my-network", rpcUrl: "https://my-private-chain/besu", registry: "0xaE5a9b9..." }],
});

const verify = verificationBuilder(openAttestationVerifiers, { resolver });
```

At the moment, oa-verify supports two did resolvers:

- [web-did-resolver](https://github.com/decentralized-identity/web-did-resolver#readme)
- [ethd-did-resolver](https://github.com/decentralized-identity/ethr-did-resolver)

### Verify

By default the provided `verify` method performs multiple checks on a document

- for the type `DOCUMENT_STATUS`: it runs `OpenAttestationEthereumDocumentStoreStatus` and `OpenAttestationEthereumTokenRegistryStatus` verifiers
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
  verify: async (document) => {
    // perform checks and returns a fragment
  },
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

## Provider

You may generate a provider using the provider generator, it supports `INFURA`, `ALCHEMY` and `JsonRPC` provider.

It requires a set of options:

- `network`: The _network_ may be specified as a **string** for a common network name, i.e. "homestead", "mainnet", "ropsten", "rinkeby".
- `provider`: The _provider_ may be specified as a **string**, i.e. "infura", "alchemy" or "jsonrpc".
- `url`: The _url_ may be specified as a **string** in which is being used to connect to a JSON-RPC HTTP API
- `apiKey`: The _apiKey_ may be specified as a **string** for use together with the provider. If no apiKey is provided, a default shared API key will be used, which may result in reduced performance and throttled requests.

### Example

The most basic way to use:

```
import { utils } from "@govtechsg/oa-verify";
const provider = utils.generateProvider();
// This will generate an infura provider using the default values.
```

Alternate way 1 (with environment variables):

```
// environment file
PROVIDER_NETWORK="ropsten"
PROVIDER_ENDPOINT_TYPE="infura"
PROVIDER_ENDPOINT_URL="http://jsonrpc.com"
PROVIDER_API_KEY="ajdh1j23"

// provider file
import { utils } from "@govtechsg/oa-verify";
const provider = utils.generateProvider();
// This will use the environment variables declared in the files automatically.
```

Alternate way 2 (passing values in as parameters):

```
import { utils } from "@govtechsg/oa-verify";
const providerOptions = {
  network: "ropsten",
  providerType: "infura",
  apiKey: "abdfddsfe23232"
};
const provider = utils.generateProvider(providerOptions);
// This will generate a provider based on the options provided.
// NOTE: by using this way, it will override all environment variables and default values.
```

## Utils and types

### Overview

Various utilities and types are available to assert the correctness of fragments. Each verification method exports types for the fragment, and the data associated with the fragment.

- fragment types are available in 4 flavors: `VALID`, `INVALID`, `SKIPPED`, and `ERROR`.
- `VALID` and `INVALID` fragment data are available in 2 flavors most of the time, one for each version of `OpenAttestation`.

This library provides types and utilities to:

- get a specific fragment from all the fragments returned by the `verify` method
- narrow down to a specific type of fragment
- narrow down to a specific fragment data

Let's see how to use it

### Example

```
import {utils} from "@govtechsg/oa-verify";
const fragments = verify(documentRopstenValidWithCertificateStore, { network: "ropsten" });
// return the correct fragment, correctly typed
const fragment = utils.getOpenAttestationEthereumTokenRegistryStatusFragment(fragments)

if(utils.isValidFragment(fragment)) {
    // guard to narrow to the valid fragment type
    const {data} = fragment;
    if (ValidTokenRegistryDataV2.guard(data)) {
        // data is correctly typed here
    }
}
```

Note that in the example above, using `utils.isValidFragment` might be unnecessary. It's possible to use directly `ValidTokenRegistryDataV2.guard` over the data.

### List of utilities

- `getOpenAttestationHashFragment`
- `getOpenAttestationDidSignedDocumentStatusFragment`
- `getOpenAttestationEthereumDocumentStoreStatusFragment`
- `getOpenAttestationEthereumTokenRegistryStatusFragment`
- `getOpenAttestationDidIdentityProofFragment`
- `getOpenAttestationDnsDidIdentityProofFragment`
- `getOpenAttestationDnsTxtIdentityProofFragment`
- `getDocumentIntegrityFragments`
- `getDocumentStatusFragments`
- `getIssuerIdentityFragments`
- `isValidFragment`: type guard to filter only `VALID` fragment type
- `isInvalidFragment`: type guard to filter only `INVALID` fragment type
- `isErrorFragment`: type guard to filter only `ERROR` fragment type
- `isSkippedFragment`: type guard to filter only `SKIPPED` fragment type

## Development

For generating of test documents (for v3) you may use the script at `scripts/generate.v3.ts` by running `npm run generate:v3`.

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)
