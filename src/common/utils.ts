import { providers, Signer } from "ethers";
import {
  VerificationBuilderOptions,
  VerificationBuilderOptionsWithNetwork,
  VerificationFragment,
  VerificationFragmentType,
  ProviderDetails,
} from "../types/core";
import { INFURA_API_KEY, ALCHEMY_API_KEY, ETHERSCAN_API_KEY } from "../config";
import { OpenAttestationHashVerificationFragment } from "../verifiers/documentIntegrity/hash/openAttestationHash.type";
import { OpenAttestationDidSignedDocumentStatusVerificationFragment } from "../verifiers/documentStatus/didSigned/didSignedDocumentStatus.type";
import { OpenAttestationEthereumDocumentStoreStatusFragment } from "../verifiers/documentStatus/documentStore/ethereumDocumentStoreStatus.type";
import { OpenAttestationEthereumTokenRegistryStatusFragment } from "../verifiers/documentStatus/tokenRegistry/ethereumTokenRegistryStatus.type";
import { OpenAttestationDidIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/did/didIdentityProof.type";
import { OpenAttestationDnsDidIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/dnsDid/dnsDidProof.type";
import { OpenAttestationDnsTxtIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/dnsTxt/openAttestationDnsTxt.type";

export const getDefaultProvider = (options: VerificationBuilderOptionsWithNetwork): providers.Provider => {
  // create infura provider to get connection information
  // we then use StaticJsonRpcProvider so that we can set our own custom limit
  const uselessProvider = new providers.InfuraProvider(options.network, INFURA_API_KEY);
  const connection = {
    ...uselessProvider.connection,
    throttleLimit: 3, // default is 12 which may retry 12 times for 2 minutes on 429 failures
  };
  return new providers.StaticJsonRpcProvider(connection, options.network);
};

export const getProvider = (options: VerificationBuilderOptions): providers.Provider => {
  return options.provider ?? getDefaultProvider(options);
};

export const generateProvider = (options?: ProviderDetails): providers.Provider | Signer => {
  if (!!options && Object.keys(options).length === 1 && options.apiKey) {
    throw new Error(
      "We could link the apiKey provided to a provider, please state the provider to use in the parameter."
    );
  }

  const network = options?.network || process.env.NETWORK || "homestead";
  const provider = options?.provider || "infura";
  const url = options?.url || "";

  if (!!options && Object.keys(options).length === 1 && url) {
    return new providers.JsonRpcProvider(url);
  }

  let apiKey = "";

  switch (provider) {
    case "infura":
      apiKey = options?.apiKey || process.env.INFURA_API_KEY || INFURA_API_KEY;
      return new providers.InfuraProvider(network, apiKey);

    case "etherscan":
      apiKey = options?.apiKey || process.env.ETHERSCAN_API_KEY || ETHERSCAN_API_KEY;
      return new providers.EtherscanProvider(network, apiKey);

    case "alchemy":
      apiKey = options?.apiKey || process.env.ALCHEMY_API_KEY || ALCHEMY_API_KEY;
      return new providers.AlchemyProvider(network, apiKey);

    case "jsonrpc":
      return new providers.JsonRpcProvider(url);
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
