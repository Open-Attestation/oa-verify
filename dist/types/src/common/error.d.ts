export declare class CodedError extends Error {
    code: number;
    codeString: string;
    constructor(message: string, code: number, codeString: string);
}
