import { Progress } from '@/components/ui/progress';

interface BudgetSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
}

export function BudgetSummary({
  totalIncome = 0,
  totalExpenses = 0,
  netIncome = 0,
  savingsRate = 0,
}: BudgetSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Total Monthly Income</div>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Total Monthly Expenses</div>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
        </div>

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Net Monthly Income</div>
          <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netIncome)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Savings Rate</div>
          <div className="text-sm font-medium">{formatPercentage(savingsRate)}</div>
        </div>
        <Progress value={savingsRate} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {savingsRate >= 20 
            ? "Great job! You're meeting the recommended 20% savings target."
            : "Aim to save at least 20% of your income for long-term financial health."}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">Expense Ratio</div>
          <div className="text-sm font-medium">
            {formatPercentage((totalExpenses / totalIncome) * 100)}
          </div>
        </div>
        <Progress value={(totalExpenses / totalIncome) * 100} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {(totalExpenses / totalIncome) * 100 <= 80 
            ? "You're keeping expenses under control."
            : "Consider reducing expenses to improve your savings rate."}
        </div>
      </div>
    </div>
  );
}