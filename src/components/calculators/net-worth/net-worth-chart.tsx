import { useState } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  LineChart,
  Line,
  ComposedChart,
  ResponsiveContainer,
} from 'recharts';
import { TooltipProps } from 'recharts';
import { NameType, ValueType, Payload } from 'recharts/types/component/DefaultTooltipContent';
import { type Asset, type Liability } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NetWorthChartProps {
  assets: Asset[];
  liabilities: Liability[];
  netWorth: number;
  historicalData?: {
    date: string;
    assets: Record<string, number>;
    liabilities: Record<string, number>;
    netWorth: number;
  }[];
}

export interface ChartDataEntry {
  name: string;
  value: number;
  fill: string;
  payload: {
    total: number;
    [key: string]: number;
  };
}

interface CustomPayload extends Payload<ValueType, NameType> {
  fill?: string;
}

const COLORS = {
  assets: {
    cash: '#4ade80',
    investments: '#34d399',
    property: '#2dd4bf',
    vehicles: '#22d3ee',
    other: '#38bdf8',
  },
  liabilities: {
    mortgage: '#f87171',
    loans: '#fb923c',
    credit: '#fbbf24',
    other: '#facc15',
  },
};

export function NetWorthChart({
  assets,
  liabilities,
  netWorth,
  historicalData = [],
}: NetWorthChartProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'breakdown' | 'trend'>('breakdown');

  // Format data for visualization
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercentage = (value: number, total: number) =>
    `${((Math.abs(value) / Math.abs(total)) * 100).toFixed(1)}%`;

  // Process assets and liabilities data
  const assetsByCategory = assets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);

  const liabilitiesByCategory = liabilities.reduce((acc, liability) => {
    acc[liability.category] = (acc[liability.category] || 0) + liability.value;
    return acc;
  }, {} as Record<string, number>);

  const totalAssets = Object.values(assetsByCategory).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(liabilitiesByCategory).reduce((a, b) => a + b, 0);

  // Prepare data for the breakdown chart
  const breakdownData = [
    {
      name: 'Assets',
      ...assetsByCategory,
      total: totalAssets,
    },
    {
      name: 'Liabilities',
      ...liabilitiesByCategory,
      total: -totalLiabilities,
    },
  ];

  // Prepare historical trend data
  const trendData = historicalData.length > 0 
    ? historicalData 
    : [
        {
          date: new Date().toISOString().split('T')[0],
          assets: assetsByCategory,
          liabilities: liabilitiesByCategory,
          netWorth,
        },
      ];

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filter categories based on selection
  const getFilteredData = () => {
    if (selectedCategories.length === 0) return breakdownData;

    return breakdownData.map(item => {
      const filteredItem: { [key: string]: string | number } = { name: item.name, total: 0 };
      Object.entries(item).forEach(([key, value]) => {
        if (key === 'name' || (key !== 'total' && selectedCategories.includes(key))) {
          filteredItem[key] = value;
          if (key !== 'name') filteredItem.total = (filteredItem.total as number || 0) + (value as number);
        }
      });
      return filteredItem;
    });
  };

  // Custom tooltip to show formatted values and percentages
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const total = Math.abs(payload[0]?.payload?.total || 0);
      
      return (
        <Card className="p-4">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry) => {
            const payloadEntry = entry as CustomPayload;
            const name = payloadEntry.name;
            const value = Math.abs(Number(payloadEntry.value) || 0);
            if (name === 'total' || value === 0) return null;
            
            return (
              <p key={name} className="text-sm flex items-center gap-2">
                <span
                  className="w-3 h-3 inline-block rounded-sm"
                  style={{ backgroundColor: payloadEntry.fill }}
                />
                <span className="flex-1">{name}:</span>
                <span className="font-medium">{formatCurrency(value)}</span>
                <span className="text-muted-foreground">
                  ({formatPercentage(value, total)})
                </span>
              </p>
            );
          })}
          <div className="mt-2 pt-2 border-t">
            <p className="text-sm font-medium">
              Total: {formatCurrency(Math.abs(total))}
            </p>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Net Worth Breakdown</h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'breakdown' ? 'default' : 'outline'}
            onClick={() => setViewMode('breakdown')}
            size="sm"
          >
            Breakdown
          </Button>
          <Button
            variant={viewMode === 'trend' ? 'default' : 'outline'}
            onClick={() => setViewMode('trend')}
            size="sm"
          >
            Trend
          </Button>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'breakdown' ? (
            <ComposedChart
              data={getFilteredData()}
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                label={{
                  value: 'Amount',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -20,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                onClick={(e: any) => e.dataKey && toggleCategory(e.dataKey.toString())}
                formatter={(value, entry: any) => (
                  <span className={`${entry.dataKey && selectedCategories.includes(entry.dataKey.toString()) ? 'opacity-50' : ''}`}>
                    {value}
                  </span>
                )}
              />
              <ReferenceLine y={0} stroke="#666" />
              {/* Asset categories */}
              {Object.keys(COLORS.assets).map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="assets"
                  fill={COLORS.assets[category as keyof typeof COLORS.assets]}
                  name={category.charAt(0).toUpperCase() + category.slice(1)}
                />
              ))}
              {/* Liability categories */}
              {Object.keys(COLORS.liabilities).map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="liabilities"
                  fill={COLORS.liabilities[category as keyof typeof COLORS.liabilities]}
                  name={category.charAt(0).toUpperCase() + category.slice(1)}
                />
              ))}
            </ComposedChart>
          ) : (
            <LineChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                label={{
                  value: 'Amount',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -20,
                }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="netWorth"
                name="Net Worth"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Net Worth: <span className={netWorth >= 0 ? "text-green-600" : "text-red-600"}>
          {formatCurrency(netWorth)}
        </span>
      </div>
    </div>
  );
}