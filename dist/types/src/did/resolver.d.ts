import { DIDDocument, Resolver, VerificationMethod } from "did-resolver";
export interface EthrResolverConfig {
    networks: Array<{
        name: string;
        registry?: string;
        rpcUrl: string;
    }>;
}
export declare const getProviderConfig: () => {
    networks: {
        name: any;
        rpcUrl: any;
    }[];
};
export declare const createResolver: ({ ethrResolverConfig }: {
    ethrResolverConfig?: EthrResolverConfig | undefined;
}) => Resolver;
export declare const resolve: (didUrl: string, resolver?: Resolver | undefined) => Promise<DIDDocument | undefined>;
export declare const getVerificationMethod: (did: string, key: string, resolver?: Resolver | undefined) => Promise<VerificationMethod | undefined>;
