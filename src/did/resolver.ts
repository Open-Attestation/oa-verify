import { DIDDocument, Resolver, ResolverRegistry, VerificationMethod } from "did-resolver";
import { getResolver as ethrGetResolver } from "ethr-did-resolver";
import { getResolver as webGetResolver } from "web-did-resolver";
import NodeCache from "node-cache";
import { INFURA_API_KEY } from "../config";
import { generateProvider } from "../common/utils";

export interface EthrResolverConfig {
  networks: Array<{
    name: string;
    registry?: string;
    rpcUrl: string;
  }>;
}

export const getProviderConfig = () => {
  const provider = generateProvider() as any;
  const rpcUrl = provider?.connection?.url || "";
  const networkName = provider?._network?.name === "homestead" ? "mainnet" : provider?._network?.name || "";

  if (!rpcUrl || !networkName) {
    return { networks: [{ name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}` }] };
  }

  return {
    networks: [{ name: networkName, rpcUrl: rpcUrl }],
  };
};

const didResolutionCache = new NodeCache({ stdTTL: 5 * 60 }); // 5 min

const defaultResolver = new Resolver({
  ...ethrGetResolver(getProviderConfig()),
  ...webGetResolver(),
} as ResolverRegistry);

export const createResolver = ({ ethrResolverConfig }: { ethrResolverConfig?: EthrResolverConfig }): Resolver => {
  return ethrResolverConfig
    ? new Resolver({ ...ethrGetResolver(ethrResolverConfig), ...webGetResolver() } as ResolverRegistry)
    : defaultResolver;
};

export const resolve = async (didUrl: string, resolver?: Resolver): Promise<DIDDocument | undefined> => {
  const cachedResult = didResolutionCache.get<DIDDocument>(didUrl);
  if (cachedResult) return cachedResult;
  const didResolutionResult = resolver ? await resolver.resolve(didUrl) : await defaultResolver.resolve(didUrl);
  const did = didResolutionResult.didDocument || undefined;
  didResolutionCache.set(didUrl, did);
  return did;
};

export const getVerificationMethod = async (
  did: string,
  key: string,
  resolver?: Resolver
): Promise<VerificationMethod | undefined> => {
  const didDocument = await resolve(did, resolver);
  if (!didDocument) return;
  return didDocument.verificationMethod?.find((k) => k.id.toLowerCase() === key.toLowerCase());
};
