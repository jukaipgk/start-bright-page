
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  item_code: string;
  item_name: string;
  category?: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  unit_price: number;
  institution_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  inventory_item_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit_price?: number;
  total_value?: number;
  reference_number?: string;
  notes?: string;
  transaction_date: string;
  created_by?: string;
  created_at: string;
  inventory_items?: InventoryItem;
}

export const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('is_active', true)
        .order('item_name');
      
      if (error) throw error;
      return data as InventoryItem[];
    },
  });
};

export const useInventoryMovements = () => {
  return useQuery({
    queryKey: ['inventory-movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          inventory_items(item_code, item_name, unit)
        `)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as InventoryMovement[];
    },
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast({
        title: "Berhasil",
        description: "Item inventori berhasil ditambahkan",
      });
    },
    onError: (error) => {
      console.error('Error creating inventory item:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan item inventori",
        variant: "destructive",
      });
    },
  });
};

export const useCreateInventoryMovement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (movement: Omit<InventoryMovement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .insert([movement])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-movements'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast({
        title: "Berhasil",
        description: "Pergerakan inventori berhasil dicatat",
      });
    },
    onError: (error) => {
      console.error('Error creating inventory movement:', error);
      toast({
        title: "Error",
        description: "Gagal mencatat pergerakan inventori",
        variant: "destructive",
      });
    },
  });
};
