import { Resolver, DIDDocument } from "did-resolver";
import { getResolver as ethrGetResolver } from "ethr-did-resolver";
import { getResolver as webGetResolver } from "web-did-resolver";
import NodeCache from "node-cache";
import { INFURA_API_KEY } from "../config";

export interface EthrResolverConfig {
  networks: Array<{
    name: string;
    registry?: string;
    rpcUrl: string;
  }>;
}

const providerConfig = {
  networks: [{ name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}` }],
};

const didResolutionCache = new NodeCache({ stdTTL: 5 * 60 }); // 5 min

const defaultResolver = new Resolver({ ...ethrGetResolver(providerConfig), ...webGetResolver() });

export const createResolver = (ethrResolverConfig: EthrResolverConfig): Resolver => {
  return new Resolver({ ...ethrGetResolver(ethrResolverConfig), ...webGetResolver() });
};

export const resolve = async (didUrl: string, resolver?: Resolver): Promise<DIDDocument> => {
  const cachedResult = didResolutionCache.get<DIDDocument>(didUrl);
  if (cachedResult) return cachedResult;
  const did = resolver ? await resolver.resolve(didUrl) : await defaultResolver.resolve(didUrl);
  didResolutionCache.set(didUrl, did);
  return did;
};

export const getPublicKey = async (did: string, key: string, resolver?: Resolver) => {
  const { publicKey } = await resolve(did, resolver);
  return publicKey.find((k) => k.id.toLowerCase() === key.toLowerCase());
};
