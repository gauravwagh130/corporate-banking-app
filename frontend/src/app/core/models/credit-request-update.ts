import { CreditRequestStatus } from './credit-request-status';

export interface CreditRequestUpdate {
  status:  CreditRequestStatus;
  remarks:  string;
}