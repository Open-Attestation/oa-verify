import { v2, v3, WrappedDocument } from "@govtechsg/open-attestation";
import { VerificationManagerOptions, Verifier } from "../../types/core";
export interface Identity {
    status: "VALID" | "INVALID" | "SKIPPED";
    location?: string;
    value?: string;
}
export declare const openAttestationDnsTxt: Verifier<WrappedDocument<v2.OpenAttestationDocument> | WrappedDocument<v3.OpenAttestationDocument>, VerificationManagerOptions, Identity | Identity[]>;
