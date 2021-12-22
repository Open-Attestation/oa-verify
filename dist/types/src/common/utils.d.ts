import { providers } from "ethers";
import { VerificationBuilderOptions, VerificationBuilderOptionsWithNetwork, VerificationFragment, ProviderDetails } from "../types/core";
import { OpenAttestationHashVerificationFragment } from "../verifiers/documentIntegrity/hash/openAttestationHash.type";
import { OpenAttestationDidSignedDocumentStatusVerificationFragment } from "../verifiers/documentStatus/didSigned/didSignedDocumentStatus.type";
import { OpenAttestationEthereumDocumentStoreStatusFragment } from "../verifiers/documentStatus/documentStore/ethereumDocumentStoreStatus.type";
import { OpenAttestationEthereumTokenRegistryStatusFragment } from "../verifiers/documentStatus/tokenRegistry/ethereumTokenRegistryStatus.type";
import { OpenAttestationDidIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/did/didIdentityProof.type";
import { OpenAttestationDnsDidIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/dnsDid/dnsDidProof.type";
import { OpenAttestationDnsTxtIdentityProofVerificationFragment } from "../verifiers/issuerIdentity/dnsTxt/openAttestationDnsTxt.type";
export declare const getDefaultProvider: (options: VerificationBuilderOptionsWithNetwork) => providers.Provider;
export declare const getProvider: (options: VerificationBuilderOptions) => providers.Provider;
/**
 * Generate Provider generates a provider based on the defined options or your env var, if no options or env var was detected, it will generate a provider based on the default values.
 * Generate Provider using the following options: (if no option is specified it will use the default values)
 * @param {Object} ProviderDetails - Details to use for the function to successfully generate a provider.
 * @param {string} ProviderDetails.network - The network in which the provider is connected to, i.e. "homestead", "mainnet", "ropsten", "rinkeby"
 * @param {string} ProviderDetails.providerType - Specify which provider to use: "infura", "alchemy" or "jsonrpc"
 * @param {string} ProviderDetails.url - Specify which url for JsonRPC to connect to, if not specified will connect to localhost:8545
 * @param {string} ProviderDetails.apiKey - If no apiKey is provided, a default shared API key will be used, which may result in reduced performance and throttled requests.
 */
export declare const generateProvider: (options?: ProviderDetails | undefined) => providers.Provider;
/**
 * Simple typed utility to return a fragment depending on the name
 * @param name
 */
export declare const getFragmentByName: <ReturnedFragment extends VerificationFragment>(name: string) => <Fragment extends VerificationFragment>(fragments: Fragment[]) => ReturnedFragment | undefined;
export declare const getOpenAttestationHashFragment: <Fragment extends VerificationFragment>(fragments: Fragment[]) => OpenAttestationHashVerificationFragment | undefined;
export declare const getOpenAttestationDidSignedDocumentStatusFragment: <Fragment extends VerificationFragment>(fragments: Fragment[]) => OpenAttestationDidSignedDocumentStatusVerificationFragment | undefined;
export declare const getOpenAttestationEthereumDocumentStoreStatusFragment: <Fragment extends VerificationFragment>(fragments: Fragment[]) => OpenAttestationEthereumDocumentStoreStatusFragment | undefined;
export declare const getOpenAttestationEthereumTokenRegistryStatusFragment: <Fragment extends VerificationFragment>(fragments: Fragment[]) => OpenAttestationEthereumTokenRegistryStatusFragment | undefined;
export declare const getOpenAttestationDidIdentityProofFragment: <Fragment extends VerificationFragment>(fragments: Fragment[]) => OpenAttestationDidIdentityProofVerificationFragment | undefined;
export declare const getOpenAttestationDnsDidIdentityProofFragment: <Fragment extends VerificationFragment>(fragments: Fragment[]) => OpenAttestationDnsDidIdentityProofVerificationFragment | undefined;
export declare const getOpenAttestationDnsTxtIdentityProofFragment: <Fragment extends VerificationFragment>(fragments: Fragment[]) => OpenAttestationDnsTxtIdentityProofVerificationFragment | undefined;
export declare const getDocumentIntegrityFragments: <Fragment extends VerificationFragment>(fragments: Fragment[]) => (Fragment & {
    type: "DOCUMENT_INTEGRITY";
})[];
export declare const getDocumentStatusFragments: <Fragment extends VerificationFragment>(fragments: Fragment[]) => (Fragment & {
    type: "DOCUMENT_STATUS";
})[];
export declare const getIssuerIdentityFragments: <Fragment extends VerificationFragment>(fragments: Fragment[]) => (Fragment & {
    type: "ISSUER_IDENTITY";
})[];
/**
 * type utilities and guard to get fragment depending on the status
 */
declare type ValidFragment<Type> = Type extends {
    status: "VALID";
} ? Type : never;
declare type InvalidFragment<Type> = Type extends {
    status: "INVALID";
} ? Type : never;
declare type SkippedFragment<Type> = Type extends {
    status: "SKIPPED";
} ? Type : never;
declare type ErrorFragment<Type> = Type extends {
    status: "ERROR";
} ? Type : never;
export declare const isValidFragment: <Fragment extends VerificationFragment>(fragment: Fragment | undefined) => fragment is ValidFragment<Fragment>;
export declare const isInvalidFragment: <Fragment extends VerificationFragment>(fragment: Fragment | undefined) => fragment is InvalidFragment<Fragment>;
export declare const isSkippedFragment: <Fragment extends VerificationFragment>(fragment: Fragment | undefined) => fragment is SkippedFragment<Fragment>;
export declare const isErrorFragment: <Fragment extends VerificationFragment>(fragment: Fragment | undefined) => fragment is ErrorFragment<Fragment>;
export declare const isDocumentStoreAddressOrTokenRegistryAddressInvalid: (fragments: VerificationFragment[]) => boolean;
export declare const contractNotFound: (fragments: VerificationFragment[]) => boolean;
export declare const certificateNotIssued: (fragments: VerificationFragment[]) => boolean;
export declare const certificateRevoked: (fragments: VerificationFragment[]) => boolean;
export declare const invalidArgument: (fragments: VerificationFragment[]) => boolean;
export declare const serverError: (fragments: VerificationFragment[]) => boolean;
export declare const unhandledError: (fragments: VerificationFragment[]) => boolean;
export {};
