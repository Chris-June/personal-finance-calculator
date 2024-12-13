import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Clock, 
  PiggyBank,
  BarChart,
  Target,
  DollarSign,
  Percent,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvestmentTipsProps {
  investmentMetrics: {
    initialInvestment: number;
    monthlyContribution: number;
    annualReturn: number;
    investmentPeriod: number;
    totalContributions: number;
    totalReturn: number;
    finalBalance: number;
  } | null;
}

export function InvestmentTips({ investmentMetrics }: InvestmentTipsProps) {
  if (!investmentMetrics) {
    return (
      <Alert>
        <AlertTitle>No Investment Data Available</AlertTitle>
        <AlertDescription>
          Enter your investment details to see personalized insights and recommendations.
        </AlertDescription>
      </Alert>
    );
  }

  const {
    initialInvestment,
    monthlyContribution,
    annualReturn,
    investmentPeriod,
    totalContributions,
    totalReturn,
    finalBalance
  } = investmentMetrics;

  const returnOnInvestment = (totalReturn / totalContributions) * 100;
  const monthlyToInitialRatio = (monthlyContribution * 12) / initialInvestment * 100;
  const riskLevel = annualReturn > 8 ? 'high' : annualReturn > 5 ? 'moderate' : 'low';
  const growthRate = (finalBalance - initialInvestment) / initialInvestment * 100;

  const tips = [
    {
      icon: BarChart,
      title: 'Portfolio Growth',
      description: `Your portfolio shows ${growthRate.toFixed(1)}% total growth over the investment period. ${
        growthRate < 50 
          ? 'Consider strategies to increase your growth potential.'
          : 'This indicates strong portfolio performance.'
      }`,
      type: growthRate < 50 ? 'warning' : 'success',
    },
    {
      icon: Percent,
      title: 'Annual Returns',
      description: `Your expected ${annualReturn.toFixed(1)}% annual return ${
        annualReturn < 5
          ? 'is conservative. Consider reviewing your asset allocation.'
          : 'aligns with historical market performance.'
      }`,
      type: annualReturn < 5 ? 'warning' : 'success',
    },
    {
      icon: TrendingUp,
      title: 'Return on Investment',
      description: returnOnInvestment < 50
        ? `Your projected ROI of ${returnOnInvestment.toFixed(1)}% suggests considering a more aggressive investment strategy or longer time horizon.`
        : `Great! Your projected ROI of ${returnOnInvestment.toFixed(1)}% shows strong potential returns.`,
      type: returnOnInvestment < 50 ? 'warning' : 'success',
    },
    {
      icon: Clock,
      title: 'Time Horizon',
      description: investmentPeriod < 10
        ? `A ${investmentPeriod}-year investment period might be too short. Consider extending your time horizon for better compound growth.`
        : `Your ${investmentPeriod}-year investment period allows good potential for compound growth.`,
      type: investmentPeriod < 10 ? 'warning' : 'success',
    },
    {
      icon: PiggyBank,
      title: 'Monthly Savings',
      description: monthlyToInitialRatio < 10
        ? `Your monthly contributions could be increased relative to your initial investment for better growth potential.`
        : `Your monthly contribution strategy is well-balanced with your initial investment.`,
      type: monthlyToInitialRatio < 10 ? 'warning' : 'success',
    },
    {
      icon: Target,
      title: 'Investment Goal',
      description: finalBalance < totalContributions * 1.5
        ? `Your final balance might not meet typical retirement needs. Consider increasing contributions or adjusting strategy.`
        : `You're on track to meet a solid investment goal with your current strategy.`,
      type: finalBalance < totalContributions * 1.5 ? 'warning' : 'success',
    },
    {
      icon: DollarSign,
      title: 'Initial Investment',
      description: initialInvestment < monthlyContribution * 24
        ? `A larger initial investment could help jumpstart your portfolio's growth potential.`
        : `Your initial investment provides a strong foundation for future growth.`,
      type: initialInvestment < monthlyContribution * 24 ? 'warning' : 'success',
    },
    {
      icon: Scale,
      title: 'Risk Assessment',
      description: `Your investment strategy indicates a ${riskLevel} risk level based on expected returns. ${
        riskLevel === 'low' 
          ? 'Consider if this aligns with your long-term goals.'
          : riskLevel === 'high'
          ? 'Ensure this matches your risk tolerance.'
          : 'This provides a balanced approach to growth and stability.'
      }`,
      type: riskLevel === 'low' ? 'warning' : 'success',
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Investment Insights</h2>
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
