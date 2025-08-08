
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSPPPayments, useSPPStructure, useCreateSPPPayment, useCreateSPPStructure } from '@/hooks/useSPPPayments';
import { useStudents } from '@/hooks/useStudents';
import { useInstitutions } from '@/hooks/useSupabaseData';
import { Plus, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const SPPManagement = () => {
  const { data: sppPayments } = useSPPPayments();
  const { data: sppStructure } = useSPPStructure();
  const { data: students } = useStudents();
  const { data: institutions } = useInstitutions();
  
  const createPayment = useCreateSPPPayment();
  const createStructure = useCreateSPPStructure();

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false);
  
  const [paymentForm, setPaymentForm] = useState({
    student_id: '',
    spp_structure_id: '',
    payment_month: '',
    payment_year: new Date().getFullYear().toString(),
    amount_paid: '',
    payment_method: 'cash' as const,
    receipt_number: '',
    notes: '',
  });

  const [structureForm, setStructureForm] = useState({
    institution_id: '',
    class_grade: '',
    monthly_amount: '',
    academic_year: '',
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPayment.mutate({
      ...paymentForm,
      payment_month: parseInt(paymentForm.payment_month),
      payment_year: parseInt(paymentForm.payment_year),
      amount_paid: parseFloat(paymentForm.amount_paid),
      payment_date: new Date().toISOString().split('T')[0],
    }, {
      onSuccess: () => {
        setIsPaymentDialogOpen(false);
        setPaymentForm({
          student_id: '',
          spp_structure_id: '',
          payment_month: '',
          payment_year: new Date().getFullYear().toString(),
          amount_paid: '',
          payment_method: 'cash',
          receipt_number: '',
          notes: '',
        });
      },
    });
  };

  const handleStructureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStructure.mutate({
      ...structureForm,
      monthly_amount: parseFloat(structureForm.monthly_amount),
      is_active: true,
    }, {
      onSuccess: () => {
        setIsStructureDialogOpen(false);
        setStructureForm({
          institution_id: '',
          class_grade: '',
          monthly_amount: '',
          academic_year: '',
        });
      },
    });
  };

  const months = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen SPP</h1>
          <p className="text-muted-foreground">Kelola struktur dan pembayaran SPP</p>
        </div>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Pembayaran SPP</TabsTrigger>
          <TabsTrigger value="structure">Struktur SPP</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Data Pembayaran SPP</h3>
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Receipt className="h-4 w-4 mr-2" />
                  Catat Pembayaran
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Catat Pembayaran SPP</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="student_id">Siswa</Label>
                    <Select
                      value={paymentForm.student_id}
                      onValueChange={(value) => setPaymentForm({ ...paymentForm, student_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih siswa" />
                      </SelectTrigger>
                      <SelectContent>
                        {students?.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.student_id} - {student.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="payment_month">Bulan</Label>
                      <Select
                        value={paymentForm.payment_month}
                        onValueChange={(value) => setPaymentForm({ ...paymentForm, payment_month: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bulan" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="payment_year">Tahun</Label>
                      <Input
                        id="payment_year"
                        type="number"
                        value={paymentForm.payment_year}
                        onChange={(e) => setPaymentForm({ ...paymentForm, payment_year: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="amount_paid">Jumlah Dibayar</Label>
                    <Input
                      id="amount_paid"
                      type="number"
                      value={paymentForm.amount_paid}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount_paid: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="payment_method">Metode Pembayaran</Label>
                    <Select
                      value={paymentForm.payment_method}
                      onValueChange={(value) => setPaymentForm({ ...paymentForm, payment_method: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Tunai</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={createPayment.isPending}>
                      Simpan
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Siswa</TableHead>
                    <TableHead>Bulan/Tahun</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sppPayments?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.students?.student_id} - {payment.students?.full_name}
                      </TableCell>
                      <TableCell>
                        {months[payment.payment_month - 1]?.label} {payment.payment_year}
                      </TableCell>
                      <TableCell>{formatCurrency(payment.amount_paid)}</TableCell>
                      <TableCell>
                        {payment.payment_method === 'cash' ? 'Tunai' :
                         payment.payment_method === 'transfer' ? 'Transfer' : 'Lainnya'}
                      </TableCell>
                      <TableCell>{new Date(payment.payment_date).toLocaleDateString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Struktur SPP</h3>
            <Dialog open={isStructureDialogOpen} onOpenChange={setIsStructureDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Struktur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Struktur SPP</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleStructureSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="institution_id">Institusi</Label>
                    <Select
                      value={structureForm.institution_id}
                      onValueChange={(value) => setStructureForm({ ...structureForm, institution_id: value })}
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="class_grade">Kelas</Label>
                      <Input
                        id="class_grade"
                        value={structureForm.class_grade}
                        onChange={(e) => setStructureForm({ ...structureForm, class_grade: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="academic_year">Tahun Ajaran</Label>
                      <Input
                        id="academic_year"
                        placeholder="2024/2025"
                        value={structureForm.academic_year}
                        onChange={(e) => setStructureForm({ ...structureForm, academic_year: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="monthly_amount">Jumlah Per Bulan</Label>
                    <Input
                      id="monthly_amount"
                      type="number"
                      value={structureForm.monthly_amount}
                      onChange={(e) => setStructureForm({ ...structureForm, monthly_amount: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsStructureDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={createStructure.isPending}>
                      Simpan
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Tahun Ajaran</TableHead>
                    <TableHead>Jumlah/Bulan</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sppStructure?.map((structure) => (
                    <TableRow key={structure.id}>
                      <TableCell>{structure.class_grade}</TableCell>
                      <TableCell>{structure.academic_year}</TableCell>
                      <TableCell>{formatCurrency(structure.monthly_amount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          structure.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {structure.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
