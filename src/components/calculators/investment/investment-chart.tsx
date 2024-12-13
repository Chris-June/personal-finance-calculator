import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  TooltipProps as RechartsTooltipProps,
} from 'recharts';

interface InvestmentChartProps {
  investmentDetails: {
    initialAmount: number;
    monthlyContribution: number;
    annualReturn: number;
    investmentPeriod: number;
    compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  };
  projectedResults: {
    futureValue: number;
    totalContributions: number;
    totalInterest: number;
  };
}

interface CustomTooltipProps extends Omit<RechartsTooltipProps<number, string>, 'payload'> {
  payload?: {
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: {
      year: number;
      balance: number;
      contributions: number;
      interest: number;
    };
  }[];
}

export function InvestmentChart({ 
  investmentDetails = {
    initialAmount: 0,
    monthlyContribution: 0,
    annualReturn: 7,
    investmentPeriod: 10,
    compoundingFrequency: 'monthly' as const,
  },
  projectedResults = {
    futureValue: 0,
    totalContributions: 0,
    totalInterest: 0,
  }
}: InvestmentChartProps) {
  if (!investmentDetails) {
    return <div className="h-[400px] flex items-center justify-center">No investment data available</div>;
  }

  const {
    initialAmount,
    monthlyContribution,
    annualReturn,
    investmentPeriod,
    compoundingFrequency,
  } = investmentDetails;

  const generateProjections = () => {
    const data = [];
    const periodsPerYear = {
      monthly: 12,
      quarterly: 4,
      annually: 1,
    };

    const n = periodsPerYear[compoundingFrequency];
    const r = annualReturn / 100;
    let totalContributions = initialAmount;
    let balance = initialAmount;

    for (let year = 0; year <= investmentPeriod; year++) {
      data.push({
        year,
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
        interest: Math.round(balance - totalContributions),
      });

      // Calculate next year's values
      for (let period = 0; period < n; period++) {
        balance = balance * (1 + r/n) + (monthlyContribution * 12/n);
        totalContributions += monthlyContribution * 12/n;
      }
    }

    return data;
  };

  const data = generateProjections();

  // Use projected results to validate calculations
  const lastDataPoint = data[data.length - 1];
  console.assert(
    Math.abs(lastDataPoint.balance - projectedResults?.futureValue) < 1,
    'Future value mismatch'
  );
  console.assert(
    Math.abs(lastDataPoint.contributions - projectedResults?.totalContributions) < 1,
    'Total contributions mismatch'
  );
  console.assert(
    Math.abs(lastDataPoint.interest - projectedResults?.totalInterest) < 1,
    'Total interest mismatch'
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Year {label}</p>
          {payload.map((entry) => (
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
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor' }}
            label=""
            height={30}
            scale="auto"
            allowDecimals={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor' }}
            label=""
            width={80}
            scale="auto"
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="contributions"
            name="Total Contributions"
            stroke="#22c55e"
            fill="url(#colorContributions)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="interest"
            name="Interest Earned"
            stroke="#3b82f6"
            fill="url(#colorInterest)"
            stackId="1"
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="Total Balance"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}