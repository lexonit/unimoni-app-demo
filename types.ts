
export enum FlowStep {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  OTP = 'OTP',
  BENEFICIARY = 'BENEFICIARY',
  AMOUNT = 'AMOUNT',
  REVIEW = 'REVIEW',
  SUCCESS = 'SUCCESS'
}

export interface Beneficiary {
  id: string;
  name: string;
  country: string;
  accountNumber: string;
  bankName: string;
  currency: string;
  avatar: string;
}

export interface TransferDetails {
  beneficiary: Beneficiary | null;
  amount: number;
  exchangeRate: number;
  fee: number;
  totalPayable: number;
  receiverGets: number;
}
