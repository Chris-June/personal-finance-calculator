import { Card } from '@/components/ui/card';

interface DebtSummaryProps {
  months: number;
  totalPayment: number;
  totalInterest: number;
  totalDebt: number;
  totalMinPayment: number;
}

export function DebtSummary({
  months,
  totalPayment,
  totalInterest,
  totalDebt,
  totalMinPayment,
}: DebtSummaryProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatYearsAndMonths = (totalMonths: number) => {
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years, ${remainingMonths} months`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Debt Summary</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Debt</p>
            <p className="text-lg font-medium">{formatCurrency(totalDebt)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-lg font-medium">{formatCurrency(totalMinPayment)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Interest</p>
            <p className="text-lg font-medium">{formatCurrency(totalInterest)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Payment</p>
            <p className="text-lg font-medium">{formatCurrency(totalPayment)}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Time to Pay Off</p>
          <p className="text-lg font-medium">{formatYearsAndMonths(months)}</p>
        </div>
      </div>
    </Card>
  );
}