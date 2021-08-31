import { providers } from "ethers";
import { INFURA_API_KEY } from "../config";
import {
  VerificationBuilderOptions,
  VerificationBuilderOptionsWithNetwork,
  VerificationFragment,
  VerificationFragmentType,
  ProviderDetails,
  providerType,
} from "../types/core";
import { OpenAttestationHashVerificationFragment } from "../verifiers/documentIntegrity/hash/openAttestationHash.type";
import { OpenAttestationDidSignedDocumentStatusVerificationFragment } from "../verifiers/documentStatus/didSigned/didSignedDocumentStatus.type";
import { OpenAttestationEthereumDocumentStoreStatusFragment } from "../verifiers/documentStatus/documentStore/ethereumDocumentStoreStatus.type";
import { OpenAttestationEthereumTokenRegistryStatusFragment } from "../verifiers/documentStatus/tokenRegistry/ethereumTokenRegistryStatus.type";
import { OpenAttestationDidIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/did/didIdentityProof.type";
import { OpenAttestationDnsDidIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/dnsDid/dnsDidProof.type";
import { OpenAttestationDnsTxtIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/dnsTxt/openAttestationDnsTxt.type";

export const getDefaultProvider = (options: VerificationBuilderOptionsWithNetwork): providers.Provider => {
  const network = options.network || process.env.PROVIDER_NETWORK || "homestead";
  const providerType = (process.env.PROVIDER_ENDPOINT_TYPE as providerType) || "infura";
  const apiKey = process.env.PROVIDER_API_KEY || (providerType === "infura" && INFURA_API_KEY) || "";
  // create infura provider to get connection information
  // we then use StaticJsonRpcProvider so that we can set our own custom limit
  const uselessProvider = generateProvider({
    providerType,
    network,
    apiKey,
  }) as providers.UrlJsonRpcProvider;
  const connection = {
    ...uselessProvider.connection,
    throttleLimit: 3, // default is 12 which may retry 12 times for 2 minutes on 429 failures
  };
  return new providers.StaticJsonRpcProvider(connection, network);
};

// getProvider is a function to get an existing provider or to get a Default provider, when given the options
export const getProvider = (options: VerificationBuilderOptions): providers.Provider => {
  return options.provider ?? getDefaultProvider(options);
};

/**
 * Generate Provider generates a provider based on the defined options or your env var, if no options or env var was detected, it will generate a provider based on the default values.
 * Generate Provider using the following options: (if no option is specified it will use the default values)
 * @param {Object} ProviderDetails - Details to use for the function to successfully generate a provider.
 * @param {string} ProviderDetails.network - The network in which the provider is connected to, i.e. "homestead", "mainnet", "ropsten", "rinkeby"
 * @param {string} ProviderDetails.providerType - Specify which provider to use: "infura", "alchemy" or "jsonrpc"
 * @param {string} ProviderDetails.url - Specify which url for JsonRPC to connect to, if not specified will connect to localhost:8545
 * @param {string} ProviderDetails.apiKey - If no apiKey is provided, a default shared API key will be used, which may result in reduced performance and throttled requests.
 */
export const generateProvider = (
  options?: ProviderDetails
): (providers.JsonRpcProvider & { apiKey?: never }) | providers.InfuraProvider | providers.AlchemyProvider => {
  if (!!options && Object.keys(options).length === 1 && options.apiKey) {
    throw new Error(
      "We could not link the apiKey provided to a provider, please state the provider to use in the parameter."
    );
  }

  const network = options?.network || process.env.PROVIDER_NETWORK || "homestead";
  const provider = options?.providerType || process.env.PROVIDER_ENDPOINT_TYPE || "infura";
  const url = options?.url || process.env.PROVIDER_ENDPOINT_URL || "";
  const apiKey =
    options?.apiKey || (provider === "infura" && process.env.INFURA_API_KEY) || process.env.PROVIDER_API_KEY || "";
  !apiKey &&
    console.warn(
      "You are using oa-verify default configuration for provider, which is not suitable for production environment. Please make sure that you configured the library correctly."
    );

  if (!!options && Object.keys(options).length === 1 && url) {
    return new providers.JsonRpcProvider(url);
  }
  switch (provider) {
    case "infura":
      return apiKey ? new providers.InfuraProvider(network, apiKey) : new providers.InfuraProvider(network);

    case "alchemy":
      return apiKey ? new providers.AlchemyProvider(network, apiKey) : new providers.AlchemyProvider(network);

    case "jsonrpc":
      return new providers.JsonRpcProvider(url);

    default:
      throw new Error(
        "The provider provided is not on the list of providers. Please use one of the following: infura, alchemy or jsonrpc."
      );
  }
};

/**
 * Simple typed utility to return a fragment depending on the name
 * @param name
 */
export const getFragmentByName = <ReturnedFragment extends VerificationFragment>(name: string) => <
  Fragment extends VerificationFragment
>(
  fragments: Fragment[]
): ReturnedFragment | undefined => fragments.find((fragment) => fragment.name === name) as ReturnedFragment | undefined;
export const getOpenAttestationHashFragment = getFragmentByName<OpenAttestationHashVerificationFragment>(
  "OpenAttestationHash"
);
export const getOpenAttestationDidSignedDocumentStatusFragment = getFragmentByName<OpenAttestationDidSignedDocumentStatusVerificationFragment>(
  "OpenAttestationDidSignedDocumentStatus"
);
export const getOpenAttestationEthereumDocumentStoreStatusFragment = getFragmentByName<OpenAttestationEthereumDocumentStoreStatusFragment>(
  "OpenAttestationEthereumDocumentStoreStatus"
);
export const getOpenAttestationEthereumTokenRegistryStatusFragment = getFragmentByName<OpenAttestationEthereumTokenRegistryStatusFragment>(
  "OpenAttestationEthereumTokenRegistryStatus"
);
export const getOpenAttestationDidIdentityProofFragment = getFragmentByName<OpenAttestationDidIdentityProofVerificationFragment>(
  "OpenAttestationDidIdentityProof"
);
export const getOpenAttestationDnsDidIdentityProofFragment = getFragmentByName<OpenAttestationDnsDidIdentityProofVerificationFragment>(
  "OpenAttestationDnsDidIdentityProof"
);
export const getOpenAttestationDnsTxtIdentityProofFragment = getFragmentByName<OpenAttestationDnsTxtIdentityProofVerificationFragment>(
  "OpenAttestationDnsTxtIdentityProof"
);

/**
 * Simple typed utility to return fragments depending on the type
 */
const getFragmentByType = <T extends VerificationFragmentType>(type: T) => <Fragment extends VerificationFragment>(
  fragments: Fragment[]
): (Fragment & { type: T })[] => fragments.filter((fragment) => fragment.type === type) as (Fragment & { type: T })[];

export const getDocumentIntegrityFragments = getFragmentByType("DOCUMENT_INTEGRITY");
export const getDocumentStatusFragments = getFragmentByType("DOCUMENT_STATUS");
export const getIssuerIdentityFragments = getFragmentByType("ISSUER_IDENTITY");

/**
 * type utilities and guard to get fragment depending on the status
 */
type ValidFragment<Type> = Type extends { status: "VALID" } ? Type : never;
type InvalidFragment<Type> = Type extends { status: "INVALID" } ? Type : never;
type SkippedFragment<Type> = Type extends { status: "SKIPPED" } ? Type : never;
type ErrorFragment<Type> = Type extends { status: "ERROR" } ? Type : never;
export const isValidFragment = <Fragment extends VerificationFragment>(
  fragment: Fragment | undefined
): fragment is ValidFragment<Fragment> => {
  return fragment?.status === "VALID";
};
export const isInvalidFragment = <Fragment extends VerificationFragment>(
  fragment: Fragment | undefined
): fragment is InvalidFragment<Fragment> => {
  return fragment?.status === "INVALID";
};
export const isSkippedFragment = <Fragment extends VerificationFragment>(
  fragment: Fragment | undefined
): fragment is SkippedFragment<Fragment> => {
  return fragment?.status === "SKIPPED";
};
export const isErrorFragment = <Fragment extends VerificationFragment>(
  fragment: Fragment | undefined
): fragment is ErrorFragment<Fragment> => {
  return fragment?.status === "ERROR";
};
