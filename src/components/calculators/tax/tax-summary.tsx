import { Progress } from '@/components/ui/progress';
import type { FilingStatus, Province } from '@/lib/types';

interface TaxSummaryProps {
  taxableIncome: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  filingStatus: FilingStatus;
  province: Province;
}

export function TaxSummary({
  taxableIncome,
  federalTax,
  provincialTax,
  totalTax,
  effectiveRate,
  marginalRate,
  filingStatus,
  province,
}: TaxSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  return (
    <div className="space-y-6">
      {/* Tax Amounts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Federal Tax</h3>
            <p className="text-2xl font-bold">{formatCurrency(federalTax)}</p>
          </div>
        </div>
        <div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Provincial Tax ({province})</h3>
            <p className="text-2xl font-bold">{formatCurrency(provincialTax)}</p>
          </div>
        </div>
      </div>

      {/* Total Tax and Income */}
      <div className="flex items-baseline justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Total Tax</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalTax)}</p>
        </div>
        <div className="text-right space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Taxable Income</h3>
          <p className="text-2xl font-bold">{formatCurrency(taxableIncome)}</p>
        </div>
      </div>

      {/* Tax Rates */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Effective Tax Rate</span>
            <span className="text-sm font-medium">{formatPercentage(effectiveRate)}</span>
          </div>
          <Progress value={effectiveRate} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Marginal Tax Rate</span>
            <span className="text-sm font-medium">{formatPercentage(marginalRate)}</span>
          </div>
          <Progress value={marginalRate} className="h-2" />
        </div>
      </div>

      {/* Filing Status */}
      <div className="pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Filing Status</span>
          <span className="font-medium capitalize">{filingStatus.replace(/([A-Z])/g, ' $1').trim()}</span>
        </div>
      </div>
    </div>
  );
}
