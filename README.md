# @govtechsg/oa-verify

![Travis build status](https://travis-ci.org/OpenCerts/oa-verify.svg?branch=master)

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

[Apache v2.0](https://www.apache.org/licenses/LICENSE-2.0)
