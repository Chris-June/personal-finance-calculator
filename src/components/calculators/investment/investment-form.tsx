import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InvestmentDetails } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';

interface InvestmentFormProps {
  investmentDetails: InvestmentDetails;
  setInvestmentDetails: Dispatch<SetStateAction<InvestmentDetails>>;
}

export function InvestmentForm({
  investmentDetails,
  setInvestmentDetails,
}: InvestmentFormProps) {
  const handleInputChange = (field: keyof InvestmentDetails, value: string | number) => {
    setInvestmentDetails(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="initialAmount">Initial Investment</Label>
        <Input
          id="initialAmount"
          type="number"
          value={investmentDetails.initialAmount || ''}
          onChange={(e) => handleInputChange('initialAmount', e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
        <Input
          id="monthlyContribution"
          type="number"
          value={investmentDetails.monthlyContribution || ''}
          onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="annualReturn">Expected Annual Return (%)</Label>
        <Input
          id="annualReturn"
          type="number"
          value={investmentDetails.annualReturn || ''}
          onChange={(e) => handleInputChange('annualReturn', e.target.value)}
          placeholder="7.00"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="investmentPeriod">Investment Period (Years)</Label>
        <Input
          id="investmentPeriod"
          type="number"
          value={investmentDetails.investmentPeriod || ''}
          onChange={(e) => handleInputChange('investmentPeriod', e.target.value)}
          placeholder="10"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
        <Select
          value={investmentDetails.compoundingFrequency}
          onValueChange={(value: 'monthly' | 'quarterly' | 'annually') =>
            setInvestmentDetails(prev => ({
              ...prev,
              compoundingFrequency: value,
            }))
          }
        >
          <SelectTrigger id="compoundingFrequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="riskLevel">Risk Level</Label>
        <Select
          value={investmentDetails.riskLevel}
          onValueChange={(value: 'low' | 'moderate' | 'high') =>
            setInvestmentDetails(prev => ({
              ...prev,
              riskLevel: value,
            }))
          }
        >
          <SelectTrigger id="riskLevel">
            <SelectValue placeholder="Select risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="age">Your Age</Label>
        <Input
          id="age"
          type="number"
          value={investmentDetails.age || ''}
          onChange={(e) => handleInputChange('age', e.target.value)}
          placeholder="30"
        />
      </div>
    </div>
  );
}