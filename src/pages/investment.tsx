import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { InvestmentForm } from '@/components/calculators/investment/investment-form';
import { InvestmentSummary } from '@/components/calculators/investment/investment-summary';
import { InvestmentChart } from '@/components/calculators/investment/investment-chart';
import { GoalInput, type Goal } from '@/components/calculators/shared/goal-input';
import { useChat } from '@/lib/chat-context';
import type { InvestmentDetails } from '@/lib/types';

const investmentGoalTypes = [
  { value: 'wealth-building', label: 'Wealth Building' },
  { value: 'education', label: 'Education Fund' },
  { value: 'home-purchase', label: 'Home Purchase' },
  { value: 'business-startup', label: 'Business Startup' },
  { value: 'emergency-fund', label: 'Emergency Fund' },
  { value: 'major-purchase', label: 'Major Purchase' },
];

export function Investment() {
  const [investmentDetails, setInvestmentDetails] = useState<InvestmentDetails>({
    initialAmount: 0,
    monthlyContribution: 0,
    annualReturn: 7,
    investmentPeriod: 10,
    compoundingFrequency: 'monthly',
    riskTolerance: 'moderate',
    goals: [],
  });

  const [goals, setGoals] = useState<Goal[]>([]);
  const { setCalculatorData } = useChat();

  const calculateInvestmentGrowth = () => {
    const periodsPerYear = {
      monthly: 12,
      quarterly: 4,
      annually: 1,
    };

    const n = periodsPerYear[investmentDetails.compoundingFrequency];
    const r = investmentDetails.annualReturn / 100;
    const t = investmentDetails.investmentPeriod;
    const P = investmentDetails.initialAmount;
    const PMT = investmentDetails.monthlyContribution * 12 / n;

    const futureValue = P * Math.pow(1 + r/n, n*t) + 
      PMT * ((Math.pow(1 + r/n, n*t) - 1) / (r/n));

    const totalContributions = P + (investmentDetails.monthlyContribution * 12 * t);
    const totalInterest = futureValue - totalContributions;

    return {
      futureValue,
      totalContributions,
      totalInterest,
    };
  };

  const projectedResults = calculateInvestmentGrowth();

  // Update chat context whenever investment data or goals change
  useEffect(() => {
    setCalculatorData({
      ...investmentDetails,
      goals,
      projectedResults,
      goalAnalysis: goals.map(goal => ({
        type: goal.type,
        target: goal.target,
        timeframe: goal.timeframe,
        monthlyRequired: calculateRequiredMonthlyContribution(
          goal.target,
          goal.timeframe,
          investmentDetails.annualReturn,
          investmentDetails.compoundingFrequency
        ),
        projectedShortfall: goal.target - projectedResults.futureValue,
      })),
    });
  }, [investmentDetails, goals, projectedResults, setCalculatorData]);

  const calculateRequiredMonthlyContribution = (
    target: number,
    years: number,
    annualReturn: number,
    compoundingFrequency: 'monthly' | 'quarterly' | 'annually'
  ) => {
    const periodsPerYear = {
      monthly: 12,
      quarterly: 4,
      annually: 1,
    };

    const n = periodsPerYear[compoundingFrequency];
    const r = annualReturn / 100;
    const t = years;
    const FV = target;

    const pmt = (FV * (r/n)) / (Math.pow(1 + r/n, n*t) - 1);
    return pmt * n / 12; // Convert to monthly payment
  };

  // Calculate recommended allocation based on risk tolerance and time horizon
  const getRecommendedAllocation = () => {
    const { riskTolerance, investmentPeriod } = investmentDetails;
    
    const baseStockAllocation: Record<'conservative' | 'moderate' | 'aggressive', number> = {
      conservative: 40,
      moderate: 60,
      aggressive: 80,
    };

    // Default to moderate if riskTolerance is not set
    const baseAllocation = riskTolerance ? baseStockAllocation[riskTolerance] : 60;

    // Adjust for time horizon
    const timeHorizonAdjustment = Math.min(investmentPeriod - 10, 10);
    const adjustedStockAllocation = baseAllocation + timeHorizonAdjustment;

    return {
      stocks: Math.min(90, Math.max(20, adjustedStockAllocation)),
      bonds: Math.min(70, Math.max(10, 100 - adjustedStockAllocation)),
    };
  };

  // Calculate savings rate
  const calculateSavingsRate = () => {
    if (!investmentDetails.monthlyContribution) return 0;
    return (investmentDetails.monthlyContribution * 12 / (investmentDetails.monthlyContribution * 12 * 12)) * 100;
  };

  const allocation = getRecommendedAllocation();
  const savingsRate = calculateSavingsRate();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Investment Calculator</h1>
          <p className="text-muted-foreground mb-6">
            Calculate your investment growth over time and see how compound interest
            can work for you.
          </p>
          <InvestmentForm
            investmentDetails={investmentDetails}
            setInvestmentDetails={setInvestmentDetails}
          />
        </Card>

        <Card className="p-6">
          <GoalInput
            goals={goals}
            setGoals={setGoals}
            goalTypes={investmentGoalTypes}
          />
        </Card>
      </div>

      <div className="space-y-6">
        <InvestmentSummary
          investmentDetails={investmentDetails}
          goals={goals}
        />
        <Card className="p-6">
          <InvestmentChart
            investmentDetails={investmentDetails}
            projectedResults={projectedResults}
          />
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Tips & Insights</h2>
          <div className="space-y-4 text-sm">
            {/* Investment Strategy */}
            <div>
              <h3 className="font-medium text-primary mb-2">Portfolio Strategy</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Recommended allocation based on your investment period:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Stocks: {allocation.stocks}%</li>
                  <li>• Bonds: {allocation.bonds}%</li>
                  {investmentDetails.investmentPeriod > 15 && (
                    <li>• Consider increasing stock allocation for long-term growth</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Savings Analysis */}
            <div>
              <h3 className="font-medium text-primary mb-2">
                {savingsRate >= 15 ? "Savings Progress" : "Savings Opportunity"}
              </h3>
              <div className="space-y-2">
                {savingsRate > 0 && (
                  <p className={`text-xs ${savingsRate >= 20 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600'}`}>
                    {savingsRate >= 20 
                      ? "✨ Great job! You're saving above the recommended 20%"
                      : "💡 Aim to save 20% or more of your income"}
                  </p>
                )}
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Current savings rate: {savingsRate.toFixed(1)}%</li>
                  <li>• Monthly contribution: ${investmentDetails.monthlyContribution}</li>
                </ul>
              </div>
            </div>

            {/* Growth Potential */}
            <div>
              <h3 className="font-medium text-primary mb-2">Growth Analysis</h3>
              <div className="space-y-2">
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Projected value: ${projectedResults.futureValue.toFixed(2)}</li>
                  <li>• Total contributions: ${projectedResults.totalContributions.toFixed(2)}</li>
                  <li>• Investment earnings: ${projectedResults.totalInterest.toFixed(2)}</li>
                  {investmentDetails.annualReturn > 8 && (
                    <li>• Consider if this return rate is realistic long-term</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Age-Based Recommendations */}
            <div>
              <h3 className="font-medium text-primary mb-2">Age-Based Strategy</h3>
              <ul className="space-y-1 text-muted-foreground">
                {investmentDetails.investmentPeriod < 10 ? (
                  <>
                    <li>• Great time to focus on growth investments</li>
                    <li>• Consider maxing out retirement accounts</li>
                    <li>• Build emergency fund alongside investments</li>
                  </>
                ) : investmentDetails.investmentPeriod < 20 ? (
                  <>
                    <li>• Balance growth with some conservative investments</li>
                    <li>• Consider catch-up contributions if behind</li>
                    <li>• Review insurance and estate planning</li>
                  </>
                ) : (
                  <>
                    <li>• Focus on wealth preservation</li>
                    <li>• Consider dividend-paying investments</li>
                    <li>• Review retirement withdrawal strategy</li>
                  </>
                )}
              </ul>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-medium text-primary mb-2">Next Steps</h3>
              <ul className="space-y-1 text-muted-foreground">
                {savingsRate < 15 && (
                  <li>• Look for ways to increase monthly contributions</li>
                )}
                {investmentDetails.investmentPeriod < 5 && (
                  <li>• Consider more conservative investments</li>
                )}
                <li>• Review and rebalance portfolio regularly</li>
                <li>• Consider tax-advantaged accounts</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}