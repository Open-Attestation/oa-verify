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
    "valid": true
  },
  "identity": {
    "valid": true,
    "identities": {
      "0x007d40224f6562461633ccfbaffd359ebb2fc9ba": "Government Technology Agency of Singapore (GovTech)"
    }
  },
  "issued": {
    "valid": false,
    "issued": {
      "0x007d40224f6562461633ccfbaffd359ebb2fc9ba": false
    }
  },
  "revoked": {
    "valid": false,
    "revoked": {
      "0x007d40224f6562461633ccfbaffd359ebb2fc9ba": true
    }
  },
  "valid": false
}
```

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)
