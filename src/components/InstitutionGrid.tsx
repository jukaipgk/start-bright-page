
import { Institution } from "@/types/financial";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InstitutionGridProps {
  institutions: Institution[];
  onSelectInstitution?: (institution: Institution) => void;
}

export const InstitutionGrid = ({ institutions, onSelectInstitution }: InstitutionGridProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {institutions.map((institution) => (
        <Card 
          key={institution.id} 
          className={cn(
            "financial-card cursor-pointer hover:scale-105 transition-transform duration-200",
            "animate-fade-in"
          )}
          onClick={() => onSelectInstitution?.(institution)}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{institution.name}</h3>
              <span className="institution-badge">{institution.type}</span>
            </div>
            <div className={cn("w-3 h-3 rounded-full", institution.color)} />
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="financial-label">Saldo</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(institution.balance)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Pemasukan</p>
                <p className="text-sm font-medium text-financial-success">
                  {formatCurrency(institution.income)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pengeluaran</p>
                <p className="text-sm font-medium text-financial-danger">
                  {formatCurrency(institution.expense)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
