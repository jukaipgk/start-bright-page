
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { FinancialCard } from "@/components/FinancialCard";
import { InstitutionGrid } from "@/components/InstitutionGrid";
import { TransactionTable } from "@/components/TransactionTable";
import { FinancialChart } from "@/components/FinancialChart";
import { Header } from "@/components/layout/Header";
import { ManagementPanel } from "@/components/management/ManagementPanel";
import { useAuth } from "@/components/auth/AuthContext";
import { useInstitutions, useTransactions } from "@/hooks/useSupabaseData";
import { Institution } from "@/types/financial";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedView, setSelectedView] = useState<'overview' | 'institutions' | 'transactions' | 'management'>('overview');
  
  const { data: institutions = [], isLoading: institutionsLoading } = useInstitutions();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const handleSelectInstitution = (institution: Institution) => {
    console.log(`Selected institution: ${institution.name}`);
    // Future: Navigate to detailed institution view
  };

  // Process data for consolidation
  const processedInstitutions = institutions.map(inst => {
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
      color: inst.color || '#3B82F6',
    };
  });

  const consolidationData = {
    totalBalance: processedInstitutions.reduce((sum, inst) => sum + inst.balance, 0),
    totalIncome: processedInstitutions.reduce((sum, inst) => sum + inst.income, 0),
    totalExpense: processedInstitutions.reduce((sum, inst) => sum + inst.expense, 0),
    institutions: processedInstitutions,
    recentTransactions: transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(t => ({
        id: t.id,
        institutionId: t.institution_id,
        institutionName: (t.institutions as any)?.name || 'Unknown',
        type: t.type as 'income' | 'expense',
        amount: Number(t.amount),
        description: t.description,
        category: t.category,
        date: t.date,
      })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Header selectedView={selectedView} onViewChange={setSelectedView} />

      <main className="container mx-auto px-6 py-8">
        {/* Overview View */}
        {selectedView === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FinancialCard
                title="Total Saldo Konsolidasi"
                value={consolidationData.totalBalance}
                subtitle="Seluruh lembaga"
                trend="up"
              />
              <FinancialCard
                title="Total Pemasukan"
                value={consolidationData.totalIncome}
                subtitle="Bulan ini"
                trend="up"
              />
              <FinancialCard
                title="Total Pengeluaran"
                value={consolidationData.totalExpense}
                subtitle="Bulan ini"
                trend="down"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialChart institutions={consolidationData.institutions} type="bar" />
              <FinancialChart institutions={consolidationData.institutions} type="pie" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="financial-card text-center">
                <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="financial-stat text-2xl">{consolidationData.institutions.length}</p>
                <p className="financial-label">Total Lembaga</p>
              </div>
              <div className="financial-card text-center">
                <TrendingUp className="w-8 h-8 text-financial-success mx-auto mb-2" />
                <p className="financial-stat text-2xl">
                  {consolidationData.totalExpense > 0 
                    ? Math.round((consolidationData.totalIncome / consolidationData.totalExpense) * 100) 
                    : 0}%
                </p>
                <p className="financial-label">Rasio Keuangan</p>
              </div>
              <div className="financial-card text-center">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="financial-stat text-2xl">
                  {(consolidationData.totalIncome / 1000000).toFixed(0)}M
                </p>
                <p className="financial-label">Pemasukan (Juta)</p>
              </div>
              <div className="financial-card text-center">
                <TrendingDown className="w-8 h-8 text-financial-danger mx-auto mb-2" />
                <p className="financial-stat text-2xl">
                  {(consolidationData.totalExpense / 1000000).toFixed(0)}M
                </p>
                <p className="financial-label">Pengeluaran (Juta)</p>
              </div>
            </div>

            {/* Recent Transactions Preview */}
            {consolidationData.recentTransactions.length > 0 && (
              <TransactionTable transactions={consolidationData.recentTransactions} />
            )}
          </div>
        )}

        {/* Institutions View */}
        {selectedView === 'institutions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Lembaga Pendidikan</h2>
              <p className="text-muted-foreground">Klik lembaga untuk melihat detail</p>
            </div>
            {institutionsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <InstitutionGrid 
                institutions={consolidationData.institutions} 
                onSelectInstitution={handleSelectInstitution}
              />
            )}
          </div>
        )}

        {/* Transactions View */}
        {selectedView === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            {transactionsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <TransactionTable transactions={consolidationData.recentTransactions} />
            )}
          </div>
        )}

        {/* Management View */}
        {selectedView === 'management' && <ManagementPanel />}
      </main>
    </div>
  );
};

export default Index;
