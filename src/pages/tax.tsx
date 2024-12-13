import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TaxForm } from '@/components/calculators/tax/tax-form';
import { TaxSummary } from '@/components/calculators/tax/tax-summary';
import { TaxChart } from '@/components/calculators/tax/tax-chart';
import type { TaxDetails, FilingStatus, Province } from '@/lib/types';
import { useChat } from '@/lib/chat-context';

export function Tax() {
  const [taxDetails, setTaxDetails] = useState<TaxDetails>({
    income: {
      employment: 0,
      selfEmployment: 0,
      investments: 0,
      rental: 0,
      other: 0,
      rrspContributions: 0,
      tfsaContributions: 0,
      capitalGains: 0,
      eligibleDividends: 0,
      nonEligibleDividends: 0
    },
    deductions: {
      rrspDeduction: 0,
      unionDues: 0,
      childcare: 0,
      movingExpenses: 0,
      workFromHome: 0,
      studentLoan: 0,
      charitable: 0,
      medical: 0,
      disabilitySupports: 0
    },
    credits: {
      basicPersonal: 0,
      age: 0,
      pension: 0,
      disability: 0,
      caregiver: 0,
      education: 0,
      donations: 0,
      foreignTaxCredit: 0
    },
    personalInfo: {
      filingStatus: 'single' as FilingStatus,
      province: 'ON' as Province,
      dependents: 0,
      selfEmployed: false,
      hasDisability: false,
      age: 0,
      isCitizen: true,
      socialInsuranceNumber: ''
    }
  });

  const { setCalculatorData } = useChat();

  // Tax brackets for 2024 (example)
  const federalBrackets = [
    { rate: 0.10, single: 11600, married: 23200 },
    { rate: 0.12, single: 47150, married: 94300 },
    { rate: 0.22, single: 100525, married: 201050 },
    { rate: 0.24, single: 191950, married: 383900 },
    { rate: 0.32, single: 243725, married: 487450 },
    { rate: 0.35, single: 609350, married: 731200 },
    { rate: 0.37, single: Infinity, married: Infinity },
  ];

  // Calculate taxable income
  const calculateTaxableIncome = () => {
    const standardDeduction = taxDetails.personalInfo.filingStatus === 'married' ? 27700 : 13850;
    const totalDeductions = Object.values(taxDetails.deductions).reduce((a, b) => a + b, 0);
    const itemizedDeductions = Math.max(standardDeduction, totalDeductions);
    
    const totalIncome = Object.values(taxDetails.income).reduce((a, b) => a + b, 0);
    return Math.max(0, totalIncome - itemizedDeductions);
  };

  // Calculate federal tax
  const calculateFederalTax = () => {
    const taxableIncome = calculateTaxableIncome();
    let tax = 0;
    let remainingIncome = taxableIncome;
    let prevBracket = 0;

    for (const bracket of federalBrackets) {
      const bracketLimit = taxDetails.personalInfo.filingStatus === 'married' ? bracket.married : bracket.single;
      const incomeInBracket = Math.min(Math.max(0, remainingIncome), bracketLimit - prevBracket);
      tax += incomeInBracket * bracket.rate;
      remainingIncome -= incomeInBracket;
      prevBracket = bracketLimit;
      if (remainingIncome <= 0) break;
    }

    return tax;
  };

  // Calculate provincial tax (simplified example for ON)
  const calculateProvincialTax = () => {
    const taxableIncome = calculateTaxableIncome();
    // Simplified ON tax calculation
    if (taxableIncome <= 45916) return taxableIncome * 0.050;
    if (taxableIncome <= 90725) return 2295.80 + (taxableIncome - 45916) * 0.0915;
    if (taxableIncome <= 150000) return 7341.75 + (taxableIncome - 90725) * 0.1116;
    if (taxableIncome <= 220000) return 14068.75 + (taxableIncome - 150000) * 0.1216;
    return 24368.75 + (taxableIncome - 220000) * 0.1316;
  };

  // Calculate total tax
  const calculateTotalTax = () => {
    const federalTax = calculateFederalTax();
    const provincialTax = calculateProvincialTax();
    const taxableIncome = calculateTaxableIncome();
    return {
      federal: federalTax,
      provincial: provincialTax,
      total: federalTax + provincialTax,
      effectiveRate: ((federalTax + provincialTax) / taxableIncome) * 100,
    };
  };

  // Update calculator data
  const handleTaxUpdate = (newDetails: TaxDetails) => {
    setTaxDetails(newDetails);
    const taxableIncome = calculateTaxableIncome();
    const calculations = calculateTotalTax();

    setCalculatorData({
      type: 'tax',
      data: {
        taxableIncome,
        federalTax: calculations.federal,
        provincialTax: calculations.provincial,
        totalTax: calculations.total,
        effectiveRate: calculations.effectiveRate,
        marginalRate: federalBrackets.find(bracket => 
          (newDetails.personalInfo.filingStatus === 'married' ? bracket.married : bracket.single) > taxableIncome
        )?.rate || 0,
      },
    });
  };

  const taxableIncome = calculateTaxableIncome();
  const taxCalculations = calculateTotalTax();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <TaxForm data={taxDetails} onUpdate={handleTaxUpdate} />
        <div className="space-y-6">
          <Card className="p-6">
            <TaxSummary
              taxableIncome={taxableIncome}
              federalTax={taxCalculations.federal}
              provincialTax={taxCalculations.provincial}
              totalTax={taxCalculations.total}
              effectiveRate={taxCalculations.effectiveRate}
              marginalRate={
                (federalBrackets.find(bracket => 
                  (taxDetails.personalInfo.filingStatus === 'married' ? bracket.married : bracket.single) > taxableIncome
                )?.rate || 0) * 100
              }
              filingStatus={taxDetails.personalInfo.filingStatus}
              province={taxDetails.personalInfo.province}
            />
          </Card>
          <Card className="p-6">
            <TaxChart
              income={Object.values(taxDetails.income).reduce((a, b) => a + b, 0)}
              taxableIncome={taxableIncome}
              federalTax={taxCalculations.federal}
              deductions={taxDetails.deductions}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
