
import { Institution as DBInstitution, Transaction as DBTransaction } from '@/hooks/useSupabaseData';
import { Institution, Transaction, ConsolidationData } from '@/types/financial';

export const processInstitutionData = (
  institutions: DBInstitution[], 
  transactions: any[]
): Institution[] => {
  return institutions.map(inst => {
    const instTransactions = transactions.filter(t => t.institution_id === inst.id);
    const income = instTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = instTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      id: inst.id,
      name: inst.name,
      type: inst.type,
      balance: income - expense,
      income,
      expense,
      color: inst.color || 'bg-blue-500',
    };
  });
};

export const processTransactionData = (transactions: any[]): Transaction[] => {
  return transactions.map(t => ({
    id: t.id,
    institutionId: t.institution_id,
    institutionName: (t.institutions as any)?.name || 'Unknown',
    type: t.type as 'income' | 'expense',
    amount: Number(t.amount),
    description: t.description,
    category: t.category,
    date: t.date,
  }));
};

export const generateConsolidationData = (
  institutions: Institution[], 
  transactions: Transaction[]
): ConsolidationData => {
  return {
    totalBalance: institutions.reduce((sum, inst) => sum + inst.balance, 0),
    totalIncome: institutions.reduce((sum, inst) => sum + inst.income, 0),
    totalExpense: institutions.reduce((sum, inst) => sum + inst.expense, 0),
    institutions,
    recentTransactions: transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10),
  };
};
