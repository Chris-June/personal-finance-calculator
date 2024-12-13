import { Card } from '@/components/ui/card';
import type { Goal } from '@/lib/types';

interface InvestmentDetails {
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  investmentPeriod: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
}

interface InvestmentSummaryProps {
  investmentDetails: InvestmentDetails;
  goals?: Goal[];
}

const defaultInvestmentDetails: InvestmentDetails = {
  initialAmount: 0,
  monthlyContribution: 0,
  annualReturn: 7,
  investmentPeriod: 10,
  compoundingFrequency: 'monthly',
};

export function InvestmentSummary({ 
  investmentDetails = defaultInvestmentDetails, 
  goals = [] 
}: InvestmentSummaryProps) {
  const {
    initialAmount,
    monthlyContribution,
    annualReturn,
    investmentPeriod,
    compoundingFrequency,
  } = investmentDetails;

  // Calculate future value
  const calculateFutureValue = () => {
    const periodsPerYear = compoundingFrequency === 'monthly' ? 12 : compoundingFrequency === 'quarterly' ? 4 : 1;
    const totalPeriods = investmentPeriod * periodsPerYear;
    const periodicRate = annualReturn / 100 / periodsPerYear;
    
    // Future value of initial amount
    const initialFV = initialAmount * Math.pow(1 + periodicRate, totalPeriods);
    
    // Future value of periodic payments
    const paymentFV = monthlyContribution * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    
    return initialFV + paymentFV;
  };

  const futureValue = calculateFutureValue();
  const totalContributions = initialAmount + (monthlyContribution * 12 * investmentPeriod);
  const totalInterest = futureValue - totalContributions;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const calculateRequiredMonthlyContribution = (
    target: number,
    years: number
  ) => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    const pmt =
      (target * monthlyRate) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return pmt;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Investment Summary</h2>
      <div className="grid gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Future Value
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(futureValue)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Contributions
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalContributions)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Interest Earned
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalInterest)}
          </div>
        </Card>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Investment Metrics</h3>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span>Return on Investment (ROI)</span>
            <span className="font-medium">
              {totalContributions > 0 
                ? `${((totalInterest / totalContributions) * 100).toFixed(1)}%` 
                : '0.0%'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Effective Annual Rate</span>
            <span className="font-medium">{annualReturn}%</span>
          </div>
          <div className="flex justify-between">
            <span>Investment Period</span>
            <span className="font-medium">{investmentPeriod} years</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Contribution</span>
            <span className="font-medium">{formatCurrency(monthlyContribution)}</span>
          </div>
        </div>
      </div>

      {goals.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Goal Analysis</h3>
          <div className="grid gap-4">
            {goals.map((goal) => {
              const requiredMonthly = calculateRequiredMonthlyContribution(
                goal.target,
                goal.timeframe
              );
              const shortfall = goal.target - futureValue;

              return (
                <Card key={goal.id} className="p-4">
                  <div className="space-y-2">
                    <div className="font-medium">{goal.type}</div>
                    <div className="text-sm text-muted-foreground">
                      Target: {formatCurrency(goal.target)} in {goal.timeframe} years
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Required Monthly: {formatCurrency(requiredMonthly)}
                    </div>
                    {shortfall > 0 && (
                      <div className="text-sm text-red-500">
                        Projected Shortfall: {formatCurrency(shortfall)}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}