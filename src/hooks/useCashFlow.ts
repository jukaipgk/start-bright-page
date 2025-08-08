
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CashAccount {
  id: string;
  account_name: string;
  account_type: 'cash' | 'bank' | 'savings';
  institution_id: string;
  account_number?: string;
  bank_name?: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CashFlow {
  id: string;
  cash_account_id: string;
  transaction_type: 'inflow' | 'outflow' | 'transfer';
  amount: number;
  description: string;
  reference_number?: string;
  transaction_date: string;
  category?: string;
  related_transaction_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  cash_accounts?: CashAccount;
}

export const useCashAccounts = () => {
  return useQuery({
    queryKey: ['cash-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_accounts')
        .select('*')
        .eq('is_active', true)
        .order('account_name');
      
      if (error) throw error;
      return data as CashAccount[];
    },
  });
};

export const useCashFlows = () => {
  return useQuery({
    queryKey: ['cash-flows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_flows')
        .select(`
          *,
          cash_accounts(account_name, account_type)
        `)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as CashFlow[];
    },
  });
};

export const useCreateCashAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (account: Omit<CashAccount, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cash_accounts')
        .insert([account])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-accounts'] });
      toast({
        title: "Berhasil",
        description: "Akun kas berhasil dibuat",
      });
    },
    onError: (error) => {
      console.error('Error creating cash account:', error);
      toast({
        title: "Error",
        description: "Gagal membuat akun kas",
        variant: "destructive",
      });
    },
  });
};

export const useCreateCashFlow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cashFlow: Omit<CashFlow, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cash_flows')
        .insert([cashFlow])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-flows'] });
      queryClient.invalidateQueries({ queryKey: ['cash-accounts'] });
      toast({
        title: "Berhasil",
        description: "Transaksi kas berhasil dicatat",
      });
    },
    onError: (error) => {
      console.error('Error creating cash flow:', error);
      toast({
        title: "Error",
        description: "Gagal mencatat transaksi kas",
        variant: "destructive",
      });
    },
  });
};
