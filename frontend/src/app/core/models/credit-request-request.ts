export interface CreditRequestRequest {
  clientId: string;
  requestAmount: number;
  tenureMonths: number;
  purpose: string;
}
