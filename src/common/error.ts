export class CodedError extends Error {
  code: number;

  codeString: string;

  constructor(message: string, code: number, codeString: string) {
    super(message);
    this.code = code;
    this.codeString = codeString;
  }
}
