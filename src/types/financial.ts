
export interface Institution {
  id: string;
  name: string;
  type: 'TK' | 'SD' | 'SMP' | 'SMA' | 'MTQ' | 'KEWIRAUSAHAAN';
  balance: number;
  income: number;
  expense: number;
  color: string;
}

export interface Transaction {
  id: string;
  institutionId: string;
  institutionName: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface ConsolidationData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  institutions: Institution[];
  recentTransactions: Transaction[];
}
