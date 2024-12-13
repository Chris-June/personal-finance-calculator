import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Wallet, 
  TrendingDown, 
  ShieldAlert, 
  Target,
  PiggyBank,
  ArrowUpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetTipsProps {
  income: number;
  expenses: {
    housing: number;
    transportation: number;
    food: number;
    utilities: number;
    insurance: number;
    healthcare: number;
    savings: number;
    entertainment: number;
    other: number;
  };
  savings: number;
}

export function BudgetTips({
  income,
  expenses,
  savings,
}: BudgetTipsProps) {
  // Calculate key financial ratios
  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
  const savingsRate = (savings / income) * 100;
  const housingRatio = (expenses.housing / income) * 100;
  const debtPayments = expenses.other; // Assuming 'other' includes debt payments
  const debtToIncomeRatio = (debtPayments / income) * 100;
  
  // Generate dynamic tips based on financial metrics
  const tips = [
    // Savings Rate
    {
      icon: PiggyBank,
      title: 'Savings Rate',
      description: savingsRate < 20
        ? `Your current savings rate is ${savingsRate.toFixed(1)}%. Consider increasing your savings to at least 20% of your income for long-term financial security.`
        : `Great job! You're saving ${savingsRate.toFixed(1)}% of your income. Keep maintaining this healthy savings habit.`,
      type: savingsRate < 20 ? 'warning' : 'success',
    },
    
    // Housing Costs
    {
      icon: Wallet,
      title: 'Housing Costs',
      description: housingRatio > 30
        ? `Your housing costs are ${housingRatio.toFixed(1)}% of your income. The recommended maximum is 30%. Consider ways to reduce housing expenses.`
        : `Your housing costs are well-managed at ${housingRatio.toFixed(1)}% of your income, within the recommended range.`,
      type: housingRatio > 30 ? 'warning' : 'success',
    },
    
    // Debt Management
    {
      icon: ShieldAlert,
      title: 'Debt Management',
      description: debtToIncomeRatio > 20
        ? `Your debt payments are ${debtToIncomeRatio.toFixed(1)}% of your income. Consider debt consolidation or accelerated repayment strategies.`
        : `Your debt level is manageable at ${debtToIncomeRatio.toFixed(1)}% of your income. Continue making regular payments.`,
      type: debtToIncomeRatio > 20 ? 'warning' : 'success',
    },
    
    // Expense Distribution
    {
      icon: TrendingDown,
      title: 'Expense Distribution',
      description: totalExpenses > income * 0.9
        ? `You're spending ${((totalExpenses/income) * 100).toFixed(1)}% of your income. Look for areas to reduce expenses and increase your savings buffer.`
        : `Good job managing expenses! You're spending ${((totalExpenses/income) * 100).toFixed(1)}% of your income.`,
      type: totalExpenses > income * 0.9 ? 'warning' : 'success',
    },

    // Emergency Fund
    {
      icon: Target,
      title: 'Emergency Fund',
      description: savings < income * 3
        ? `Aim to build an emergency fund of 3-6 months of expenses (${(income * 3).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} - ${(income * 6).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}).`
        : `Excellent! You have a solid emergency fund. Consider investing additional savings for long-term growth.`,
      type: savings < income * 3 ? 'warning' : 'success',
    },

    // Income Utilization
    {
      icon: ArrowUpCircle,
      title: 'Income Utilization',
      description: (savings + totalExpenses) < income
        ? `You have ${((income - (savings + totalExpenses)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }))} unallocated. Consider putting this towards your financial goals.`
        : `You've allocated your income well between expenses and savings.`,
      type: (savings + totalExpenses) < income ? 'warning' : 'success',
    },
  ];

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Budget Insights</h3>
      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <Alert
              key={index}
              className={cn(
                tip.type === 'warning' && 'border-yellow-500 dark:border-yellow-400',
                tip.type === 'success' && 'border-green-500 dark:border-green-400'
              )}
            >
              <Icon className="h-4 w-4" />
              <AlertTitle>{tip.title}</AlertTitle>
              <AlertDescription>{tip.description}</AlertDescription>
            </Alert>
          );
        })}
      </div>
    </Card>
  );
}
