import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { 
  DollarSign, 
  Calendar, 
  TrendingDown, 
  AlertCircle,
  CreditCard,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoanTipsProps {
  loanMetrics: {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    loanAmount: number;
    interestRate: number;
    loanTerm: number;
  } | null;
}

export function LoanTips({ loanMetrics }: LoanTipsProps) {
  if (!loanMetrics) {
    return (
      <Alert>
        <AlertTitle>No Loan Data Available</AlertTitle>
        <AlertDescription>
          Enter your loan details to see personalized insights and recommendations.
        </AlertDescription>
      </Alert>
    );
  }

  const { 
    monthlyPayment, 
    totalInterest, 
    totalPayment, 
    loanAmount, 
    interestRate, 
    loanTerm 
  } = loanMetrics;

  const debtToIncomeRatio = (monthlyPayment / 5000) * 100; // Assuming average monthly income of $5000
  const interestToLoanRatio = (totalInterest / loanAmount) * 100;

  const tips = [
    {
      icon: DollarSign,
      title: 'Monthly Payment Impact',
      description: monthlyPayment > 1500
        ? `Your monthly payment of ${monthlyPayment.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })} is substantial. Consider a longer term or larger down payment to reduce this burden.`
        : `Your monthly payment of ${monthlyPayment.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })} appears manageable.`,
      type: monthlyPayment > 1500 ? 'warning' : 'success',
    },
    {
      icon: CreditCard,
      title: 'Total Loan Cost',
      description: `Your total loan cost will be ${totalPayment.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}. ${
        totalPayment > loanAmount * 1.5 
          ? 'Consider strategies to reduce the total cost, such as making extra payments.'
          : 'The total cost appears reasonable for this type of loan.'
      }`,
      type: totalPayment > loanAmount * 1.5 ? 'warning' : 'success',
    },
    {
      icon: AlertCircle,
      title: 'Debt Burden',
      description: `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(1)}%. ${
        debtToIncomeRatio > 43
          ? 'This is above recommended levels. Consider ways to reduce your monthly obligations.'
          : 'This is within healthy limits for most lending standards.'
      }`,
      type: debtToIncomeRatio > 43 ? 'warning' : 'success',
    },
    {
      icon: Percent,
      title: 'Interest Rate Analysis',
      description: interestRate > 5
        ? `Your interest rate of ${interestRate.toFixed(2)}% is relatively high. Consider shopping for better rates or improving your credit score.`
        : `Your interest rate of ${interestRate.toFixed(2)}% is competitive. Good job securing a favorable rate!`,
      type: interestRate > 5 ? 'warning' : 'success',
    },
    {
      icon: Calendar,
      title: 'Loan Term Consideration',
      description: loanTerm > 60
        ? `A ${loanTerm}-month term means more interest paid over time. Consider if a shorter term might be feasible.`
        : `Your ${loanTerm}-month term balances monthly payments with total interest well.`,
      type: loanTerm > 60 ? 'warning' : 'success',
    },
    {
      icon: TrendingDown,
      title: 'Total Interest Cost',
      description: interestToLoanRatio > 20
        ? `You'll pay ${interestToLoanRatio.toFixed(1)}% of your loan amount in interest. Consider strategies to reduce this cost.`
        : `Your total interest cost is ${interestToLoanRatio.toFixed(1)}% of the loan amount, which is reasonable.`,
      type: interestToLoanRatio > 20 ? 'warning' : 'success',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Loan Insights</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip, index) => (
          <Alert key={index} className={cn(
            tip.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'
          )}>
            <tip.icon className="h-4 w-4" />
            <AlertTitle>{tip.title}</AlertTitle>
            <AlertDescription>{tip.description}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
