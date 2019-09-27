# @govtechsg/oa-verify

[![CircleCI](https://circleci.com/gh/Open-Attestation/oa-verify.svg?style=svg)](https://circleci.com/gh/Open-Attestation/oa-verify)

Library to verify any [OpenAttestation](https://github.com/OpenCerts/open-attestation) document.

## Installation

```sh
npm install @govtechsg/oa-verify
```

## Usage

```js
const document = require("./document.json");
const verify = require("@govtechsg/oa-verify");

verify(document).then(console.log);
```

```json
{
  "hash": { 
    "checksumMatch": true 
  },
  "issued": {
    "issuedOnAll": true,
    "details": [
      {
        "address": "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
        "issued": true
      }
    ]
  },
  "revoked": {
    "revokedOnAny": false,
    "details": [
      {
        "address": "0x48399Fb88bcD031C556F53e93F690EEC07963Af3",
        "revoked": false
      }
    ]
  },
  "valid": true
}
```

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)
