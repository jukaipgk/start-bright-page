
import { Institution, Transaction, ConsolidationData } from '@/types/financial';

export const institutions: Institution[] = [
  {
    id: '1',
    name: 'TK Al-Hidayah',
    type: 'TK',
    balance: 125000000,
    income: 85000000,
    expense: 45000000,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'SD Al-Hidayah',
    type: 'SD',
    balance: 340000000,
    income: 220000000,
    expense: 165000000,
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'SMP Al-Hidayah',
    type: 'SMP',
    balance: 285000000,
    income: 190000000,
    expense: 140000000,
    color: 'bg-yellow-500'
  },
  {
    id: '4',
    name: 'SMA Al-Hidayah',
    type: 'SMA',
    balance: 420000000,
    income: 280000000,
    expense: 195000000,
    color: 'bg-purple-500'
  },
  {
    id: '5',
    name: 'MTQ Al-Hidayah',
    type: 'MTQ',
    balance: 95000000,
    income: 65000000,
    expense: 35000000,
    color: 'bg-orange-500'
  },
  {
    id: '6',
    name: 'Unit Kewirausahaan',
    type: 'KEWIRAUSAHAAN',
    balance: 180000000,
    income: 150000000,
    expense: 85000000,
    color: 'bg-red-500'
  }
];

export const transactions: Transaction[] = [
  {
    id: '1',
    institutionId: '2',
    institutionName: 'SD Al-Hidayah',
    type: 'income',
    amount: 25000000,
    description: 'SPP Bulan Januari',
    category: 'SPP',
    date: '2024-01-15'
  },
  {
    id: '2',
    institutionId: '4',
    institutionName: 'SMA Al-Hidayah',
    type: 'expense',
    amount: 15000000,
    description: 'Gaji Guru',
    category: 'Gaji',
    date: '2024-01-10'
  },
  {
    id: '3',
    institutionId: '1',
    institutionName: 'TK Al-Hidayah',
    type: 'income',
    amount: 12000000,
    description: 'Uang Pangkal Siswa Baru',
    category: 'Uang Pangkal',
    date: '2024-01-08'
  },
  {
    id: '4',
    institutionId: '6',
    institutionName: 'Unit Kewirausahaan',
    type: 'income',
    amount: 8000000,
    description: 'Penjualan Produk Kantin',
    category: 'Penjualan',
    date: '2024-01-12'
  },
  {
    id: '5',
    institutionId: '3',
    institutionName: 'SMP Al-Hidayah',
    type: 'expense',
    amount: 5000000,
    description: 'Pembelian Alat Tulis',
    category: 'Operasional',
    date: '2024-01-14'
  }
];

export const getConsolidationData = (): ConsolidationData => {
  const totalBalance = institutions.reduce((sum, inst) => sum + inst.balance, 0);
  const totalIncome = institutions.reduce((sum, inst) => sum + inst.income, 0);
  const totalExpense = institutions.reduce((sum, inst) => sum + inst.expense, 0);

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    institutions,
    recentTransactions: transactions.slice(0, 5)
  };
};
