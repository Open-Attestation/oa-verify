import { Resolver, DIDDocument } from "did-resolver";
import { getResolver as ethrGetResolver } from "ethr-did-resolver";
import { getResolver as webGetResolver } from "web-did-resolver";
import { INFURA_API_KEY } from "../config";

const providerConfig = {
  networks: [{ name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}` }],
};

export const resolver = new Resolver({
  ...ethrGetResolver(providerConfig),
  ...webGetResolver(),
});

// TODO replace cache with timeout
const cache: { [didUrl: string]: DIDDocument } = {};

export const resolve = async (didUrl: string): Promise<DIDDocument> => {
  if (cache[didUrl]) return cache[didUrl];
  cache[didUrl] = await resolver.resolve(didUrl);
  return cache[didUrl];
};

export const getPublicKey = async (did: string, key: string) => {
  const { publicKey } = await resolve(did);
  return publicKey.find((k) => k.id.toLowerCase() === key.toLowerCase());
};
