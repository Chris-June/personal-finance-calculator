import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { NetWorthForm } from '@/components/calculators/net-worth/net-worth-form';
import { NetWorthChart } from '@/components/calculators/net-worth/net-worth-chart';
import { NetWorthSummary } from '@/components/calculators/net-worth/net-worth-summary';
import { NetWorthTips } from '@/components/calculators/net-worth/net-worth-tips';
import { type Asset, type Liability } from '@/lib/types';
import { useChat } from '@/lib/chat-context';

export function NetWorth() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const { setCalculatorData } = useChat();

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce(
    (sum, liability) => sum + liability.value,
    0
  );
  const netWorth = totalAssets - totalLiabilities;

  // Calculate asset categories
  const liquidAssets = assets
    .filter(asset => asset.category === 'Cash' || asset.category === 'Bank Accounts')
    .reduce((sum, asset) => sum + asset.value, 0);

  const investmentAssets = assets
    .filter(asset => asset.category === 'Investments' || asset.category === 'Retirement')
    .reduce((sum, asset) => sum + asset.value, 0);

  const personalAssets = assets
    .filter(asset => asset.category === 'Personal Property' || asset.category === 'Real Estate')
    .reduce((sum, asset) => sum + asset.value, 0);

  // Calculate liability categories
  const shortTermDebt = liabilities
    .filter(liability => liability.category === 'Credit Cards' || liability.category === 'Personal Loans')
    .reduce((sum, liability) => sum + liability.value, 0);

  const longTermDebt = liabilities
    .filter(liability => liability.category === 'Mortgage' || liability.category === 'Student Loans')
    .reduce((sum, liability) => sum + liability.value, 0);

  // Update chat context whenever financial data changes
  useEffect(() => {
    const assetsByCategory = assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + asset.value;
      return acc;
    }, {} as Record<string, number>);

    const liabilitiesByCategory = liabilities.reduce((acc, liability) => {
      acc[liability.category] = (acc[liability.category] || 0) + liability.value;
      return acc;
    }, {} as Record<string, number>);

    setCalculatorData({
      totalAssets,
      totalLiabilities,
      netWorth,
      assetsByCategory,
      liabilitiesByCategory,
      assets,
      liabilities,
    });
  }, [assets, liabilities, totalAssets, totalLiabilities, netWorth, setCalculatorData]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6">Net Worth Calculator</h1>
            <p className="text-muted-foreground mb-6">
              Calculate your net worth by adding your assets and liabilities. Your net
              worth is the total value of your assets minus your liabilities.
            </p>
            <NetWorthForm
              assets={assets}
              setAssets={setAssets}
              liabilities={liabilities}
              setLiabilities={setLiabilities}
            />
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <NetWorthSummary
              assets={assets}
              liabilities={liabilities}
              netWorth={netWorth}
            />
          </Card>
          <Card className="p-6">
            <NetWorthChart
              assets={assets}
              liabilities={liabilities}
              netWorth={netWorth}
            />
          </Card>
        </div>
      </div>
      
      {/* Tips Section */}
      <NetWorthTips
        totalAssets={totalAssets}
        totalLiabilities={totalLiabilities}
        netWorth={netWorth}
        liquidAssets={liquidAssets}
        investmentAssets={investmentAssets}
        personalAssets={personalAssets}
        shortTermDebt={shortTermDebt}
        longTermDebt={longTermDebt}
      />
    </div>
  );
}