export interface ClientRequest {
  companyName: string;
  industry: string;
  address: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  annualTurnover: number;
  documentsSubmitted: boolean;
}