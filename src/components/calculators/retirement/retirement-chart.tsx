import { LineChart } from 'recharts';
import { BaseChart } from '@/components/ui/charts/base-chart';
import {
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartLine,
} from '@/components/ui/charts/chart-components';

interface RetirementChartProps {
  currentSavings: number;
  monthlyContribution: number;
  years: number;
  expectedReturn: number;
  goals: Array<{
    id: string;
    type: string;
    target: number;
    timeframe: number;
  }>;
}

export function RetirementChart({
  currentSavings,
  monthlyContribution,
  years,
  expectedReturn,
  goals,
}: RetirementChartProps) {
  const generateProjections = () => {
    const data = [];
    const monthlyRate = expectedReturn / 100 / 12;

    let balance = currentSavings;
    for (let year = 0; year <= years; year++) {
      data.push({
        year: new Date().getFullYear() + year,
        balance: Math.round(balance),
        goals: goals
          .filter((goal) => goal.timeframe === year)
          .reduce((sum, goal) => sum + goal.target, 0),
      });

      // Calculate next year's balance
      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
    }

    return data;
  };

  const data = generateProjections();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <BaseChart title="Retirement Savings Projection">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <ChartGrid />
        <ChartXAxis
          dataKey="year"
          label={{ value: 'Year' }}
          tickFormatter={(value) => value.toString()}
        />
        <ChartYAxis
          tickFormatter={formatCurrency}
          label={{ value: 'Balance' }}
          width={100}
        />
        <ChartTooltip
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(label) => `Year: ${label}`}
        />
        <ChartLegend />
        <ChartLine
          type="monotone"
          dataKey="balance"
          name="Projected Balance"
          stroke="#4ade80"
        />
        {goals.length > 0 && (
          <ChartLine
            type="monotone"
            dataKey="goals"
            name="Goals"
            stroke="#f87171"
            strokeDasharray="5 5"
          />
        )}
      </LineChart>
    </BaseChart>
  );
}