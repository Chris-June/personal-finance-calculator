import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RetirementForm } from '@/components/calculators/retirement/retirement-form';
import { RetirementChart } from '@/components/calculators/retirement/retirement-chart';
import { RetirementSummary } from '@/components/calculators/retirement/retirement-summary';
import { GoalInput, type Goal } from '@/components/calculators/shared/goal-input';
import { useChat } from '@/lib/chat-context';
import { useEffect } from 'react';

const retirementGoalTypes = [
  { value: 'total-savings', label: 'Total Retirement Savings' },
  { value: 'monthly-income', label: 'Monthly Retirement Income' },
  { value: 'early-retirement', label: 'Early Retirement Fund' },
  { value: 'pension-supplement', label: 'Pension Supplementation' },
  { value: 'healthcare-fund', label: 'Healthcare Fund' },
  { value: 'legacy-fund', label: 'Legacy/Inheritance Fund' },
];

interface RetirementDetails {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  desiredIncome: number;
  socialSecurity: number;
  goals: Goal[];
}

export function Retirement() {
  const [retirementDetails, setRetirementDetails] = useState<RetirementDetails>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 0,
    monthlyContribution: 0,
    expectedReturn: 7,
    inflationRate: 2,
    desiredIncome: 0,
    socialSecurity: 0,
    goals: [], // Initialize goals as an empty array
  });

  const [goals, setGoals] = useState<Goal[]>([]);
  const { setCalculatorData } = useChat();

  const calculateRetirementSavings = () => {
    const years = retirementDetails.retirementAge - retirementDetails.currentAge;
    const monthlyRate = retirementDetails.expectedReturn / 100 / 12;
    const months = years * 12;
    const futureValue =
      retirementDetails.currentSavings * Math.pow(1 + monthlyRate, months) +
      retirementDetails.monthlyContribution *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    const realRate =
      (1 + retirementDetails.expectedReturn / 100) /
        (1 + retirementDetails.inflationRate / 100) -
      1;
    const realFutureValue =
      retirementDetails.currentSavings * Math.pow(1 + realRate, years) +
      retirementDetails.monthlyContribution * 12 *
        ((Math.pow(1 + realRate, years) - 1) / realRate);

    return {
      nominalValue: futureValue,
      realValue: realFutureValue,
    };
  };

  const { nominalValue, realValue } = calculateRetirementSavings();

  // Update chat context whenever retirement data or goals change
  useEffect(() => {
    setCalculatorData({
      ...retirementDetails,
      goals,
      projectedSavings: {
        nominal: nominalValue,
        real: realValue,
      },
      monthlyContributionNeeded: goals.map(goal => ({
        type: goal.type,
        target: goal.target,
        timeframe: goal.timeframe,
        monthlyRequired: calculateRequiredMonthlyContribution(
          goal.target,
          goal.timeframe,
          retirementDetails.expectedReturn
        ),
      })),
    });
  }, [retirementDetails, goals, nominalValue, realValue, setCalculatorData]);

  const calculateRequiredMonthlyContribution = (
    target: number,
    years: number,
    annualReturn: number
  ) => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    const pmt =
      (target * monthlyRate) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return pmt;
  };

  const years = retirementDetails.retirementAge - retirementDetails.currentAge;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Retirement Calculator</h1>
          <p className="text-muted-foreground mb-6">
            Plan your retirement by calculating how much you need to save and
            visualizing your savings growth over time.
          </p>
          <RetirementForm
            retirementDetails={retirementDetails}
            setRetirementDetails={setRetirementDetails}
          />
        </Card>

        <Card className="p-6">
          <GoalInput
            goals={goals}
            setGoals={setGoals}
            goalTypes={retirementGoalTypes}
          />
        </Card>
      </div>

      <div className="space-y-6">
        <RetirementSummary
          nominalValue={nominalValue}
          realValue={realValue}
          monthlyContribution={retirementDetails.monthlyContribution}
          goals={goals}
          expectedReturn={retirementDetails.expectedReturn}
        />
        <Card className="p-6">
          <RetirementChart
            currentSavings={retirementDetails.currentSavings}
            monthlyContribution={retirementDetails.monthlyContribution}
            years={years}
            expectedReturn={retirementDetails.expectedReturn}
            goals={goals}
          />
        </Card>
      </div>
    </div>
  );
}