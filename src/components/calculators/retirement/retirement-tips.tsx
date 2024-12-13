import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RetirementTipsProps {
  retirementMetrics: {
    currentAge: number;
    retirementAge: number;
    currentSavings: number;
    monthlyContribution: number;
    expectedReturn: number;
    desiredIncome: number;
    totalNeeded: number;
    socialSecurity?: number;
    inflationRate?: number;
  } | null;
}

export function RetirementTips({ retirementMetrics }: RetirementTipsProps) {
  if (!retirementMetrics) {
    return (
      <Alert>
        <AlertTitle>No Retirement Data Available</AlertTitle>
        <AlertDescription>
          Enter your retirement planning details to see personalized insights and recommendations.
        </AlertDescription>
      </Alert>
    );
  }

  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    desiredIncome,
    totalNeeded,
    socialSecurity = 0,
    inflationRate = 2.5,
  } = retirementMetrics;

  // Calculate key retirement metrics
  const yearsToRetirement = retirementAge - currentAge;
  const monthlyIncome = desiredIncome / 12;
  const savingsGap = totalNeeded - currentSavings;
  const monthlyGap = (savingsGap / (yearsToRetirement * 12)) - monthlyContribution;
  const savingsRate = (monthlyContribution * 12) / (desiredIncome) * 100;
  const adjustedReturn = expectedReturn - inflationRate;
  const incomeReplacement = (monthlyIncome / (monthlyContribution * 12)) * 100;
  
  const tips = [
    {
      icon: Clock,
      title: 'Retirement Timeline',
      description: (() => {
        if (yearsToRetirement < 10) {
          return `With only ${yearsToRetirement} years until retirement, it's crucial to maximize your savings and consider delaying CPP benefits for increased payments.`;
        } else if (yearsToRetirement < 20) {
          return `With ${yearsToRetirement} years until retirement, focus on debt reduction and maximizing RRSP/TFSA contributions.`;
        } else {
          return `You have ${yearsToRetirement} years to build your retirement nest egg. Time is on your side for compound growth and long-term investing through registered accounts.`;
        }
      })(),
      type: yearsToRetirement < 15 ? 'warning' : 'success',
    },
    {
      icon: DollarSign,
      title: 'Monthly Contribution Gap',
      description: (() => {
        const formattedGap = monthlyGap.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
        const formattedContribution = monthlyContribution.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
        
        if (monthlyGap > 0) {
          return `To reach your retirement goal, consider increasing your monthly RRSP/TFSA contributions by ${formattedGap}. This will help maximize your tax benefits and close the savings gap.`;
        } else if (monthlyGap < -500) {
          return `You're exceeding your target by ${formattedGap.replace('-', '')}! Your monthly contribution of ${formattedContribution} puts you in a strong position for retirement.`;
        } else {
          return `You're on track with your monthly contribution of ${formattedContribution}. Keep maintaining this savings rate to meet your retirement goals.`;
        }
      })(),
      type: monthlyGap > 0 ? 'warning' : 'success',
    },
    {
      icon: BarChart3,
      title: 'Income Replacement',
      description: (() => {
        if (incomeReplacement > 85) {
          return `Your target retirement income is ${incomeReplacement.toFixed(0)}% of your current income. This ambitious goal requires maximizing RRSP contributions and careful tax planning.`;
        } else if (incomeReplacement < 50) {
          return `Planning to replace ${incomeReplacement.toFixed(0)}% of your income. Consider if this will be sufficient with CPP, OAS, and living cost increases.`;
        } else {
          return `Your ${incomeReplacement.toFixed(0)}% income replacement target is well-balanced. Combined with CPP and OAS, this should maintain your lifestyle.`;
        }
      })(),
      type: (incomeReplacement > 85 || incomeReplacement < 50) ? 'warning' : 'success',
    },
    {
      icon: Target,
      title: 'Savings Rate',
      description: (() => {
        if (savingsRate < 15) {
          return `Your current savings rate of ${savingsRate.toFixed(1)}% is below recommended levels. Consider increasing RRSP/TFSA contributions to at least 15% of income.`;
        } else if (savingsRate > 30) {
          return `Excellent savings rate of ${savingsRate.toFixed(1)}%! You're maximizing your retirement potential through consistent contributions.`;
        } else {
          return `Good savings rate of ${savingsRate.toFixed(1)}%. Consider increasing contributions as your income grows to maximize tax benefits.`;
        }
      })(),
      type: savingsRate < 15 ? 'warning' : 'success',
    },
    {
      icon: TrendingUp,
      title: 'Investment Strategy',
      description: (() => {
        const riskProfile = yearsToRetirement > 20 ? 'growth' : yearsToRetirement > 10 ? 'balanced' : 'conservative';
        if (adjustedReturn < 4) {
          return `Your real return of ${adjustedReturn.toFixed(1)}% (after ${inflationRate}% inflation) might be too conservative. Consider a more ${riskProfile} portfolio mix within your RRSP/TFSA.`;
        } else if (adjustedReturn > 8) {
          return `Your expected real return of ${adjustedReturn.toFixed(1)}% is optimistic. Consider a more balanced projection for registered account planning.`;
        } else {
          return `Your real return of ${adjustedReturn.toFixed(1)}% (after inflation) aligns well with a ${riskProfile} investment strategy for your registered accounts.`;
        }
      })(),
      type: (adjustedReturn < 4 || adjustedReturn > 8) ? 'warning' : 'success',
    },
    {
      icon: Shield,
      title: 'Government Benefits',
      description: (() => {
        const monthlyPension = socialSecurity / 12;
        if (socialSecurity === 0) {
          return `Include estimated CPP and OAS in your planning. Maximum CPP is about $1,300/month and OAS adds about $700/month in retirement income.`;
        } else if (monthlyPension > 3000) {
          return `Your estimated monthly government benefits of ${monthlyPension.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })} seem high. Verify CPP and OAS estimates.`;
        } else {
          return `Your expected government benefits of ${monthlyPension.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })} per month will supplement your RRSP/TFSA withdrawals.`;
        }
      })(),
      type: socialSecurity === 0 ? 'warning' : 'success',
    },
  ];

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Retirement Planning Insights</h3>
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
