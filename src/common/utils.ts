import { providers } from "ethers";
import { INFURA_API_KEY } from "../config";
import {
  ProviderDetails,
  providerType,
  VerificationBuilderOptions,
  VerificationBuilderOptionsWithNetwork,
  VerificationFragment,
  VerificationFragmentType,
} from "../types/core";
import {
  OpenAttestationEthereumDocumentStoreStatusCode,
  OpenAttestationEthereumTokenRegistryStatusCode,
} from "../types/error";
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
 * @param {string} ProviderDetails.network - The network in which the provider is connected to, i.e. "homestead", "mainnet", "goerli"
 * @param {string} ProviderDetails.providerType - Specify which provider to use: "infura", "alchemy" or "jsonrpc"
 * @param {string} ProviderDetails.url - Specify which url for JsonRPC to connect to, if not specified will connect to localhost:8545
 * @param {string} ProviderDetails.apiKey - If no apiKey is provided, a default shared API key will be used, which may result in reduced performance and throttled requests.
 */
export const generateProvider = (options?: ProviderDetails): providers.Provider => {
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

// this function check if the reason of the error is that the document store or token registry is invalid
export const isDocumentStoreAddressOrTokenRegistryAddressInvalid = (fragments: VerificationFragment[]): boolean => {
  const documentStoreIssuedFragment = getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
  const tokenRegistryMintedFragment = getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
  // 2 is the error code used by oa-verify in case of invalid address
  return (
    (documentStoreIssuedFragment?.reason?.code === OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED &&
      documentStoreIssuedFragment?.reason?.message.toLowerCase() === "Invalid document store address".toLowerCase()) ||
    (tokenRegistryMintedFragment?.reason?.code === OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED &&
      tokenRegistryMintedFragment?.reason?.message.toLowerCase() === "Invalid token registry address".toLowerCase())
  );
};

// this function check if the reason of the error is contract not found in document store
export const contractNotFound = (fragments: VerificationFragment[]): boolean => {
  const documentStoreIssuedFragment = getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
  // 404 is the error code used by oa-verify in case of contract not found
  return (
    documentStoreIssuedFragment?.reason?.code === OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED &&
    documentStoreIssuedFragment?.reason?.message.toLowerCase() === "Contract is not found".toLowerCase()
  );
};

// this function check if the reason of the error is that the document is not issued in document store or token registry
export const certificateNotIssued = (fragments: VerificationFragment[]): boolean => {
  const documentStoreIssuedFragment = getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
  const tokenRegistryMintedFragment = getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
  // 1 is the error code used by oa-verify in case of document / token not issued / minted
  return (
    documentStoreIssuedFragment?.reason?.code === OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED ||
    tokenRegistryMintedFragment?.reason?.code === OpenAttestationEthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED
  );
};

// this function check if the reason of the error is that the document is revoked in document store
export const certificateRevoked = (fragments: VerificationFragment[]): boolean => {
  const documentStoreIssuedFragment = getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
  // 1 is the error code used by oa-verify in case of document / token not issued / minted
  return documentStoreIssuedFragment?.reason?.code === OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_REVOKED;
};

// this function check if the error is caused by an invalid merkle root (incorrect length/odd length/invalid characters)
export const invalidArgument = (fragments: VerificationFragment[]): boolean => {
  const documentStoreIssuedFragment = getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
  const tokenRegistryMintedFragment = getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
  // why INVALID_ARGUMENT is because we follow the error codes returned by Ethers (https://docs.ethers.io/v5/api/utils/logger/#errors)
  return (
    (documentStoreIssuedFragment?.reason?.code === OpenAttestationEthereumDocumentStoreStatusCode.DOCUMENT_NOT_ISSUED &&
      documentStoreIssuedFragment?.reason?.message.toLowerCase() === "Invalid call arguments".toLowerCase()) ||
    (tokenRegistryMintedFragment?.reason?.code === OpenAttestationEthereumTokenRegistryStatusCode.INVALID_ARGUMENT &&
      tokenRegistryMintedFragment?.reason?.message.toLowerCase() === "Invalid contract arguments".toLowerCase())
  );
};

// this function check if the reason of the error is that we can't connect to Ethereum (due to any HTTP 4xx or 5xx errors)
export const serverError = (fragments: VerificationFragment[]): boolean => {
  const documentStoreIssuedFragment = getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
  const tokenRegistryMintedFragment = getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
  // 429 is the error code used by oa-verify in case of Ethers returning a missing response error
  return (
    documentStoreIssuedFragment?.reason?.code === OpenAttestationEthereumDocumentStoreStatusCode.SERVER_ERROR ||
    tokenRegistryMintedFragment?.reason?.code === OpenAttestationEthereumTokenRegistryStatusCode.SERVER_ERROR
  );
};

// this function catches all other unhandled errors
export const unhandledError = (fragments: VerificationFragment[]): boolean => {
  const documentStoreIssuedFragment = getOpenAttestationEthereumDocumentStoreStatusFragment(fragments);
  const tokenRegistryMintedFragment = getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);
  // 3 is the error code used by oa-verify in case of weird errors that we didn't foresee to handle
  return (
    documentStoreIssuedFragment?.reason?.code ===
      OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR ||
    tokenRegistryMintedFragment?.reason?.code === OpenAttestationEthereumDocumentStoreStatusCode.ETHERS_UNHANDLED_ERROR
  );
};
