import { Card } from '@/components/ui/card';

interface NetWorthSummaryProps {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export function NetWorthSummary({
  totalAssets,
  totalLiabilities,
  netWorth,
}: NetWorthSummaryProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="text-sm font-medium text-muted-foreground">
          Total Assets
        </div>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(totalAssets)}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-sm font-medium text-muted-foreground">
          Total Liabilities
        </div>
        <div className="text-2xl font-bold text-red-600">
          {formatCurrency(totalLiabilities)}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-sm font-medium text-muted-foreground">Net Worth</div>
        <div
          className={`text-2xl font-bold ${
            netWorth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {formatCurrency(netWorth)}
        </div>
      </Card>
    </div>
  );
}