import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from 'recharts';
import { Card } from '@/components/ui/card';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface TaxChartProps {
  income: number;
  taxableIncome: number;
  federalTax: number;
  deductions: {
    rrspDeduction: number;
    unionDues: number;
    childcare: number;
    movingExpenses: number;
    workFromHome: number;
    studentLoan: number;
    charitable: number;
    medical: number;
    disabilitySupports: number;
  };
}

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      color: string;
    };
  }>;
}

export function TaxChart({
  income,
  taxableIncome,
  federalTax,
  deductions,
}: TaxChartProps) {
  const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
  const takeHomeIncome = taxableIncome - federalTax;
  const nonDeductibleIncome = income - taxableIncome - totalDeductions;

  // Create data for income breakdown
  const incomeData = [
    { name: 'Take Home', value: takeHomeIncome, color: '#4caf50' },
    { name: 'Federal Tax', value: federalTax, color: '#f44336' },
    { name: 'Deductions', value: totalDeductions, color: '#2196f3' },
    ...(nonDeductibleIncome > 0 ? [{ name: 'Non-Deductible', value: nonDeductibleIncome, color: '#ff9800' }] : []),
  ].filter(item => item.value > 0);

  // Create data for deductions breakdown
  const deductionsData = Object.entries(deductions)
    .map(([key, value]) => ({
      name: key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace('Rrsp', 'RRSP'),
      value,
      color: {
        rrspDeduction: '#8884d8',
        unionDues: '#82ca9d',
        childcare: '#ffc658',
        movingExpenses: '#ff8042',
        workFromHome: '#a4de6c',
        studentLoan: '#d0ed57',
        charitable: '#83a6ed',
        medical: '#8dd1e1',
        disabilitySupports: '#a4de6c',
      }[key] || '#94a3b8',
    }))
    .filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <Card className="p-3 !bg-white shadow-lg">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">
            {new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)}
          </p>
          {name === 'Take Home' && (
            <p className="text-xs text-muted-foreground mt-1">
              {((value / income) * 100).toFixed(1)}% of gross income
            </p>
          )}
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Income Summary */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Gross Income</p>
          <p className="font-medium">
            {new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(income)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Take Home</p>
          <p className="font-medium">
            {new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(takeHomeIncome)}
            <span className="text-xs text-muted-foreground ml-1">
              ({((takeHomeIncome / income) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>

      {/* Income Breakdown */}
      <div>
        <h3 className="text-sm font-medium mb-4">Income Breakdown</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deductions Breakdown */}
      {deductionsData.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-4">Deductions Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deductionsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deductionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
