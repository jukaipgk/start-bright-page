
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Institution } from "@/types/financial";

interface FinancialChartProps {
  institutions: Institution[];
  type: 'bar' | 'pie';
}

export const FinancialChart = ({ institutions, type }: FinancialChartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartData = institutions.map(inst => ({
    name: inst.type,
    pemasukan: inst.income,
    pengeluaran: inst.expense,
    saldo: inst.balance,
    fill: inst.color.replace('bg-', '#').replace('-500', '')
  }));

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#F97316', '#EF4444'];

  if (type === 'pie') {
    return (
      <Card className="financial-card">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Distribusi Saldo per Lembaga</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="saldo"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="financial-card">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pemasukan vs Pengeluaran per Lembaga</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Lembaga: ${label}`}
              />
              <Bar dataKey="pemasukan" fill="hsl(var(--financial-success))" name="Pemasukan" />
              <Bar dataKey="pengeluaran" fill="hsl(var(--financial-danger))" name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
