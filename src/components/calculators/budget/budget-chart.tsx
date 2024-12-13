import { BarChart, Bar } from 'recharts';
import type { IncomeSource, Expense } from '@/lib/types';
import { BaseChart } from '@/components/ui/charts/base-chart';
import {
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
} from '@/components/ui/charts/chart-components';

interface BudgetChartProps {
  incomeSources: IncomeSource[];
  expenses: Expense[];
}

export function BudgetChart({ incomeSources = [], expenses = [] }: BudgetChartProps) {
  const chartData = [
    {
      name: 'Income',
      amount: incomeSources.reduce((sum, source) => sum + source.amount, 0),
    },
    {
      name: 'Expenses',
      amount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(value);
  };

  return (
    <BaseChart title="Budget Overview">
      <BarChart data={chartData}>
        <ChartGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis tickFormatter={formatCurrency} />
        <ChartTooltip formatter={formatCurrency} />
        <ChartLegend />
        <Bar
          dataKey="amount"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          maxBarSize={100}
          name="Amount"
        />
      </BarChart>
    </BaseChart>
  );
}