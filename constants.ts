
import { Beneficiary } from './types';

export const COLORS = {
  primary: '#0055A4', // Unimoni deep blue
  secondary: '#00A3E0', // Unimoni bright blue
  accent: '#F2A900', // Gold accent
  bg: '#F8FAFC'
};

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    country: 'India',
    accountNumber: '**** 5678',
    bankName: 'HDFC Bank',
    currency: 'INR',
    avatar: 'https://picsum.photos/seed/rahul/100/100'
  },
  {
    id: '2',
    name: 'Siti Aminah',
    country: 'Indonesia',
    accountNumber: '**** 1234',
    bankName: 'Bank Central Asia',
    currency: 'IDR',
    avatar: 'https://picsum.photos/seed/siti/100/100'
  },
  {
    id: '3',
    name: 'Juan Dela Cruz',
    country: 'Philippines',
    accountNumber: '**** 9012',
    bankName: 'BDO Unibank',
    currency: 'PHP',
    avatar: 'https://picsum.photos/seed/juan/100/100'
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    country: 'Egypt',
    accountNumber: '**** 3456',
    bankName: 'National Bank of Egypt',
    currency: 'EGP',
    avatar: 'https://picsum.photos/seed/ahmed/100/100'
  }
];

export const EXCHANGE_RATES: Record<string, number> = {
  INR: 22.85,
  IDR: 4250.20,
  PHP: 15.30,
  EGP: 8.45
};
