
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '@/hooks/useStudents';
import { useInstitutions } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const StudentManagement = () => {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: institutions } = useInstitutions();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    class_grade: '',
    institution_id: '',
    parent_name: '',
    parent_phone: '',
    address: '',
    status: 'active' as const,
  });

  const resetForm = () => {
    setFormData({
      student_id: '',
      full_name: '',
      class_grade: '',
      institution_id: '',
      parent_name: '',
      parent_phone: '',
      address: '',
      status: 'active',
    });
    setEditingStudent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStudent) {
      updateStudent.mutate({
        id: editingStudent.id,
        ...formData,
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    } else {
      createStudent.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id,
      full_name: student.full_name,
      class_grade: student.class_grade,
      institution_id: student.institution_id,
      parent_name: student.parent_name || '',
      parent_phone: student.parent_phone || '',
      address: student.address || '',
      status: student.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      deleteStudent.mutate(id);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'graduated': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Siswa</h1>
          <p className="text-muted-foreground">Kelola data siswa di semua institusi</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Siswa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Edit Siswa' : 'Tambah Siswa Baru'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student_id">NIS</Label>
                  <Input
                    id="student_id"
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Nama Lengkap</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class_grade">Kelas</Label>
                  <Input
                    id="class_grade"
                    value={formData.class_grade}
                    onChange={(e) => setFormData({ ...formData, class_grade: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="institution_id">Institusi</Label>
                  <Select
                    value={formData.institution_id}
                    onValueChange={(value) => setFormData({ ...formData, institution_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih institusi" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions?.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id}>
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parent_name">Nama Orang Tua</Label>
                  <Input
                    id="parent_name"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="parent_phone">No. HP Orang Tua</Label>
                  <Input
                    id="parent_phone"
                    value={formData.parent_phone}
                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    <SelectItem value="graduated">Lulus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createStudent.isPending || updateStudent.isPending}
                >
                  {editingStudent ? 'Update' : 'Simpan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Siswa</CardTitle>
          <CardDescription>
            Daftar semua siswa yang terdaftar di sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Institusi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell>{student.full_name}</TableCell>
                    <TableCell>{student.class_grade}</TableCell>
                    <TableCell>{student.institutions?.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(student.status)}>
                        {student.status === 'active' ? 'Aktif' :
                         student.status === 'inactive' ? 'Tidak Aktif' : 'Lulus'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
