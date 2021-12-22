import { VerificationMethod, Resolver } from "did-resolver";
import { Literal, Record, Static, String, Union, Array as RunTypesArray } from "runtypes";
export declare const ValidDidVerificationStatus: Record<{
    verified: Literal<true>;
    did: String;
}, false>;
export declare type ValidDidVerificationStatus = Static<typeof ValidDidVerificationStatus>;
export declare const ValidDidVerificationStatusArray: import("runtypes").Constraint<RunTypesArray<Record<{
    verified: Literal<true>;
    did: String;
}, false>, false>, {
    did: string;
    verified: true;
}[], unknown>;
export declare type ValidDidVerificationStatusArray = Static<typeof ValidDidVerificationStatusArray>;
export declare const InvalidDidVerificationStatus: Record<{
    verified: Literal<false>;
    did: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>;
export declare type InvalidDidVerificationStatus = Static<typeof InvalidDidVerificationStatus>;
export declare const DidVerificationStatus: Union<[Record<{
    verified: Literal<true>;
    did: String;
}, false>, Record<{
    verified: Literal<false>;
    did: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>]>;
export declare type DidVerificationStatus = Static<typeof DidVerificationStatus>;
export declare const DidVerificationStatusArray: RunTypesArray<Union<[Record<{
    verified: Literal<true>;
    did: String;
}, false>, Record<{
    verified: Literal<false>;
    did: String;
    reason: Record<{
        code: import("runtypes").Number;
        codeString: String;
        message: String;
    }, false>;
}, false>]>, false>;
export declare type DidVerificationStatusArray = Static<typeof DidVerificationStatusArray>;
interface VerifySignature {
    did: string;
    signature: string;
    merkleRoot: string;
    verificationMethod: VerificationMethod;
}
export declare const verifySecp256k1VerificationKey2018: ({ did, verificationMethod, merkleRoot, signature, }: VerifySignature) => DidVerificationStatus;
export declare const verifySignature: ({ key, merkleRoot, signature, did, resolver, }: {
    key: string;
    merkleRoot: string;
    did: string;
    signature: string;
    resolver?: Resolver | undefined;
}) => Promise<DidVerificationStatus>;
export {};
