import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RetirementDetails } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';
import { GoalInput } from '../shared/goal-input';

const RETIREMENT_GOAL_TYPES = [
  { value: 'travel', label: 'Travel' },
  { value: 'home', label: 'Home Purchase/Renovation' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'legacy', label: 'Legacy/Inheritance' },
  { value: 'other', label: 'Other' },
];

interface RetirementFormProps {
  retirementDetails: RetirementDetails;
  setRetirementDetails: Dispatch<SetStateAction<RetirementDetails>>;
}

export function RetirementForm({
  retirementDetails,
  setRetirementDetails,
}: RetirementFormProps) {
  const updateField = (field: keyof RetirementDetails, value: number) => {
    setRetirementDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="currentAge">Current Age</Label>
          <Input
            id="currentAge"
            type="number"
            value={retirementDetails.currentAge || ''}
            onChange={(e) => updateField('currentAge', parseInt(e.target.value) || 0)}
            placeholder="30"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="retirementAge">Retirement Age</Label>
          <Input
            id="retirementAge"
            type="number"
            value={retirementDetails.retirementAge || ''}
            onChange={(e) => updateField('retirementAge', parseInt(e.target.value) || 0)}
            placeholder="65"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="currentSavings">Current Savings</Label>
          <Input
            id="currentSavings"
            type="number"
            value={retirementDetails.currentSavings || ''}
            onChange={(e) => updateField('currentSavings', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
          <Input
            id="monthlyContribution"
            type="number"
            value={retirementDetails.monthlyContribution || ''}
            onChange={(e) => updateField('monthlyContribution', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="expectedReturn">Expected Return (%)</Label>
          <Input
            id="expectedReturn"
            type="number"
            value={retirementDetails.expectedReturn || ''}
            onChange={(e) => updateField('expectedReturn', parseFloat(e.target.value) || 0)}
            placeholder="7.0"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
          <Input
            id="inflationRate"
            type="number"
            value={retirementDetails.inflationRate || ''}
            onChange={(e) => updateField('inflationRate', parseFloat(e.target.value) || 0)}
            placeholder="2.5"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="desiredIncome">Desired Annual Income</Label>
          <Input
            id="desiredIncome"
            type="number"
            value={retirementDetails.desiredIncome || ''}
            onChange={(e) => updateField('desiredIncome', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="socialSecurity">Expected Social Security</Label>
          <Input
            id="socialSecurity"
            type="number"
            value={retirementDetails.socialSecurity || ''}
            onChange={(e) => updateField('socialSecurity', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Retirement Goals</Label>
        <GoalInput
          goals={retirementDetails.goals}
          setGoals={(goals) => setRetirementDetails(prev => ({ ...prev, goals }))}
          goalTypes={RETIREMENT_GOAL_TYPES}
        />
      </div>
    </div>
  );
}