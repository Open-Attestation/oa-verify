export var isValid = function (verificationFragments, types) {
    if (types === void 0) { types = ["DOCUMENT_STATUS", "DOCUMENT_INTEGRITY", "ISSUER_IDENTITY"]; }
    if (verificationFragments.length < 1) {
        throw new Error("Please provide at least one verification fragment to check");
    }
    if (types.length < 1) {
        throw new Error("Please provide at least one type to check");
    }
    return types.every(function (type) {
        var verificationFragmentsForType = verificationFragments.filter(function (fragment) { return fragment.type === type; });
        // return true if at least one fragment is valid
        // and all fragments are valid or skipped
        return (verificationFragmentsForType.some(function (fragment) { return fragment.status === "VALID"; }) &&
            verificationFragmentsForType.every(function (fragment) { return fragment.status === "VALID" || fragment.status === "SKIPPED"; }));
    });
};
