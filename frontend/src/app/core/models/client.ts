export interface Client {
  id: string;
  companyName: string;
  industry: string;
  address: string;
  primaryContact:  {
    name: string;
    email: string;
    phone:  string;
  };
  annualTurnover: number;
  documentsSubmitted: boolean;
  rmId?: string;
}