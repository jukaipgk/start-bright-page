
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SPPStructure {
  id: string;
  institution_id: string;
  class_grade: string;
  monthly_amount: number;
  academic_year: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SPPPayment {
  id: string;
  student_id: string;
  spp_structure_id: string;
  payment_month: number;
  payment_year: number;
  amount_paid: number;
  payment_date: string;
  payment_method: 'cash' | 'transfer' | 'other';
  receipt_number?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  students?: { full_name: string; student_id: string };
  spp_structure?: SPPStructure;
}

export const useSPPStructure = () => {
  return useQuery({
    queryKey: ['spp-structure'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spp_structure')
        .select('*')
        .eq('is_active', true)
        .order('academic_year', { ascending: false });
      
      if (error) throw error;
      return data as SPPStructure[];
    },
  });
};

export const useSPPPayments = () => {
  return useQuery({
    queryKey: ['spp-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spp_payments')
        .select(`
          *,
          students(full_name, student_id),
          spp_structure(*)
        `)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data as SPPPayment[];
    },
  });
};

export const useCreateSPPPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payment: Omit<SPPPayment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('spp_payments')
        .insert([payment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spp-payments'] });
      toast({
        title: "Berhasil",
        description: "Pembayaran SPP berhasil dicatat",
      });
    },
    onError: (error) => {
      console.error('Error creating SPP payment:', error);
      toast({
        title: "Error",
        description: "Gagal mencatat pembayaran SPP",
        variant: "destructive",
      });
    },
  });
};

export const useCreateSPPStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (structure: Omit<SPPStructure, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('spp_structure')
        .insert([structure])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spp-structure'] });
      toast({
        title: "Berhasil",
        description: "Struktur SPP berhasil dibuat",
      });
    },
    onError: (error) => {
      console.error('Error creating SPP structure:', error);
      toast({
        title: "Error",
        description: "Gagal membuat struktur SPP",
        variant: "destructive",
      });
    },
  });
};
