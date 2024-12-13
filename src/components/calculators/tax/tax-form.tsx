import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { TaxDetails, FilingStatus, Province } from '@/lib/types';

interface TaxFormProps {
  data: TaxDetails;
  onUpdate: (data: TaxDetails) => void;
}

export function TaxForm({ data, onUpdate }: TaxFormProps) {
  const handleInputChange = (
    category: keyof TaxDetails,
    field: string,
    value: string | number | boolean
  ) => {
    if (category === 'personalInfo') {
      onUpdate({
        ...data,
        personalInfo: {
          ...data.personalInfo,
          [field]: value,
        },
      });
    } else if (category === 'income' || category === 'deductions' || category === 'credits') {
      const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      onUpdate({
        ...data,
        [category]: {
          ...data[category],
          [field]: numericValue,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Income Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Income</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="employment" className="cursor-help">Employment Income</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total income from salary, wages, and other employment sources</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="employment"
              type="number"
              value={data.income.employment || 0}
              onChange={(e) => handleInputChange('income', 'employment', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="selfEmployment">Self-Employment Income</Label>
            <Input
              id="selfEmployment"
              type="number"
              value={data.income.selfEmployment || 0}
              onChange={(e) => handleInputChange('income', 'selfEmployment', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investments">Investment Income</Label>
            <Input
              id="investments"
              type="number"
              value={data.income.investments || 0}
              onChange={(e) => handleInputChange('income', 'investments', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rental">Rental Income</Label>
            <Input
              id="rental"
              type="number"
              value={data.income.rental || 0}
              onChange={(e) => handleInputChange('income', 'rental', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other">Other Income</Label>
            <Input
              id="other"
              type="number"
              value={data.income.other || 0}
              onChange={(e) => handleInputChange('income', 'other', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Deductions Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Deductions</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="rrspDeduction" className="cursor-help">RRSP Deduction</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Registered Retirement Savings Plan contributions for the tax year</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="rrspDeduction"
              type="number"
              value={data.deductions.rrspDeduction || 0}
              onChange={(e) => handleInputChange('deductions', 'rrspDeduction', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="unionDues" className="cursor-help">Union Dues</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Annual union, professional, or like dues</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="unionDues"
              type="number"
              value={data.deductions.unionDues || 0}
              onChange={(e) => handleInputChange('deductions', 'unionDues', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="childcare" className="cursor-help">Child Care Expenses</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Expenses paid for child care services</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="childcare"
              type="number"
              value={data.deductions.childcare || 0}
              onChange={(e) => handleInputChange('deductions', 'childcare', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="movingExpenses" className="cursor-help">Moving Expenses</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eligible moving expenses for work or study</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="movingExpenses"
              type="number"
              value={data.deductions.movingExpenses || 0}
              onChange={(e) => handleInputChange('deductions', 'movingExpenses', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="workFromHome" className="cursor-help">Work from Home Expenses</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Expenses related to working from home during the tax year</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="workFromHome"
              type="number"
              value={data.deductions.workFromHome || 0}
              onChange={(e) => handleInputChange('deductions', 'workFromHome', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="studentLoan" className="cursor-help">Student Loan Interest</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Interest paid on qualifying student loans</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="studentLoan"
              type="number"
              value={data.deductions.studentLoan || 0}
              onChange={(e) => handleInputChange('deductions', 'studentLoan', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="charitable" className="cursor-help">Charitable Donations</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Donations to registered charities</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="charitable"
              type="number"
              value={data.deductions.charitable || 0}
              onChange={(e) => handleInputChange('deductions', 'charitable', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="medical" className="cursor-help">Medical Expenses</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eligible medical expenses not covered by insurance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="medical"
              type="number"
              value={data.deductions.medical || 0}
              onChange={(e) => handleInputChange('deductions', 'medical', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="disabilitySupports" className="cursor-help">Disability Supports</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Expenses for disability supports required for employment or education</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="disabilitySupports"
              type="number"
              value={data.deductions.disabilitySupports || 0}
              onChange={(e) => handleInputChange('deductions', 'disabilitySupports', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Filing Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Filing Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="filingStatus" className="cursor-help">Filing Status</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your tax filing status affects your tax rate and deductions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select
              value={data.personalInfo.filingStatus}
              onValueChange={(value: FilingStatus) => handleInputChange('personalInfo', 'filingStatus', value)}
            >
              <SelectTrigger id="filingStatus">
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married or Common-Law</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="province" className="cursor-help">Province/Territory</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your province or territory of residence as of December 31st</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select
              value={data.personalInfo.province}
              onValueChange={(value: Province) => handleInputChange('personalInfo', 'province', value)}
            >
              <SelectTrigger id="province">
                <SelectValue placeholder="Select province/territory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AB">Alberta</SelectItem>
                <SelectItem value="BC">British Columbia</SelectItem>
                <SelectItem value="MB">Manitoba</SelectItem>
                <SelectItem value="NB">New Brunswick</SelectItem>
                <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                <SelectItem value="NS">Nova Scotia</SelectItem>
                <SelectItem value="NT">Northwest Territories</SelectItem>
                <SelectItem value="NU">Nunavut</SelectItem>
                <SelectItem value="ON">Ontario</SelectItem>
                <SelectItem value="PE">Prince Edward Island</SelectItem>
                <SelectItem value="QC">Quebec</SelectItem>
                <SelectItem value="SK">Saskatchewan</SelectItem>
                <SelectItem value="YT">Yukon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="dependents" className="cursor-help">Number of Dependents</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of eligible dependents you can claim on your tax return</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              id="dependents"
              type="number"
              value={data.personalInfo.dependents}
              onChange={(e) => handleInputChange('personalInfo', 'dependents', parseInt(e.target.value) || 0)}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-help">
                    <Switch
                      id="selfEmployed"
                      checked={data.personalInfo.selfEmployed}
                      onCheckedChange={(checked) => handleInputChange('personalInfo', 'selfEmployed', checked)}
                    />
                    <Label htmlFor="selfEmployed">Self Employed</Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select if you have self-employment income or run a business</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
