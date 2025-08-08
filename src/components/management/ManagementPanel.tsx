
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { InstitutionManagement } from '@/components/management/InstitutionManagement';
import { UserManagement } from '@/components/management/UserManagement';
import { useProfile } from '@/hooks/useSupabaseData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export const ManagementPanel: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!profile || profile.role === 'viewer') {
    return (
      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Anda tidak memiliki akses untuk mengelola data. Hubungi administrator untuk mengubah role Anda.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold">Panel Manajemen</h2>
        <p className="text-muted-foreground">
          Kelola transaksi, lembaga, dan pengguna sistem
        </p>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          <TabsTrigger value="add-transaction">Tambah Transaksi</TabsTrigger>
          <TabsTrigger value="institutions">Lembaga</TabsTrigger>
          {profile.role === 'admin' && (
            <TabsTrigger value="users">Pengguna</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionList key={refreshTrigger} />
        </TabsContent>

        <TabsContent value="add-transaction" className="space-y-6">
          <TransactionForm onTransactionAdded={handleRefresh} />
        </TabsContent>

        <TabsContent value="institutions" className="space-y-6">
          <InstitutionManagement />
        </TabsContent>

        {profile.role === 'admin' && (
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
