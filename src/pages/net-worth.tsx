import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { NetWorthForm } from '@/components/calculators/net-worth/net-worth-form';
import { NetWorthChart } from '@/components/calculators/net-worth/net-worth-chart';
import { NetWorthSummary } from '@/components/calculators/net-worth/net-worth-summary';
import { NetWorthTips } from '@/components/calculators/net-worth/net-worth-tips';
import { useChat } from '@/lib/chat-context';
import type { Asset, Liability } from '@/lib/types';

const initialState = {
  assets: [] as Asset[],
  liabilities: [] as Liability[],
};

interface HistoricalData {
  date: string;
  assets: Record<string, number>;
  liabilities: Record<string, number>;
  netWorth: number;
}

export function NetWorth() {
  const [data, setData] = useState(initialState);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const { setCalculatorData } = useChat();

  // Calculate totals and metrics
  const totalAssets = useMemo(() => 
    data.assets.reduce((sum, asset) => sum + asset.value, 0),
    [data.assets]
  );

  const totalLiabilities = useMemo(() => 
    data.liabilities.reduce((sum, liability) => sum + liability.value, 0),
    [data.liabilities]
  );

  const netWorth = useMemo(() => totalAssets - totalLiabilities, [totalAssets, totalLiabilities]);

  // Calculate asset categories
  const liquidAssets = useMemo(() => 
    data.assets
      .filter(asset => asset.category === 'cash' || asset.category === 'savings')
      .reduce((sum, asset) => sum + asset.value, 0),
    [data.assets]
  );

  const realEstate = useMemo(() => 
    data.assets
      .filter(asset => asset.category === 'property')
      .reduce((sum, asset) => sum + asset.value, 0),
    [data.assets]
  );

  const investments = useMemo(() => 
    data.assets
      .filter(asset => asset.category === 'investment' || asset.category === 'retirement')
      .reduce((sum, asset) => sum + asset.value, 0),
    [data.assets]
  );

  // Update historical data when current data changes
  useEffect(() => {
    const assetsByCategory = data.assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + asset.value;
      return acc;
    }, {} as Record<string, number>);

    const liabilitiesByCategory = data.liabilities.reduce((acc, liability) => {
      acc[liability.category] = (acc[liability.category] || 0) + liability.value;
      return acc;
    }, {} as Record<string, number>);

    // Only add new data point if values have changed
    const lastEntry = historicalData[historicalData.length - 1];
    const hasChanged = !lastEntry || 
      lastEntry.netWorth !== netWorth || 
      JSON.stringify(lastEntry.assets) !== JSON.stringify(assetsByCategory) ||
      JSON.stringify(lastEntry.liabilities) !== JSON.stringify(liabilitiesByCategory);

    if (hasChanged && (data.assets.length > 0 || data.liabilities.length > 0)) {
      setHistoricalData(prev => [...prev, {
        date: new Date().toISOString().split('T')[0],
        assets: assetsByCategory,
        liabilities: liabilitiesByCategory,
        netWorth,
      }]);
    }
  }, [data, netWorth, historicalData]);

  // Update chat context whenever financial data changes
  useEffect(() => {
    const assetsByCategory = data.assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + asset.value;
      return acc;
    }, {} as Record<string, number>);

    const liabilitiesByCategory = data.liabilities.reduce((acc, liability) => {
      acc[liability.category] = (acc[liability.category] || 0) + liability.value;
      return acc;
    }, {} as Record<string, number>);

    setCalculatorData({
      totalAssets,
      totalLiabilities,
      netWorth,
      assetsByCategory,
      liabilitiesByCategory,
      assets: data.assets,
      liabilities: data.liabilities,
      historicalData,
    });
  }, [
    data,
    totalAssets,
    totalLiabilities,
    netWorth,
    setCalculatorData,
    historicalData,
  ]);

  const handleAssetUpdate = (newAssets: Asset[]) => {
    setData(prev => ({ ...prev, assets: newAssets }));
  };

  const handleLiabilityUpdate = (newLiabilities: Liability[]) => {
    setData(prev => ({ ...prev, liabilities: newLiabilities }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Net Worth Calculator</h1>
          <p className="text-muted-foreground mb-6">
            Track your assets and liabilities to understand your overall financial position.
          </p>
          <NetWorthForm
            assets={data.assets}
            liabilities={data.liabilities}
            setAssets={handleAssetUpdate}
            setLiabilities={handleLiabilityUpdate}
          />
        </Card>
      </div>
      <div className="space-y-6">
        <NetWorthSummary
          totalAssets={totalAssets}
          totalLiabilities={totalLiabilities}
          netWorth={netWorth}
        />
        <Card className="p-6">
          <NetWorthChart
            assets={data.assets}
            liabilities={data.liabilities}
            netWorth={netWorth}
            historicalData={historicalData}
          />
        </Card>
        <NetWorthTips
          netWorthMetrics={{
            totalAssets,
            totalLiabilities,
            netWorth,
            liquidAssets,
            realEstate,
            investments,
            shortTermDebt: 0,
            longTermDebt: 0,
          }}
        />
      </div>
    </div>
  );
}
