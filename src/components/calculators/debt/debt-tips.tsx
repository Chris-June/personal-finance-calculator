import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TrendingDown, 
  CreditCard, 
  DollarSign,
  Clock,
  Target,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DebtTipsProps {
  debtMetrics: {
    totalDebt: number;
    monthlyPayment: number;
    monthlyIncome: number;
    interestRates: number[];
    debtTypes: string[];
    payoffTime: number;
    totalInterest: number;
  } | null;
}

export function DebtTips({ debtMetrics }: DebtTipsProps) {
  if (!debtMetrics) {
    return (
      <Alert>
        <AlertTitle>No Debt Data Available</AlertTitle>
        <AlertDescription>
          Enter your debt details to see personalized insights and recommendations.
        </AlertDescription>
      </Alert>
    );
  }

  const {
    totalDebt,
    monthlyPayment,
    monthlyIncome,
    interestRates,
    debtTypes,
    payoffTime,
    totalInterest
  } = debtMetrics;

  const debtToIncomeRatio = (totalDebt / (monthlyIncome * 12)) * 100;
  const monthlyPaymentRatio = (monthlyPayment / monthlyIncome) * 100;
  const highestInterestRate = Math.max(...interestRates);

  const tips = [
    {
      icon: BarChart,
      title: 'Total Debt Overview',
      description: `Your total debt is $${totalDebt.toLocaleString()}. ${
        totalDebt > monthlyIncome * 24 
          ? 'This is significant relative to your income. Consider debt consolidation.'
          : 'This appears manageable with your current income.'
      }`,
      type: totalDebt > monthlyIncome * 24 ? 'warning' : 'success',
    },
    {
      icon: TrendingDown,
      title: 'Debt-to-Income Ratio',
      description: debtToIncomeRatio > 40
        ? `Your debt-to-income ratio of ${debtToIncomeRatio.toFixed(1)}% is high. Focus on debt reduction strategies.`
        : `Your debt-to-income ratio of ${debtToIncomeRatio.toFixed(1)}% is manageable. Keep up the good work!`,
      type: debtToIncomeRatio > 40 ? 'warning' : 'success',
    },
    {
      icon: CreditCard,
      title: 'Monthly Payment Burden',
      description: monthlyPaymentRatio > 30
        ? `Your debt payments consume ${monthlyPaymentRatio.toFixed(1)}% of your monthly income. Consider debt consolidation.`
        : `Your monthly debt payments are ${monthlyPaymentRatio.toFixed(1)}% of income, which is reasonable.`,
      type: monthlyPaymentRatio > 30 ? 'warning' : 'success',
    },
    {
      icon: Target,
      title: 'Debt Composition',
      description: (() => {
        const hasHighRiskDebt = debtTypes.some(type => 
          ['creditCard', 'personalLoan'].includes(type)
        );
        const hasMortgage = debtTypes.includes('mortgage');
        
        if (hasHighRiskDebt && !hasMortgage) {
          return 'Your debt is primarily high-interest consumer debt. Focus on paying these off quickly.';
        } else if (hasHighRiskDebt && hasMortgage) {
          return 'You have a mix of mortgage and high-interest debt. Consider consolidating your high-interest debt.';
        } else if (hasMortgage) {
          return 'Your debt is primarily mortgage-based, which is typically considered good debt.';
        } else {
          return 'Your debt composition appears balanced. Continue making regular payments.';
        }
      })(),
      type: debtTypes.some(type => ['creditCard', 'personalLoan'].includes(type)) ? 'warning' : 'success',
    },
    {
      icon: Clock,
      title: 'Payoff Timeline',
      description: payoffTime > 60
        ? `It will take ${payoffTime} months to be debt-free. Consider increasing payments to accelerate payoff.`
        : `You're on track to be debt-free in ${payoffTime} months. Stay committed to your plan!`,
      type: payoffTime > 60 ? 'warning' : 'success',
    },
    {
      icon: Target,
      title: 'Interest Rate Analysis',
      description: highestInterestRate > 15
        ? `Your highest interest rate is ${highestInterestRate}%. Prioritize paying off high-interest debt first.`
        : `Your interest rates are moderate. Continue making regular payments while building savings.`,
      type: highestInterestRate > 15 ? 'warning' : 'success',
    },
    {
      icon: DollarSign,
      title: 'Total Interest Cost',
      description: totalInterest > totalDebt * 0.3
        ? `You'll pay $${totalInterest.toLocaleString()} in interest. Consider strategies to reduce this cost.`
        : `Your total interest cost of $${totalInterest.toLocaleString()} is reasonable. Keep following your plan.`,
      type: totalInterest > totalDebt * 0.3 ? 'warning' : 'success',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Debt Management Insights</h2>
      <div className="grid gap-4 md:grid-cols-2">
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
