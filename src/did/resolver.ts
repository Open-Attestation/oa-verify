import { Resolver, DIDDocument } from "did-resolver";
import { getResolver as ethrGetResolver } from "ethr-did-resolver";
import { getResolver as webGetResolver } from "web-did-resolver";
import NodeCache from "node-cache";
import { INFURA_API_KEY } from "../config";

const providerConfig = {
  networks: [{ name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}` }],
};

const didResolutionCache = new NodeCache({ stdTTL: 5 * 60 }); // 5 min

export const resolver = new Resolver({
  ...ethrGetResolver(providerConfig),
  ...webGetResolver(),
});

export const resolve = async (didUrl: string): Promise<DIDDocument> => {
  const cachedResult = didResolutionCache.get<DIDDocument>(didUrl);
  if (cachedResult) return cachedResult;
  const did = await resolver.resolve(didUrl);
  didResolutionCache.set(didUrl, did);
  return did;
};

export const getPublicKey = async (did: string, key: string) => {
  const { publicKey } = await resolve(did);
  return publicKey.find((k) => k.id.toLowerCase() === key.toLowerCase());
};
