/**
 * A verification manager will run a list of {@link Verifier} over a signed document.
 * Before running each verifier, the manager will make sure the verifier can handle the specific document by calling its exposed test function.
 * The manager will return the consolidated list of {@link VerificationFragment}
 */
export var verificationBuilder = function (verifiers) { return function (document, options) {
    var _a;
    var promises = verifiers.map(function (verifier) {
        if (verifier.test(document, options)) {
            return verifier.verify(document, options);
        }
        return verifier.skip(document, options);
    });
    (_a = options.promisesCallback) === null || _a === void 0 ? void 0 : _a.call(options, promises);
    return Promise.all(promises);
}; };
