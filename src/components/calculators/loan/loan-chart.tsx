import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoanCalculations } from '@/lib/types';

interface LoanChartProps {
  calculations: LoanCalculations;
}

const COLORS = {
  principal: '#4ade80',
  interest: '#f87171',
  payment: '#60a5fa',
  balance: '#f59e0b',
};

export function LoanChart({ calculations }: LoanChartProps) {
  // Ensure we have valid data before processing
  if (!calculations || !calculations.amortizationSchedule) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        Enter loan details to view charts
      </div>
    );
  }

  const principal = calculations.totalPayment - calculations.totalInterest;
  const totalInterest = calculations.totalInterest;

  const pieData = [
    { name: 'Principal', value: principal },
    { name: 'Total Interest', value: totalInterest },
  ];

  // Prepare data for area chart - sample every 12th month for yearly view
  const yearlyData = calculations.amortizationSchedule
    .filter((_, index) => index % 12 === 0)
    .map((data) => ({
      year: Math.floor(data.period / 12),
      payment: data.payment,
      principal: data.principal,
      interest: data.interest,
      balance: data.remainingBalance,
    }));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="breakdown">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? COLORS.principal : COLORS.interest}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="schedule" className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={yearlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                label={{
                  value: 'Amount',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                }}
              />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="balance"
                stackId="1"
                stroke={COLORS.balance}
                fill={COLORS.balance}
                name="Remaining Balance"
              />
              <Area
                type="monotone"
                dataKey="payment"
                stackId="2"
                stroke={COLORS.payment}
                fill={COLORS.payment}
                name="Payment"
              />
              <Area
                type="monotone"
                dataKey="principal"
                stackId="3"
                stroke={COLORS.principal}
                fill={COLORS.principal}
                name="Principal"
              />
              <Area
                type="monotone"
                dataKey="interest"
                stackId="3"
                stroke={COLORS.interest}
                fill={COLORS.interest}
                name="Interest"
              />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}