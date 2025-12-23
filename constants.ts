import { Beneficiary } from './types';

export const COLORS = {
  primary: '#003D7E', // Unimoni Deep Navy
  secondary: '#00ADEF', // Unimoni Bright Cyan
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
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Siti Aminah',
    country: 'Indonesia',
    accountNumber: '**** 1234',
    bankName: 'Bank Central Asia',
    currency: 'IDR',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Juan Dela Cruz',
    country: 'Philippines',
    accountNumber: '**** 9012',
    bankName: 'BDO Unibank',
    currency: 'PHP',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    country: 'Egypt',
    accountNumber: '**** 3456',
    bankName: 'National Bank of Egypt',
    currency: 'EGP',
    avatar: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=400&h=400&fit=crop'
  }
];

// Updated rates relative to 1 OMR (Oman Rial)
export const EXCHANGE_RATES: Record<string, number> = {
  INR: 217.45,
  IDR: 40550.00,
  PHP: 145.80,
  EGP: 126.35
};