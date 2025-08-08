
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInstitutions } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Building2, Plus } from 'lucide-react';

const INSTITUTION_TYPES = [
  { value: 'TK', label: 'TK (Taman Kanak-kanak)' },
  { value: 'SD', label: 'SD (Sekolah Dasar)' },
  { value: 'SMP', label: 'SMP (Sekolah Menengah Pertama)' },
  { value: 'SMA', label: 'SMA (Sekolah Menengah Atas)' },
  { value: 'MTQ', label: 'MTQ (Madrasah Tahfidz Al-Quran)' },
  { value: 'KEWIRAUSAHAAN', label: 'Unit Kewirausahaan' },
];

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F97316', '#EF4444',
  '#6366F1', '#06B6D4', '#84CC16', '#F43F5E'
];

export const InstitutionManagement: React.FC = () => {
  const { data: institutions = [], isLoading, refetch } = useInstitutions();
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: '' as any,
    description: '',
    color: COLORS[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast({
        title: "Error",
        description: "Nama dan tipe lembaga harus diisi",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('institutions')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Lembaga berhasil ditambahkan",
      });

      // Reset form
      setFormData({
        name: '',
        type: '',
        description: '',
        color: COLORS[0],
      });
      setIsAdding(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan lembaga",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Manajemen Lembaga</h3>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Lembaga
        </Button>
      </div>

      {/* Add Institution Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Lembaga Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lembaga</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: SD Al-Hidayah"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipe Lembaga</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe lembaga" />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTITUTION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi singkat tentang lembaga"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Warna</Label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({
                      name: '',
                      type: '',
                      description: '',
                      color: COLORS[0],
                    });
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Institutions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Daftar Lembaga ({institutions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : institutions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada lembaga yang terdaftar
            </div>
          ) : (
            <div className="space-y-3">
              {institutions.map((institution) => (
                <div 
                  key={institution.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: institution.color || '#3B82F6' }}
                    />
                    <div>
                      <h4 className="font-medium">{institution.name}</h4>
                      <p className="text-sm text-gray-600">
                        {institution.type} • {institution.description || 'Tidak ada deskripsi'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
