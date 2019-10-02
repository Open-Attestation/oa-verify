import { Contract } from "ethers";
import { TYPES } from "./common/smartContract/constants";

export type Hash = string;

export interface Issuer {
  tokenRegistry?: Hash;
  certificateStore?: Hash;
  documentStore?: Hash;
}

export interface OpenAttestationContract {
  address: Hash;
  type: typeof TYPES.TOKEN_REGISTRY | typeof TYPES.DOCUMENT_STORE;
  instance: Contract;
}
