import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Asset, type Liability } from '@/lib/types';

interface NetWorthFormProps {
  assets: Asset[];
  liabilities: Liability[];
  setAssets: (assets: Asset[]) => void;
  setLiabilities: (liabilities: Liability[]) => void;
}

export function NetWorthForm({
  assets,
  liabilities,
  setAssets,
  setLiabilities,
}: NetWorthFormProps) {
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetCategory, setAssetCategory] = useState<Asset['category']>('cash');
  const [liabilityName, setLiabilityName] = useState('');
  const [liabilityValue, setLiabilityValue] = useState('');
  const [liabilityCategory, setLiabilityCategory] =
    useState<Liability['category']>('mortgage');

  const handleAddAsset = () => {
    if (assetName && assetValue) {
      setAssets([
        ...assets,
        {
          id: crypto.randomUUID(),
          name: assetName,
          value: parseFloat(assetValue),
          category: assetCategory,
        },
      ]);
      setAssetName('');
      setAssetValue('');
    }
  };

  const handleAddLiability = () => {
    if (liabilityName && liabilityValue) {
      setLiabilities([
        ...liabilities,
        {
          id: crypto.randomUUID(),
          name: liabilityName,
          value: parseFloat(liabilityValue),
          category: liabilityCategory,
        },
      ]);
      setLiabilityName('');
      setLiabilityValue('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Assets</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="assetName">Asset Name</Label>
            <Input
              id="assetName"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g., Savings Account"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assetValue">Value</Label>
            <Input
              id="assetValue"
              type="number"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assetCategory">Category</Label>
            <Select
              value={assetCategory}
              onValueChange={(value) =>
                setAssetCategory(value as Asset['category'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash & Bank Accounts</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="vehicles">Vehicles</SelectItem>
                <SelectItem value="other">Other Assets</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddAsset} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Asset
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Liabilities</h2>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="liabilityName">Liability Name</Label>
            <Input
              id="liabilityName"
              value={liabilityName}
              onChange={(e) => setLiabilityName(e.target.value)}
              placeholder="e.g., Mortgage"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="liabilityValue">Value</Label>
            <Input
              id="liabilityValue"
              type="number"
              value={liabilityValue}
              onChange={(e) => setLiabilityValue(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="liabilityCategory">Category</Label>
            <Select
              value={liabilityCategory}
              onValueChange={(value) =>
                setLiabilityCategory(value as Liability['category'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mortgage">Mortgage</SelectItem>
                <SelectItem value="loans">Loans</SelectItem>
                <SelectItem value="credit">Credit Cards</SelectItem>
                <SelectItem value="other">Other Liabilities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddLiability} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Liability
          </Button>
        </div>
      </div>
    </div>
  );
}