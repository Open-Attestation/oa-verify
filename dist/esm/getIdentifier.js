import { isVerificationFragmentWithData } from "./types/core";
import { DidVerificationStatus, DidVerificationStatusArray } from "./did/verifier";
import { DnsDidVerificationStatus, DnsDidVerificationStatusArray, } from "./verifiers/issuerIdentity/dnsDid/dnsDidProof.type";
import { DnsTxtVerificationStatusArray, DnsTxtVerificationStatusDataV3, } from "./verifiers/issuerIdentity/dnsTxt/openAttestationDnsTxt.type";
var IdentityProof;
(function (IdentityProof) {
    IdentityProof["DNS"] = "OpenAttestationDnsTxtIdentityProof";
    IdentityProof["DNSDID"] = "OpenAttestationDnsDidIdentityProof";
    IdentityProof["DID"] = "OpenAttestationDidIdentityProof";
})(IdentityProof || (IdentityProof = {}));
var getDnsIdentifierProof = function (_a) {
    var data = _a.data;
    var type = "DNS";
    if (DnsTxtVerificationStatusDataV3.guard(data)) {
        return {
            identifier: data.identifier,
            type: type,
        };
    }
    else if (DnsTxtVerificationStatusArray.guard(data)) {
        return data.map(function (issuer) { return ({
            identifier: issuer.location,
            type: type,
        }); });
    }
    throw new Error("Fragment for DNS not supported");
};
var getDnsDidIdentifierProof = function (_a) {
    var data = _a.data;
    var type = "DNS-DID";
    if (DnsDidVerificationStatusArray.guard(data)) {
        return data.map(function (issuer) { return ({
            identifier: issuer.location,
            type: type,
        }); });
    }
    else if (DnsDidVerificationStatus.guard(data)) {
        return {
            identifier: data.location,
            type: type,
        };
    }
    throw new Error("Fragment for DNS-DID not supported");
};
var getDidIdentifierProof = function (_a) {
    var data = _a.data;
    var type = "DID";
    if (DidVerificationStatusArray.guard(data)) {
        return data.map(function (issuer) { return ({
            identifier: issuer.did,
            type: type,
        }); });
    }
    else if (DidVerificationStatus.guard(data)) {
        return {
            identifier: data.did,
            type: type,
        };
    }
    throw new Error("Fragment for DID not supported");
};
var getIdentityProofFragment = function (fragments) {
    if (fragments.length < 1) {
        throw new Error("Please provide at least one verification fragment");
    }
    return fragments.find(function (status) { return status.type === "ISSUER_IDENTITY" && status.status === "VALID"; });
};
export var getIdentifier = function (fragments) {
    var fragment = getIdentityProofFragment(fragments);
    if (!fragment) {
        throw new Error("Did not find any Issuer Identity fragment that is valid");
    }
    if (!isVerificationFragmentWithData(fragment)) {
        throw new Error("No data property found in fragment, malformed fragment");
    }
    switch (fragment.name) {
        case IdentityProof.DNS:
            return getDnsIdentifierProof(fragment);
        case IdentityProof.DNSDID:
            return getDnsDidIdentifierProof(fragment);
        case IdentityProof.DID:
            return getDidIdentifierProof(fragment);
        default:
            return {
                identifier: "Unknown",
                type: "Unknown",
            };
    }
};
