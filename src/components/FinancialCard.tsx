
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinancialCardProps {
  title: string;
  value: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  formatAsRupiah?: boolean;
}

export const FinancialCard = ({ 
  title, 
  value, 
  subtitle, 
  trend = 'neutral', 
  className,
  formatAsRupiah = true 
}: FinancialCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-financial-success';
      case 'down': return 'text-financial-danger';
      default: return 'text-foreground';
    }
  };

  return (
    <Card className={cn("financial-card", className)}>
      <div className="space-y-2">
        <p className="financial-label">{title}</p>
        <div className={cn("financial-stat", getTrendColor())}>
          {formatAsRupiah ? formatCurrency(value) : value.toLocaleString('id-ID')}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </Card>
  );
};
