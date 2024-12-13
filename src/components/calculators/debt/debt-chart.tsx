import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DebtChartProps {
  principal: number;
  monthlyPayment: number;
  interestRate: number;
}

export function DebtChart({
  principal,
  monthlyPayment,
  interestRate,
}: DebtChartProps) {
  const generatePayoffSchedule = () => {
    const data = [];
    const monthlyRate = interestRate / 100 / 12;
    let balance = principal;
    let month = 0;

    while (balance > 0 && month <= 360) { // 30-year maximum
      data.push({
        month,
        balance: Math.round(balance),
      });

      const interest = balance * monthlyRate;
      const principal = Math.min(monthlyPayment - interest, balance);
      balance -= principal;
      month++;
    }

    return data;
  };

  const data = generatePayoffSchedule();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Month {label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-sm">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>{' '}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Debt Payoff Schedule</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="month"
            label=""
            height={30}
            scale="auto"
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            label=""
            width={80}
            scale="auto"
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="balance"
            name="Remaining Balance"
            stroke="#f87171"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}