import { CreditRequestStatus } from './credit-request-status';

export interface CreditRequest {
  id: string;
  clientId: string;
  submittedBy: string;
  requestAmount: number;
  tenureMonths: number;
  purpose: string;
  status: CreditRequestStatus;
  remarks: string;
  createdAt: string;
}