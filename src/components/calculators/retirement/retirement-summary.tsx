import { Card } from '@/components/ui/card';
import type { Goal } from '@/components/calculators/shared/goal-input';

interface RetirementSummaryProps {
  nominalValue: number;
  realValue: number;
  monthlyContribution: number;
  goals: Goal[];
  expectedReturn: number;
}

export function RetirementSummary({
  nominalValue,
  realValue,
  monthlyContribution,
  goals,
  expectedReturn,
}: RetirementSummaryProps) {
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
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    const pmt =
      (target * monthlyRate) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return pmt;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Future Value (Nominal)
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(nominalValue)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Future Value (Real)
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(realValue)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Monthly Savings
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(monthlyContribution)}
          </div>
        </Card>
      </div>

      {goals.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Goal Analysis</h3>
          <div className="space-y-4">
            {goals.map((goal) => {
              const requiredMonthly = calculateRequiredMonthlyContribution(
                goal.target,
                goal.timeframe
              );
              const isOnTrack = monthlyContribution >= requiredMonthly;

              return (
                <div
                  key={goal.id}
                  className="p-4 bg-muted rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {formatCurrency(goal.target)} in {goal.timeframe} years
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Required Monthly: {formatCurrency(requiredMonthly)}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-sm ${
                        isOnTrack
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                      }`}
                    >
                      {isOnTrack ? 'On Track' : 'Adjustment Needed'}
                    </div>
                  </div>
                  {!isOnTrack && (
                    <p className="text-sm text-muted-foreground">
                      Increase monthly savings by{' '}
                      {formatCurrency(requiredMonthly - monthlyContribution)} to
                      reach this goal
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}