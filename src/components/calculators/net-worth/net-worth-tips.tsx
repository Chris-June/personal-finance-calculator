import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  Home, 
  Wallet,
  DollarSign,
  CreditCard,

  Shield,
  
  AlertTriangle,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NetWorthTipsProps {
  netWorthMetrics: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    liquidAssets: number;
    realEstate: number;
    investments: number;
    shortTermDebt: number;
    longTermDebt: number;
  } | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(value);

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

export function NetWorthTips({ netWorthMetrics }: NetWorthTipsProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  if (!netWorthMetrics) {
    return (
      <Alert>
        <AlertTitle>No Net Worth Data Available</AlertTitle>
        <AlertDescription>
          Enter your assets and liabilities to see personalized insights and recommendations.
        </AlertDescription>
      </Alert>
    );
  }

  const {
    totalAssets,
    totalLiabilities,
    netWorth,
    liquidAssets,
    realEstate,
    investments,
    shortTermDebt,
    longTermDebt
  } = netWorthMetrics;

  // Calculate key financial ratios
  const liquidityRatio = (liquidAssets / totalAssets) * 100;
  const debtToAssetRatio = (totalLiabilities / totalAssets) * 100;
  const shortTermDebtRatio = totalLiabilities ? (shortTermDebt / totalLiabilities) * 100 : 0;
  const investmentRatio = (investments / totalAssets) * 100;
  const realEstateRatio = (realEstate / totalAssets) * 100;
  const netWorthRatio = totalAssets ? (netWorth / totalAssets) * 100 : 0;

  // Define target ranges for each metric
  const targetRanges = {
    liquidityRatio: { min: 20, ideal: 30, max: 40 },
    debtToAssetRatio: { min: 0, ideal: 30, max: 50 },
    investmentRatio: { min: 30, ideal: 40, max: 60 },
    realEstateRatio: { min: 0, ideal: 35, max: 75 },
  };

  // Generate overall financial health score (0-100)
  const calculateHealthScore = () => {
    const scores = [
      // Liquidity score (0-20)
      Math.min(20, (liquidityRatio / targetRanges.liquidityRatio.ideal) * 20),
      // Debt management score (0-30)
      Math.max(0, 30 - (debtToAssetRatio / targetRanges.debtToAssetRatio.max) * 30),
      // Investment allocation score (0-30)
      Math.min(30, (investmentRatio / targetRanges.investmentRatio.ideal) * 30),
      // Diversification score (0-20)
      Math.max(0, 20 - Math.abs(realEstateRatio - targetRanges.realEstateRatio.ideal) / 2),
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0));
  };

  const healthScore = calculateHealthScore();

  const insights = [
    {
      icon: Shield,
      title: 'Financial Health Score',
      description: `Your overall financial health score is ${healthScore}/100`,
      score: healthScore,
      type: healthScore >= 70 ? 'success' : healthScore >= 50 ? 'warning' : 'danger',
      details: {
        title: 'Understanding Your Financial Health Score',
        metrics: [
          { name: 'Liquidity', value: liquidityRatio, target: targetRanges.liquidityRatio.ideal },
          { name: 'Debt Management', value: 100 - debtToAssetRatio, target: 70 },
          { name: 'Investment Growth', value: investmentRatio, target: targetRanges.investmentRatio.ideal },
          { name: 'Diversification', value: Math.max(0, 100 - Math.abs(realEstateRatio - targetRanges.realEstateRatio.ideal) * 2), target: 100 },
        ],
        recommendations: [
          'Maintain emergency funds of 3-6 months of expenses',
          'Keep debt-to-asset ratio below 50%',
          'Diversify investments across different asset classes',
          'Balance between liquid and illiquid assets',
        ],
      },
    },
    {
      icon: DollarSign,
      title: 'Net Worth Status',
      description: netWorth < 0
        ? `Negative net worth of ${formatCurrency(netWorth)}`
        : `Positive net worth of ${formatCurrency(netWorth)}`,
      score: Math.max(0, Math.min(100, netWorthRatio)),
      type: netWorth < 0 ? 'danger' : netWorthRatio > 50 ? 'success' : 'warning',
      details: {
        title: 'Net Worth Analysis',
        metrics: [
          { name: 'Total Assets', value: totalAssets, format: 'currency' },
          { name: 'Total Liabilities', value: totalLiabilities, format: 'currency' },
          { name: 'Net Worth', value: netWorth, format: 'currency' },
          { name: 'Net Worth Ratio', value: netWorthRatio, format: 'percentage' },
        ],
        recommendations: netWorth < 0 ? [
          'Focus on debt reduction strategies',
          'Look for ways to increase income',
          'Minimize non-essential expenses',
          'Consider debt consolidation',
        ] : [
          'Continue building emergency savings',
          'Look for investment opportunities',
          'Consider tax-efficient strategies',
          'Review and update financial goals',
        ],
      },
    },
    {
      icon: Wallet,
      title: 'Liquidity Position',
      description: `${formatCurrency(liquidAssets)} in liquid assets (${formatPercentage(liquidityRatio)} of total assets)`,
      score: Math.min(100, (liquidityRatio / targetRanges.liquidityRatio.ideal) * 100),
      type: liquidityRatio < targetRanges.liquidityRatio.min ? 'danger' 
          : liquidityRatio > targetRanges.liquidityRatio.max ? 'warning' 
          : 'success',
      details: {
        title: 'Liquidity Analysis',
        metrics: [
          { name: 'Liquid Assets', value: liquidAssets, format: 'currency' },
          { name: 'Liquidity Ratio', value: liquidityRatio, format: 'percentage' },
          { name: 'Target Range', value: [targetRanges.liquidityRatio.min, targetRanges.liquidityRatio.max], format: 'range' },
        ],
        recommendations: liquidityRatio < targetRanges.liquidityRatio.min ? [
          'Build emergency fund to cover 3-6 months of expenses',
          'Consider reducing non-essential expenses',
          'Look for ways to increase cash savings',
          'Review monthly budget allocation',
        ] : liquidityRatio > targetRanges.liquidityRatio.max ? [
          'Consider investing excess cash',
          'Look for higher-yield investment opportunities',
          'Review investment strategy',
          'Consider dollar-cost averaging into markets',
        ] : [
          'Maintain current liquidity levels',
          'Regular review of emergency fund',
          'Consider inflation protection strategies',
          'Monitor cash flow patterns',
        ],
      },
    },
    {
      icon: CreditCard,
      title: 'Debt Management',
      description: `Debt-to-asset ratio: ${formatPercentage(debtToAssetRatio)} (${formatPercentage(shortTermDebtRatio)} short-term)`,
      score: Math.max(0, 100 - (debtToAssetRatio / targetRanges.debtToAssetRatio.max) * 100),
      type: debtToAssetRatio > targetRanges.debtToAssetRatio.max ? 'danger'
          : debtToAssetRatio > targetRanges.debtToAssetRatio.ideal ? 'warning'
          : 'success',
      details: {
        title: 'Debt Analysis',
        metrics: [
          { name: 'Total Debt', value: totalLiabilities, format: 'currency' },
          { name: 'Short-term Debt', value: shortTermDebt, format: 'currency' },
          { name: 'Long-term Debt', value: longTermDebt, format: 'currency' },
          { name: 'Short-term Debt Ratio', value: shortTermDebtRatio, format: 'percentage' },
          { name: 'Debt-to-Asset Ratio', value: debtToAssetRatio, format: 'percentage' },
        ],
        recommendations: debtToAssetRatio > targetRanges.debtToAssetRatio.max ? [
          'Focus on paying down high-interest debt',
          shortTermDebtRatio > 30 ? 'Prioritize reducing short-term debt' : 'Maintain current short-term debt levels',
          'Review and reduce expenses',
          'Avoid taking on new debt',
        ] : [
          'Maintain current debt management strategy',
          'Consider refinancing options if available',
          'Build emergency fund to avoid new debt',
          'Review interest rates periodically',
        ],
      },
    },
    {
      icon: TrendingUp,
      title: 'Investment Growth',
      description: `${formatCurrency(investments)} invested (${formatPercentage(investmentRatio)} of assets)`,
      score: Math.min(100, (investmentRatio / targetRanges.investmentRatio.ideal) * 100),
      type: investmentRatio < targetRanges.investmentRatio.min ? 'warning'
          : investmentRatio > targetRanges.investmentRatio.max ? 'warning'
          : 'success',
      details: {
        title: 'Investment Analysis',
        metrics: [
          { name: 'Total Investments', value: investments, format: 'currency' },
          { name: 'Investment Ratio', value: investmentRatio, format: 'percentage' },
          { name: 'Target Range', value: [targetRanges.investmentRatio.min, targetRanges.investmentRatio.max], format: 'range' },
        ],
        recommendations: investmentRatio < targetRanges.investmentRatio.min ? [
          'Consider increasing investment contributions',
          'Review risk tolerance and time horizon',
          'Explore tax-advantaged investment options',
          'Consider professional financial advice',
        ] : [
          'Maintain diversified investment portfolio',
          'Regular portfolio rebalancing',
          'Review investment strategy annually',
          'Consider tax-efficient investment options',
        ],
      },
    },
    {
      icon: Home,
      title: 'Asset Diversification',
      description: `Real estate: ${formatPercentage(realEstateRatio)} of total assets`,
      score: Math.max(0, 100 - Math.abs(realEstateRatio - targetRanges.realEstateRatio.ideal) * 2),
      type: realEstateRatio > targetRanges.realEstateRatio.max ? 'warning'
          : realEstateRatio < targetRanges.realEstateRatio.min ? 'warning'
          : 'success',
      details: {
        title: 'Diversification Analysis',
        metrics: [
          { name: 'Real Estate', value: realEstate, format: 'currency' },
          { name: 'Real Estate Ratio', value: realEstateRatio, format: 'percentage' },
          { name: 'Target Range', value: [targetRanges.realEstateRatio.min, targetRanges.realEstateRatio.max], format: 'range' },
        ],
        recommendations: realEstateRatio > targetRanges.realEstateRatio.max ? [
          'Consider diversifying into other asset classes',
          'Review property investment strategy',
          'Consider REITs for liquidity',
          'Evaluate property maintenance costs',
        ] : [
          'Maintain balanced asset allocation',
          'Regular review of property values',
          'Consider real estate opportunities',
          'Evaluate property tax efficiency',
        ],
      },
    },
  ];

  const formatMetricValue = (metric: { 
    name: string; 
    value: number | number[]; 
    target?: number;
    format?: string;
  }) => {
    if (Array.isArray(metric.value)) {
      return `${metric.value[0]}% - ${metric.value[1]}%`;
    }
    switch (metric.format) {
      case 'currency':
        return formatCurrency(metric.value);
      case 'percentage':
        return formatPercentage(metric.value);
      default:
        if (metric.target !== undefined) {
          return `${formatPercentage(metric.value)} / ${formatPercentage(metric.target)}`;
        }
        return metric.value.toString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Net Worth Insights</h2>
        <div className="text-sm text-muted-foreground">
          Health Score: {healthScore}/100
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className={cn(
              'p-4 cursor-pointer transition-all hover:shadow-md',
              selectedMetric === insight.title ? 'ring-2 ring-primary' : ''
            )}
            onClick={() => setSelectedMetric(selectedMetric === insight.title ? null : insight.title)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <insight.icon className={cn(
                  'h-5 w-5',
                  insight.type === 'success' ? 'text-green-500' :
                  insight.type === 'warning' ? 'text-yellow-500' :
                  'text-red-500'
                )} />
                <div className="font-semibold">{insight.title}</div>
              </div>
              {insight.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : insight.type === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <div className="mt-2">
              <div className="text-sm text-muted-foreground">{insight.description}</div>
              <Progress
                value={insight.score}
                className={cn(
                  "mt-2",
                  insight.type === 'success' ? 'bg-green-500' :
                  insight.type === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                )}
              />
            </div>

            {selectedMetric === insight.title && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  {insight.details.metrics.map((metric, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{metric.name}</span>
                      <span className="font-medium">{formatMetricValue(metric)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    {insight.details.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedMetric(null)}
                >
                  Close Details
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
