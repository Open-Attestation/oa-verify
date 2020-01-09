export interface Identity {
  identified: true;
  ethereumAddress: string;
  smartContract: string;
}

export interface DIDDocument {
  "@context": "https://w3id.org/did/v1";
  id: string;
  publicKey: PublicKey[];
  authentication?: Authentication[];
  uportProfile?: any;
  service?: ServiceEndpoint[];
  created?: string;
  updated?: string;
  proof?: LinkedDataProof;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
  description?: string;
}

export interface PublicKey {
  id: string;
  type: string;
  owner: string;
  ethereumAddress?: string;
  publicKeyBase64?: string;
  publicKeyBase58?: string;
  publicKeyHex?: string;
  publicKeyPem?: string;
}

export interface Authentication {
  type: string;
  publicKey: string[];
}

export interface LinkedDataProof {
  type: string;
  created: string;
  creator: string;
  nonce: string;
  signatureValue: string;
}

export interface Params {
  [index: string]: string;
}

export interface ParsedDID {
  did: string;
  didUrl: string;
  method: string;
  id: string;
  path?: string;
  fragment?: string;
  query?: string;
  params?: Params;
}
