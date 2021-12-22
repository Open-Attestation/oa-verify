import { AllVerificationFragment } from "./types/core";
export declare const getIdentifier: <T extends AllVerificationFragment<unknown>>(fragments: T[]) => {
    identifier: string | undefined;
    type: string;
}[] | {
    identifier: string | undefined;
    type: string;
};
