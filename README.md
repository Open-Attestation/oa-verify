[![CircleCI](https://circleci.com/gh/Open-Attestation/oa-verify.svg?style=svg)](https://circleci.com/gh/Open-Attestation/oa-verify)

# Open Attestation (Verify)

The [Open Attestation (Verify)](https://github.com/Open-Attestation/oa-verify) repository is the codebase for the npm module that allows you to verify [wrapped document](/docs/developer-section/libraries/open-attestation#wrapping-documents) programmatically. This is useful if you are building your own API or web components. Some common use cases where you will need this module:

- [Verifying a document](#verifying-a-document)
- [Building custom verifier](#custom-verification)
- [Building custom validation](#custom-validation)

This module does not provide the following functionality:

- Programmatic wrapping of OA documents (refer to [Open Attestation](https://www.openattestation.com/docs/developer-section/libraries/open-attestation#wrapping-documents))
- Encryption or decryption of OA documents (refer to [Open Attestation (Encryption)](https://www.openattestation.com/docs/developer-section/libraries/open-attestation-encryption))
- Programmatic issuance/revocation of document on the Ethereum blockchain

## Installation

```bash
npm i @govtechsg/oa-verify
```

---

## Usage

### Verifying a document

A verification happens on a wrapped document, and it consists of answering to some questions:

- Has the document been tampered with ?
- Is the issuance state of the document valid ?
- Is the document issuer identity valid ? (see [identity proof](https://www.openattestation.com/docs/docs-section/how-does-it-work/issuance-identity))

A wrapped document (shown below) created using [Open Attestation](https://www.openattestation.com/docs/developer-section/libraries/open-attestation) would be required.

> **NOTE:** The document shown below is valid and has been issued on the ropsten network

```json
{
  "version": "https://schema.openattestation.com/2.0/schema.json",
  "data": {
    "issuers": [
      {
        "documentStore": "746531fb-bcbf-44d1-a32f-d662c411a71e:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        "name": "824f1c2e-e289-4574-b207-d39afb151592:string:University of Blockchain",
        "identityProof": {
          "type": "e92275d8-5e8f-4adf-98fe-62e615f9837d:string:DNS-TXT",
          "location": "3628440e-c859-4eec-bf47-fffedafec154:string:example.openattestation.com"
        }
      }
    ]
  },
  "privacy": { "obfuscatedData": [] },
  "signature": {
    "type": "SHA3MerkleProof",
    "targetHash": "0badef8f1d5652abef918c15725412b715c708d5eb25fe14df155d63c5241f62",
    "proof": [],
    "merkleRoot": "0badef8f1d5652abef918c15725412b715c708d5eb25fe14df155d63c5241f62"
  }
}
```

To perform verification check on the document:

```ts
// index.ts
import { isValid, verify } from "@govtechsg/oa-verify";
import * as document from "./document.json";

const fragments = await verify(document as any);

console.log(isValid(fragments)); // output true
```

### Custom verification

By default the provided `verify` method performs multiple checks on a document

- for the type `DOCUMENT_STATUS`: it runs `OpenAttestationEthereumDocumentStoreStatus`, `OpenAttestationEthereumTokenRegistryStatus` and `DidSignedDocumentStatus` verifiers
- for the type `DOCUMENT_INTEGRITY`: it runs `OpenAttestationHash` verifier
- for the type `ISSUER_IDENTITY`: it runs `OpenAttestationDnsTxt` and `DnsDidProof` verifiers

All those verifiers are exported as `openAttestationVerifiers`

You can build your own verify method or your own verifiers:

```ts
// creating your own verify using default exported verifiers
import { verificationBuilder, openAttestationVerifiers } from "@govtechsg/oa-verify";

const verify1 = verificationBuilder(openAttestationVerifiers, { network: "ropsten" }); // this verify is equivalent to the one exported by the library
// this verify is equivalent to the one exported by the library
const verify2 = verificationBuilder([openAttestationVerifiers[0], openAttestationVerifiers[1]], {
  network: "ropsten",
}); // this verify only run 2 verifiers
```

```ts
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
const verify = verificationBuilder([...openAttestationVerifiers, customVerifier], { network: "ropsten" });
```

Refer to [Extending Custom Verification](#extending-custom-verification) to find out more on how to create your own custom verifier.

### Custom validation

Fragments would be produced after verifying a document. Each fragment will help to determine if the individual type mentioned [here](#custom-verification) is valid or not, and would collectively prove the validity of the document.

The `isValid` function will execute over fragments and determine if the fragments produced a valid result. By default the function will return true if a document fulfill the following conditions:

- The document has NOT been tampered, AND
- The document has been issued, AND
- The document has NOT been revoked, AND
- The issuer identity is valid.

The function also allows a list of types to check for as a second parameter.

```ts
// index.ts
import { isValid, openAttestationVerifiers, verificationBuilder } from "@govtechsg/oa-verify";
import * as document from "./document.json";

const verify = verificationBuilder(openAttestationVerifiers, {
  network: "mainnet",
});

const fragments = await verify(document as any);

console.log(isValid(fragments, ["DOCUMENT_INTEGRITY"])); // output true
console.log(isValid(fragments, ["DOCUMENT_STATUS"])); // output false
console.log(isValid(fragments, ["ISSUER_IDENTITY"])); // outpute false
console.log(isValid(fragments)); // output false
```

- `isValid(fragments, ["DOCUMENT_INTEGRITY"])` returns true because the integrity of the document is not dependent on the network it has been published to.
- `isValid(fragments, ["DOCUMENT_STATUS"])` returns false because the document has not been published on Ethereum main network.
- `isValid(fragments, ["ISSUER_IDENTITY"])` returns false because there is no [DNS-TXT record](https://www.openattestation.com/docs/integrator-section/verifiable-document/ethereum/dns-proof) associated with the Ethereum main network's document store.
- `isValid(fragments)` returns false because at least one of the above returns false.

### Listening to individual verification method

The `verify` function provides an option to listen to individual verification methods. It might be useful if you want, for instance, to provide individual loaders on your UI.

```ts
// index.ts
import { isValid, openAttestationVerifiers, verificationBuilder } from "@govtechsg/oa-verify";
import * as document from "./document.json";

const verify = verificationBuilder(openAttestationVerifiers, {
  network: "ropsten",
});

const promisesCallback = (verificationMethods: any) => {
  for (const verificationMethod of verificationMethods) {
    verificationMethod.then((fragment: any) => {
      console.log(`${fragment.name} has been resolved with status ${fragment.status}`);
    });
  }
};

const fragments = await verify(document as any, promisesCallBack);

console.log(isValid(fragments)); // output true
```

---

## Advanced usage

### Extending Custom Verification

Extending from [Custom Verification](#custom-verification) section, we will learn how to write custom verification methods and how you can distribute your own verifier.

#### Building a custom verification method

We will write a verification method having the following rules:

1. it must run only on document having their version equal to `https://schema.openattestation.com/2.0/schema.json`.
1. it must return a valid fragment, if and only if the document data hold a name property with the value `Certificate of Completion`

**Document version must be equal to `https://schema.openattestation.com/2.0/schema.json`**

This is where `skip` and `test` methods come into play. We will use the `test` method to return when the verification method run, and the `skip` method to explain why it didn't run:

```ts
// index.ts
import { verificationBuilder, openAttestationVerifiers, isValid } from "@govtechsg/oa-verify";
import { getData } from "@govtechsg/open-attestation";
import * as document from "./document.json";

const customVerifier = {
  skip: async () => {
    return {
      status: "SKIPPED",
      type: "DOCUMENT_INTEGRITY",
      name: "CustomVerifier",
      reason: {
        code: 0,
        codeString: "SKIPPED",
        message: `Document doesn't have version equal to 'https://schema.openattestation.com/2.0/schema.json'`,
      },
    };
  },
  test: () => document.version === "https://schema.openattestation.com/2.0/schema.json",
};
```

> we use `DOCUMENT_INTEGRITY` type because we check for the content of the document.

**Document holds correct `name` property**

Once we have decided `when` the verification method run, it's time to write the logic of the verifier in the `verify` method. We will use [getData](https://www.openattestation.com/docs/developer-section/libraries/open-attestation#retrieving-document-data) utility to access the data of the document and return the appropriate fragment depending on the content:

```ts
// index.ts
import { verificationBuilder, openAttestationVerifiers, isValid } from "@govtechsg/oa-verify";
import { getData } from "@govtechsg/open-attestation";
import * as document from "./document.json";

const customVerifier = {
  skip: async () => {
    /* content has been defined in the section above */
  },
  test: () => /* content has been defined in the section above */,
  verify: async (document: any) => {
    const documentData = getData(document);
    if (documentData.name !== "Certificate of Completion") {
      return {
        type: "DOCUMENT_INTEGRITY",
        name: "CustomVerifier",
        data: documentData.name,
        reason: {
          code: 1,
          codeString: "INVALID_NAME",
          message: `Document name is ${documentData.name}`,
        },
        status: "INVALID",
      };
    }
    return {
      type: "DOCUMENT_INTEGRITY",
      name: "CustomVerifier",
      data: documentData.name,
      status: "VALID",
    };
  },
};
```

#### Building a custom verify method

The `verify` function is built to run a list of verification method. Each verifier will produce a fragment that will help to determine if the document is valid. OpenAttestation comes with its own set of verification methods available in `openAttestationVerifiers`.

The `verificationBuilder` function helps you to create custom verification method. You can reuse the default one exported by the library.

Extending from what have been mentioned in [Custom Verification](#custom-verification), let's now build a new verifier using our custom verification method:

```ts
// index.ts
import { verificationBuilder, openAttestationVerifiers, isValid } from "@govtechsg/oa-verify";
import { getData } from "@govtechsg/open-attestation";
import document from "./document.json";

// our custom verifier will be valid only if the document version is not https://schema.openattestation.com/2.0/schema.json
const customVerifier = {
  skip: async () => {
    return {
      status: "SKIPPED",
      type: "DOCUMENT_INTEGRITY",
      name: "CustomVerifier",
      reason: {
        code: 0,
        codeString: "SKIPPED",
        message: `Document doesn't have version equal to 'https://schema.openattestation.com/2.0/schema.json'`,
      },
    };
  },
  test: () => document.version === "https://schema.openattestation.com/2.0/schema.json",
  verify: async (document: any) => {
    const documentData = getData(document);
    if (documentData.name !== "Certificate of Completion") {
      return {
        type: "DOCUMENT_INTEGRITY",
        name: "CustomVerifier",
        data: documentData.name,
        reason: {
          code: 1,
          codeString: "INVALID_NAME",
          message: `Document name is ${documentData.name}`,
        },
        status: "INVALID",
      };
    }
    return {
      type: "DOCUMENT_INTEGRITY",
      name: "CustomVerifier",
      data: documentData.name,
      status: "VALID",
    };
  },
};

// create your own verify function with all verifiers and your custom one
const verify = verificationBuilder([...openAttestationVerifiers, customVerifier], { network: "ropsten" });

const fragments = await verify(document);

console.log(isValid(fragments)); // return false
console.log(fragments.find((fragment: any) => fragment.name === "CustomVerifier")); // display the details on our specific verifier
```

The document that we [created](#verifying-a-document) is not valid against our own verifier because the name property does not exist. Try again with the following document:

```json
{
  "version": "https://schema.openattestation.com/2.0/schema.json",
  "data": {
    "name": "66e35a92-9e97-4ffc-b94e-769773dd7535:string:Certificate of Completion",
    "issuers": [
      {
        "documentStore": "375a13f9-ca3d-4a1f-a0c9-1fa92e43a3ec:string:0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3",
        "name": "448c7f62-3a93-4792-a157-fabcbf15b91a:string:University of Blockchain",
        "identityProof": {
          "type": "dcfc17e0-a178-4bb8-b0fb-6a2cfddb8f2f:string:DNS-TXT",
          "location": "e3f54dbf-bb51-41bb-9511-e01a5c07ea86:string:example.openattestation.com"
        }
      }
    ]
  },
  "privacy": { "obfuscatedData": [] },
  "signature": {
    "type": "SHA3MerkleProof",
    "targetHash": "975887a864e11fbe27e90f4759c44db90193abc237dede81cd3cd7ca45c46522",
    "proof": [],
    "merkleRoot": "975887a864e11fbe27e90f4759c44db90193abc237dede81cd3cd7ca45c46522"
  }
}
```

### Environment variables

- `PROVIDER_API_KEY`: let you provide your own PROVIDER API key.
- `PROVIDER_ENDPOINT_URL`: let you provide your preferred JSON-RPC HTTP API URL.
- `PROVIDER_NETWORK`: let you specify the network to use, i.e. "homestead", "mainnet", "ropsten", "rinkeby".
- `PROVIDER_ENDPOINT_TYPE`: let you specify the provider to use, i.e. "infura", "alchemy", "jsonrpc".

_Provider that is supported: Infura, EtherScan, Alchemy, JSON-RPC_

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

---

## Provider

You may generate a provider using the provider generator, it supports `INFURA`, `ALCHEMY`, `ETHERSCAN` and `JsonRPC` provider.

It requires a set of options:

- `network`: The _network_ may be specified as a **string** for a common network name, i.e. "homestead", "mainnet", "ropsten", "rinkeby".
- `provider`: The _provider_ may be specified as a **string**, i.e. "infura", "alchemy" or "jsonrpc".
- `url`: The _url_ may be specified as a **string** in which is being used to connect to a JSON-RPC HTTP API
- `apiKey`: The _apiKey_ may be specified as a **string** for use together with the provider. If no apiKey is provided, a default shared API key will be used, which may result in reduced performance and throttled requests.

### Example

The most basic way to use:

```ts
import { utils } from "@govtechsg/oa-verify";
const provider = utils.generateProvider();
// This will generate an infura provider using the default values.
```

Alternate way 1 (with environment variables):

```ts
// environment file
PROVIDER_NETWORK = "ropsten";
PROVIDER_ENDPOINT_TYPE = "infura";
PROVIDER_ENDPOINT_URL = "http://jsonrpc.com";
PROVIDER_API_KEY = "ajdh1j23";

// provider file
import { utils } from "@govtechsg/oa-verify";
const provider = utils.generateProvider();
// This will use the environment variables declared in the files automatically.
```

Alternate way 2 (passing values in as parameters):

```ts
import { utils } from "@govtechsg/oa-verify";
const providerOptions = {
  network: "ropsten",
  providerType: "infura",
  apiKey: "abdfddsfe23232",
};
const provider = utils.generateProvider(providerOptions);
// This will generate a provider based on the options provided.
// NOTE: by using this way, it will override all environment variables and default values.
```

---

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

```ts
import { utils } from "@govtechsg/oa-verify";
const fragments = verify(documentRopstenValidWithCertificateStore, { network: "ropsten" });
// return the correct fragment, correctly typed
const fragment = utils.getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);

if (utils.isValidFragment(fragment)) {
  // guard to narrow to the valid fragment type
  const { data } = fragment;
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

---

## Verification method

| Name                                       | Type               | Description                                                                  | Present in default verifier? |
| ------------------------------------------ | ------------------ | ---------------------------------------------------------------------------- | ---------------------------- |
| OpenAttestationHash                        | DOCUMENT_INTEGRITY | Verify that merkle root and target hash matches the certificate              | Yes                          |
| OpenAttestationDidSignedDocumentStatus     | DOCUMENT_STATUS    | Verify the validity of the signature of a DID signed certificate             | Yes                          |
| OpenAttestationEthereumDocumentStoreStatus | DOCUMENT_STATUS    | Verify the certificate has been issued to the document store and not revoked | Yes                          |
| OpenAttestationEthereumTokenRegistryStatus | DOCUMENT_STATUS    | Verify the certificate has been issued to the token registry and not revoked | Yes                          |
| OpenAttestationDidIdentityProof            | ISSUER_IDENTITY    | Verify identity of DID (similar to OpenAttestationDidSignedDocumentStatus)   | No                           |
| OpenAttestationDnsDidIdentityProof         | ISSUER_IDENTITY    | Verify identify of DID certificate using DNS-TXT                             | Yes                          |
| OpenAttestationDnsTxtIdentityProof         | ISSUER_IDENTITY    | Verify identify of document store certificate using DNS-TXT                  | Yes                          |

---

## Development

To run tests

```
npm run test
```

To generate test documents (for v3), you may use the script at `scripts/generate.v3.ts` and run the command

```
npm run generate:v3
```

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)

## Additional information

- For Verification SDK implementation follow our [Verifier ADR](https://github.com/Open-Attestation/adr/blob/master/verifier.md).
- Found a bug ? Having a question ? Want to share an idea ? Reach us out on the [Github repository](https://github.com/Open-Attestation/oa-verify).`
