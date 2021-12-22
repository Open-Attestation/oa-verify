"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationBuilder = void 0;
var utils_1 = require("../common/utils");
var messages_1 = require("../common/messages");
// keeping the following code for posterity. If we want the function below to return better types, we can use the following
// type PromiseValue<T> = T extends Promise<infer U> ? U : never;
// Promise<PromiseValue<ReturnType<T["verify"] | T["skip"]>>[]>
/**
 * A verification manager will run a list of {@link Verifier} over a signed document.
 * Before running each verifier, the manager will make sure the verifier can handle the specific document by calling its exposed test function.
 * The manager will return the consolidated list of {@link VerificationFragment}
 */
var displayWarning = true;
var verificationBuilder = function (verifiers, builderOptions) { return function (document, promisesCallback) {
    // if the user didn't configure an API key and didn't configure a provider or a resolver, then he will likely use a development key. We then warn him once, that he may need to configure things properly, especially for production
    if (displayWarning &&
        (!builderOptions.resolver || !builderOptions.provider) &&
        !process.env.INFURA_API_KEY &&
        !process.env.PROVIDER_API_KEY) {
        displayWarning = false;
        console.warn(messages_1.warnProvider);
    }
    var verifierOptions = {
        provider: utils_1.getProvider(builderOptions),
        resolver: builderOptions.resolver,
    };
    var promises = verifiers.map(function (verifier) {
        if (verifier.test(document, verifierOptions)) {
            return verifier.verify(document, verifierOptions);
        }
        return verifier.skip(document, verifierOptions);
    });
    promisesCallback === null || promisesCallback === void 0 ? void 0 : promisesCallback(promises);
    return Promise.all(promises);
}; };
exports.verificationBuilder = verificationBuilder;
