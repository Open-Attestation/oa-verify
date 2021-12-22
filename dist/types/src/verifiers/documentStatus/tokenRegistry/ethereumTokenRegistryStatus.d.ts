import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { providers } from "ethers";
import { Verifier } from "../../../types/core";
import { InvalidTokenRegistryStatus, OpenAttestationEthereumTokenRegistryStatusFragment, ValidTokenRegistryStatus } from "./ethereumTokenRegistryStatus.type";
export declare const getTokenRegistry: (document: WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>) => string;
export declare const isTokenMintedOnRegistry: ({ tokenRegistry, merkleRoot, provider, }: {
    tokenRegistry: string;
    merkleRoot: string;
    provider: providers.Provider;
}) => Promise<ValidTokenRegistryStatus | InvalidTokenRegistryStatus>;
export declare const openAttestationEthereumTokenRegistryStatus: Verifier<OpenAttestationEthereumTokenRegistryStatusFragment>;
