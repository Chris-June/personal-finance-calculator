import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TaxForm } from '@/components/calculators/tax/tax-form';
import { TaxSummary } from '@/components/calculators/tax/tax-summary';
import { TaxChart } from '@/components/calculators/tax/tax-chart';
import type { TaxDetails } from '@/lib/types';
import { useChat } from '@/lib/chat-context';

export function Tax() {
  const [taxDetails, setTaxDetails] = useState<TaxDetails>({
    income: 0,
    filingStatus: 'single',
    deductions: {
      mortgage: 0,
      studentLoan: 0,
      charitable: 0,
      medical: 0,
      retirement: 0,
      stateLocal: 0,
    },
    dependents: 0,
    selfEmployed: false,
    state: 'CA',
    year: new Date().getFullYear(),
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
    const standardDeduction = taxDetails.filingStatus === 'married' ? 27700 : 13850;
    const totalDeductions = Object.values(taxDetails.deductions).reduce((a, b) => a + b, 0);
    const itemizedDeductions = Math.max(standardDeduction, totalDeductions);
    
    return Math.max(0, taxDetails.income - itemizedDeductions);
  };

  // Calculate federal tax
  const calculateFederalTax = () => {
    const taxableIncome = calculateTaxableIncome();
    const brackets = federalBrackets;
    const limits = taxDetails.filingStatus === 'married' ? 
      brackets.map(b => b.married) : 
      brackets.map(b => b.single);

    let tax = 0;
    let remainingIncome = taxableIncome;

    for (let i = 0; i < brackets.length; i++) {
      const bracketSize = i === 0 ? 
        limits[0] : 
        limits[i] - limits[i-1];
      
      const taxableInBracket = Math.min(remainingIncome, bracketSize);
      tax += taxableInBracket * brackets[i].rate;
      remainingIncome -= taxableInBracket;

      if (remainingIncome <= 0) break;
    }

    return tax;
  };

  // Calculate effective tax rate
  const calculateEffectiveTaxRate = () => {
    const federalTax = calculateFederalTax();
    return (federalTax / taxDetails.income) * 100;
  };

  // Calculate marginal tax rate
  const calculateMarginalTaxRate = () => {
    const taxableIncome = calculateTaxableIncome();
    const brackets = federalBrackets;
    const limits = taxDetails.filingStatus === 'married' ? 
      brackets.map(b => b.married) : 
      brackets.map(b => b.single);

    for (let i = 0; i < brackets.length; i++) {
      if (taxableIncome <= limits[i]) {
        return brackets[i].rate * 100;
      }
    }
    return brackets[brackets.length - 1].rate * 100;
  };

  // Calculate potential tax savings
  const calculatePotentialSavings = () => {
    const currentTax = calculateFederalTax();
    
    // Calculate tax with maxed out retirement contributions
    const maxRetirement = Math.min(22500, taxDetails.income * 0.1); // 2024 401(k) limit
    const potentialRetirementSavings = (currentTax - calculateFederalTax()) * 
      (maxRetirement / (taxDetails.deductions.retirement || 1));

    // Calculate tax with increased charitable giving
    const potentialCharitableSavings = taxDetails.income * 0.01 * calculateMarginalTaxRate() / 100;

    return {
      retirement: potentialRetirementSavings,
      charitable: potentialCharitableSavings,
    };
  };

  const taxableIncome = calculateTaxableIncome();
  const federalTax = calculateFederalTax();
  const effectiveTaxRate = calculateEffectiveTaxRate();
  const marginalTaxRate = calculateMarginalTaxRate();
  const potentialSavings = calculatePotentialSavings();

  // Update chat context
  useState(() => {
    setCalculatorData({
      taxDetails,
      analysis: {
        taxableIncome,
        federalTax,
        effectiveTaxRate,
        marginalTaxRate,
        potentialSavings,
      },
    });
  }, [taxDetails]);

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tax Calculator
        </h1>
        <p className="text-muted-foreground">
          Estimate your tax liability and discover opportunities for tax savings.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* Main Content */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Tax Details</h2>
            <TaxForm
              data={taxDetails}
              onUpdate={setTaxDetails}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Tax Breakdown</h2>
            <TaxChart
              income={taxDetails.income}
              taxableIncome={taxableIncome}
              federalTax={federalTax}
              deductions={taxDetails.deductions}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Summary</h2>
            <TaxSummary
              taxableIncome={taxableIncome}
              federalTax={federalTax}
              effectiveTaxRate={effectiveTaxRate}
              marginalTaxRate={marginalTaxRate}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Tips & Insights</h2>
            <div className="space-y-4 text-sm">
              {/* Tax Bracket Analysis */}
              <div>
                <h3 className="font-medium text-primary mb-2">Tax Bracket Analysis</h3>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Your marginal tax rate is {marginalTaxRate.toFixed(1)}%:
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Next dollar earned is taxed at {marginalTaxRate.toFixed(1)}%</li>
                    <li>• Effective tax rate: {effectiveTaxRate.toFixed(1)}%</li>
                    {marginalTaxRate > 24 && (
                      <li>• Consider tax-deferred investments to lower bracket</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Deduction Strategy */}
              <div>
                <h3 className="font-medium text-primary mb-2">
                  {Object.values(taxDetails.deductions).some(d => d > 0) 
                    ? "Deduction Optimization" 
                    : "Deduction Opportunities"}
                </h3>
                <div className="space-y-2">
                  {calculateTaxableIncome() < taxDetails.income && (
                    <p className={`text-xs text-green-600 dark:text-green-400`}>
                      ✨ Your deductions are reducing your taxable income by ${(taxDetails.income - calculateTaxableIncome()).toFixed(0)}
                    </p>
                  )}
                  <ul className="space-y-1 text-muted-foreground">
                    {!taxDetails.deductions.retirement && (
                      <li>• Consider contributing to a retirement account</li>
                    )}
                    {!taxDetails.deductions.charitable && taxDetails.income > 100000 && (
                      <li>• Explore charitable giving opportunities</li>
                    )}
                    {taxDetails.deductions.mortgage > 0 && (
                      <li>• Track all mortgage-related expenses</li>
                    )}
                    {taxDetails.selfEmployed && (
                      <li>• Document all business-related expenses</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Tax Savings Opportunities */}
              <div>
                <h3 className="font-medium text-primary mb-2">Potential Savings</h3>
                <div className="space-y-2">
                  <ul className="space-y-1 text-muted-foreground">
                    {potentialSavings.retirement > 0 && (
                      <li>• Save up to ${potentialSavings.retirement.toFixed(0)} with retirement contributions</li>
                    )}
                    {potentialSavings.charitable > 0 && (
                      <li>• Save up to ${potentialSavings.charitable.toFixed(0)} through charitable giving</li>
                    )}
                    {taxDetails.selfEmployed && (
                      <li>• Consider SEP IRA or Solo 401(k) contributions</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Filing Status Strategy */}
              <div>
                <h3 className="font-medium text-primary mb-2">Filing Strategy</h3>
                <ul className="space-y-1 text-muted-foreground">
                  {taxDetails.filingStatus === 'single' && taxDetails.income > 100000 && (
                    <li>• Review if itemizing deductions would benefit you</li>
                  )}
                  {taxDetails.dependents > 0 && (
                    <li>• Check eligibility for child tax credits</li>
                  )}
                  {taxDetails.selfEmployed && (
                    <li>• Consider quarterly estimated tax payments</li>
                  )}
                  <li>• Keep records of all tax documents</li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-medium text-primary mb-2">Next Steps</h3>
                <ul className="space-y-1 text-muted-foreground">
                  {new Date().getMonth() < 3 && (
                    <li>• Gather tax documents for filing season</li>
                  )}
                  {taxDetails.selfEmployed && !taxDetails.deductions.retirement && (
                    <li>• Set up a retirement account for tax benefits</li>
                  )}
                  {effectiveTaxRate > 25 && (
                    <li>• Review tax-advantaged investment options</li>
                  )}
                  <li>• Consider consulting a tax professional</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
