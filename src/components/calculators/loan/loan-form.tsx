import { useState, useEffect } from 'react';
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import { LoanDetails, DebtFacility, DebtType } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { DebtList } from "@/components/calculators/loan/debt-list";

interface LoanFormProps {
  loanDetails: LoanDetails;
  setLoanDetails: Dispatch<SetStateAction<LoanDetails>>;
}

const INTEREST_RATE_RANGES: Record<DebtType, { min: number; max: number }> = {
  personal: { min: 6, max: 36 },
  mortgage: { min: 3, max: 8 },
  auto: { min: 3, max: 15 },
  student: { min: 3, max: 12 },
  other: { min: 5, max: 30 },
  carLoan: { min: 3, max: 15 },
  studentLoan: { min: 3, max: 12 },
  creditCard: { min: 12, max: 29.99 },
  lineOfCredit: { min: 4, max: 20 },
  personalLoan: { min: 6, max: 36 },
  heloc: { min: 3, max: 10 },
} as const;

const getLoanTypeRange = (type: DebtType) => {
  // Map legacy loan types to their corresponding debt types
  const typeMap: Record<DebtType, DebtType> = {
    personal: 'personalLoan',
    mortgage: 'mortgage',
    auto: 'carLoan',
    student: 'studentLoan',
    other: 'other',
    carLoan: 'carLoan',
    studentLoan: 'studentLoan',
    creditCard: 'creditCard',
    lineOfCredit: 'lineOfCredit',
    personalLoan: 'personalLoan',
    heloc: 'heloc',
  };

  const mappedType = typeMap[type];
  return INTEREST_RATE_RANGES[mappedType];
};

export function LoanForm({ loanDetails, setLoanDetails }: LoanFormProps) {
  const [formattedAmount, setFormattedAmount] = useState('');
  const [formattedDownPayment, setFormattedDownPayment] = useState('');
  const [hasErrors, setHasErrors] = useState<Record<string, boolean>>({});

  type InputField = keyof LoanDetails;
  type InputValue = string | number | boolean | null | DebtFacility[];

  type NumericField = 'amount' | 'downPayment' | 'interestRate' | 'term' | 'monthlyIncome' | 'otherIncome';
  type BooleanField = 'includeInsurance';
  type NullableNumberField = 'creditScore';
  type DebtTypeField = 'type';
  type DebtArrayField = 'existingDebts';

  // Type guards
  const isNumericField = (field: InputField): field is NumericField =>
    ['amount', 'downPayment', 'interestRate', 'term', 'monthlyIncome', 'otherIncome'].includes(field as string);

  const isBooleanField = (field: InputField): field is BooleanField =>
    field === 'includeInsurance';

  const isNullableNumberField = (field: InputField): field is NullableNumberField =>
    field === 'creditScore';

  const isDebtTypeField = (field: InputField): field is DebtTypeField =>
    field === 'type';

  const isDebtArrayField = (field: InputField): field is DebtArrayField =>
    field === 'existingDebts';

  const handleInputChange = (field: InputField, value: InputValue) => {
    setLoanDetails(prev => {
      const newDetails = { ...prev };

      if (isDebtArrayField(field)) {
        newDetails[field] = value as DebtFacility[];
      } else if (isNullableNumberField(field)) {
        newDetails[field] = value === '' ? null : typeof value === 'string' ? parseInt(value) || null : (value as number | null);
      } else if (isDebtTypeField(field)) {
        newDetails[field] = value as DebtType;
      } else if (isBooleanField(field)) {
        newDetails[field] = value as boolean;
      } else if (isNumericField(field) && typeof value === 'string') {
        newDetails[field] = parseFloat(value) || 0;
      }

      return newDetails;
    });

    // Validate input using type guards
    if (isNumericField(field)) {
      const numericValue = typeof value === 'string' ? parseFloat(value) : (value as number);
      
      if (field === 'amount') {
        setHasErrors(prev => ({
          ...prev,
          amount: numericValue <= 0
        }));
      } else if (field === 'downPayment') {
        setHasErrors(prev => ({
          ...prev,
          downPayment: numericValue > loanDetails.amount
        }));
      } else if (field === 'monthlyIncome') {
        setHasErrors(prev => ({
          ...prev,
          monthlyIncome: numericValue <= 0
        }));
      }
    } else if (isNullableNumberField(field)) {
      const score = value === '' ? null : typeof value === 'string' ? parseInt(value) : (value as number | null);
      setHasErrors(prev => ({
        ...prev,
        creditScore: score !== null && (score < 300 || score > 850)
      }));
    }
  };

  useEffect(() => {
    setFormattedAmount(loanDetails.amount.toLocaleString());
    if (loanDetails.downPayment) {
      setFormattedDownPayment(loanDetails.downPayment.toLocaleString());
    }
  }, [loanDetails.amount, loanDetails.downPayment]);

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return isNaN(number) ? '' : number.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="amount" className={clsx(hasErrors.amount && "text-red-500")}>
            Loan Amount
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The total amount you wish to borrow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="amount"
          value={formattedAmount}
          onChange={(e) => {
            const formatted = formatCurrency(e.target.value);
            setFormattedAmount(formatted);
            handleInputChange('amount', formatted.replace(/[^0-9.-]+/g, ''));
          }}
          className={clsx(
            "font-mono",
            hasErrors.amount && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        {hasErrors.amount && (
          <p className="text-sm text-red-500">Please enter a valid loan amount</p>
        )}
      </div>

      <div className="grid gap-4">
        <Label 
          htmlFor="downPayment" 
          className={clsx(hasErrors.downPayment && "text-red-500")}
        >
          Down Payment (optional)
        </Label>
        <Input
          id="downPayment"
          value={formattedDownPayment}
          onChange={(e) => {
            const formatted = formatCurrency(e.target.value);
            setFormattedDownPayment(formatted);
            handleInputChange('downPayment', formatted.replace(/[^0-9.-]+/g, ''));
          }}
          placeholder="Enter down payment amount"
          className={clsx(
            "font-mono",
            hasErrors.downPayment && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        {hasErrors.downPayment && (
          <p className="text-sm text-red-500">Down payment cannot exceed loan amount</p>
        )}
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <span className={clsx(
            "text-sm",
            loanDetails.interestRate > getLoanTypeRange(loanDetails.type).max * 0.8 
              ? "text-yellow-500" 
              : "text-muted-foreground"
          )}>
            {loanDetails.interestRate.toFixed(2)}%
          </span>
        </div>
        <Slider
          id="interestRate"
          min={getLoanTypeRange(loanDetails.type).min}
          max={getLoanTypeRange(loanDetails.type).max}
          step={0.1}
          value={[loanDetails.interestRate]}
          onValueChange={([value]) => handleInputChange('interestRate', value)}
          className={clsx(
            loanDetails.interestRate > getLoanTypeRange(loanDetails.type).max * 0.8 && 
            "bg-yellow-100 dark:bg-yellow-900"
          )}
        />
      </div>

      <div className="grid gap-4">
        <Label htmlFor="loanType">Loan Type</Label>
        <Select
          value={loanDetails.type}
          onValueChange={(value) => handleInputChange('type', value)}
        >
          <SelectTrigger className={clsx("font-medium")}>
            <SelectValue placeholder="Select loan type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal Loan</SelectItem>
            <SelectItem value="mortgage">Mortgage</SelectItem>
            <SelectItem value="auto">Auto Loan</SelectItem>
            <SelectItem value="student">Student Loan</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        <Label htmlFor="loanTerm">Loan Term (years)</Label>
        <Input
          id="loanTerm"
          type="number"
          value={loanDetails.term}
          onChange={(e) => handleInputChange('term', e.target.value)}
          min="1"
          max="30"
          className={clsx(
            "font-mono",
            loanDetails.term > 25 && "border-yellow-500 focus-visible:ring-yellow-500"
          )}
        />
        {loanDetails.term > 25 && (
          <p className="text-sm text-yellow-500">Long loan terms increase total interest paid</p>
        )}
      </div>

      <div className="grid gap-4">
        <Label htmlFor="paymentFrequency">Payment Frequency</Label>
        <Select
          value={loanDetails.paymentFrequency}
          onValueChange={(value) => handleInputChange('paymentFrequency', value)}
        >
          <SelectTrigger className={clsx("font-medium")}>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="monthlyIncome">Monthly Income</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Your gross monthly income before taxes and deductions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="monthlyIncome"
          type="text"
          value={formatCurrency(loanDetails.monthlyIncome.toString())}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, '');
            handleInputChange('monthlyIncome', value);
          }}
          className={clsx(hasErrors.monthlyIncome && "border-red-500")}
        />
        {hasErrors.monthlyIncome && (
          <p className="text-sm text-red-500">Please enter a valid monthly income</p>
        )}
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="otherIncome">Other Annual Income</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Additional annual income such as bonuses, rental income, etc.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="otherIncome"
          type="text"
          value={formatCurrency(loanDetails.otherIncome.toString())}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, '');
            handleInputChange('otherIncome', value);
          }}
        />
      </div>

      {loanDetails.type === 'mortgage' && (
        <>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="propertyValue">Property Value</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The current market value of the property</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="propertyValue"
              type="text"
              value={formatCurrency(loanDetails.propertyValue?.toString() || '0')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleInputChange('propertyValue', value);
              }}
            />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="propertyTax">Annual Property Tax</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Annual property tax amount</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="propertyTax"
              type="text"
              value={formatCurrency(loanDetails.propertyTax?.toString() || '0')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleInputChange('propertyTax', value);
              }}
            />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="heatingCosts">Monthly Heating Costs</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Estimated monthly heating costs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="heatingCosts"
              type="text"
              value={formatCurrency(loanDetails.heatingCosts?.toString() || '0')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleInputChange('heatingCosts', value);
              }}
            />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="condoFees">Monthly Condo Fees</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Monthly condo/strata fees if applicable</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="condoFees"
              type="text"
              value={formatCurrency(loanDetails.condoFees?.toString() || '0')}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleInputChange('condoFees', value);
              }}
            />
          </div>
        </>
      )}

      <div className="grid gap-4">
        <Label 
          htmlFor="creditScore" 
          className={clsx(hasErrors.creditScore && "text-red-500")}
        >
          Credit Score (optional)
        </Label>
        <Input
          id="creditScore"
          type="number"
          value={loanDetails.creditScore ?? ''}
          onChange={(e) => handleInputChange('creditScore', e.target.value ? parseInt(e.target.value) : null)}
          min="300"
          max="850"
          placeholder="Enter your credit score"
          className={clsx(
            "font-mono",
            hasErrors.creditScore && "border-red-500 focus-visible:ring-red-500",
            loanDetails.creditScore && loanDetails.creditScore < 670 && "border-yellow-500 focus-visible:ring-yellow-500"
          )}
        />
        {hasErrors.creditScore && (
          <p className="text-sm text-red-500">Credit score must be between 300 and 850</p>
        )}
        {loanDetails.creditScore && loanDetails.creditScore < 670 && !hasErrors.creditScore && (
          <p className="text-sm text-yellow-500">Low credit score may result in higher interest rates</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="includeInsurance"
          checked={loanDetails.includeInsurance}
          onCheckedChange={(checked) => handleInputChange('includeInsurance', checked)}
          className={clsx(
            loanDetails.includeInsurance && "bg-green-500 hover:bg-green-600"
          )}
        />
        <Label htmlFor="includeInsurance">Include Loan Insurance</Label>
      </div>

      <DebtList
        debts={loanDetails.existingDebts}
        onDebtsChange={(debts) => handleInputChange('existingDebts', debts)}
      />
    </div>
  );
}