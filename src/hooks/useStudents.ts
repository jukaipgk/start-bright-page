
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  student_id: string;
  full_name: string;
  class_grade: string;
  institution_id: string;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated';
  created_at: string;
  updated_at: string;
  institutions?: { name: string };
}

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          institutions(name)
        `)
        .order('full_name');
      
      if (error) throw error;
      return data as Student[];
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Berhasil",
        description: "Data siswa berhasil ditambahkan",
      });
    },
    onError: (error) => {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan data siswa",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...student }: Partial<Student> & { id: string }) => {
      const { data, error } = await supabase
        .from('students')
        .update(student)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Berhasil",
        description: "Data siswa berhasil diperbarui",
      });
    },
    onError: (error) => {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui data siswa",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Berhasil",
        description: "Data siswa berhasil dihapus",
      });
    },
    onError: (error) => {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus data siswa",
        variant: "destructive",
      });
    },
  });
};
