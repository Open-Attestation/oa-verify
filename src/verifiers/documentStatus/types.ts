import { Reason } from "../../types/error";

interface ValidRevocationStatus {
  revoked: false;
  address: string;
}

export interface InvalidRevocationStatus {
  revoked: true;
  address: string;
  reason: Reason;
}

export interface IdentityRevocationStatus {
  revoked: boolean;
}

export type RevocationStatus = ValidRevocationStatus | InvalidRevocationStatus | IdentityRevocationStatus;