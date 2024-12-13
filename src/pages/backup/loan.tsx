import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoanForm } from '@/components/calculators/loan/loan-form';
import { LoanChart } from '@/components/calculators/loan/loan-chart';
import { LoanSummary } from '@/components/calculators/loan/loan-summary';
import { useChat } from '@/lib/chat-context';

interface LoanDetails {
  amount: number;
  downPayment: number;
  interestRate: number;
  term: number;
  type: 'personal' | 'mortgage' | 'auto' | 'student' | 'other';
  paymentFrequency: 'monthly' | 'biweekly';
  creditScore: number | null;
  includeInsurance: boolean;
}

interface LoanCalculations {
  monthlyPayment: number;
  biweeklyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    period: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
  metrics: {
    loanToValueRatio: number;
    debtToIncomeRatio: number;
    totalCostOfBorrowing: number;
    breakEvenPoint: number;
    estimatedTaxSavings: number;
  };
}

export function Loan() {
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    amount: 0,
    downPayment: 0,
    interestRate: 0,
    term: 0,
    type: 'personal',
    paymentFrequency: 'monthly',
    creditScore: null,
    includeInsurance: false,
  });

  const [calculations, setCalculations] = useState<LoanCalculations>({
    monthlyPayment: 0,
    biweeklyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    amortizationSchedule: [],
    metrics: {
      loanToValueRatio: 0,
      debtToIncomeRatio: 0,
      totalCostOfBorrowing: 0,
      breakEvenPoint: 0,
      estimatedTaxSavings: 0,
    },
  });

  const { setCalculatorData } = useChat();

  const calculateLoan = () => {
    const principal = loanDetails.amount - loanDetails.downPayment;
    const monthlyRate = loanDetails.interestRate / 100 / 12;
    const numberOfPayments = loanDetails.term * 12;
    let monthlyPayment = 0;
    let biweeklyPayment = 0;

    if (monthlyRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      monthlyPayment =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    // Calculate bi-weekly payment
    biweeklyPayment = (monthlyPayment * 12) / 26;

    // Calculate amortization schedule
    let remainingBalance = principal;
    const schedule = [];

    for (let period = 1; period <= numberOfPayments; period++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        period,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
      });
    }

    // Calculate total payments and interest
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Calculate additional metrics
    const loanToValueRatio = (principal / loanDetails.amount) * 100;
    const assumedMonthlyIncome = monthlyPayment * 4; // Assuming payment is 25% of income
    const debtToIncomeRatio = (monthlyPayment / assumedMonthlyIncome) * 100;
    
    // Estimate tax savings (simplified, assumes 25% tax rate for mortgage interest)
    const estimatedTaxSavings = loanDetails.type === 'mortgage' ? totalInterest * 0.25 : 0;
    
    // Calculate break-even point for refinancing (simplified)
    const breakEvenPoint = loanDetails.amount * 0.03 / monthlyPayment; // Assuming 3% closing costs

    const totalCostOfBorrowing = totalPayment + loanDetails.downPayment;

    setCalculations({
      monthlyPayment,
      biweeklyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule: schedule,
      metrics: {
        loanToValueRatio,
        debtToIncomeRatio,
        totalCostOfBorrowing,
        breakEvenPoint,
        estimatedTaxSavings,
      },
    });
  };

  // Recalculate when loan details change
  useEffect(() => {
    calculateLoan();
  }, [loanDetails]);

  // Update chat context with calculations
  useEffect(() => {
    setCalculatorData({
      loanDetails,
      calculations: {
        monthlyPayment: calculations.monthlyPayment,
        biweeklyPayment: calculations.biweeklyPayment,
        totalPayment: calculations.totalPayment,
        totalInterest: calculations.totalInterest,
        metrics: calculations.metrics,
      },
      analysis: {
        paymentFrequency: loanDetails.paymentFrequency,
        loanType: loanDetails.type,
        creditScore: loanDetails.creditScore,
        downPaymentPercentage: loanDetails.amount > 0 
          ? (loanDetails.downPayment / loanDetails.amount) * 100 
          : 0,
      },
    });
  }, [calculations, loanDetails, setCalculatorData]);

  const debtToIncomeRatio = (calculations.monthlyPayment / (calculations.monthlyPayment * 4)) * 100;
  const loanToValueRatio = (loanDetails.amount - loanDetails.downPayment) / loanDetails.amount * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Loan Calculator</h1>
          <p className="text-muted-foreground mb-6">
            Calculate your loan payments, view amortization schedule, and get
            personalized financial insights.
          </p>
          <LoanForm
            loanDetails={loanDetails}
            setLoanDetails={setLoanDetails}
          />
        </Card>
      </div>
      <div className="space-y-6">
        <LoanSummary
          monthlyPayment={calculations.monthlyPayment}
          biweeklyPayment={calculations.biweeklyPayment}
          totalPayment={calculations.totalPayment}
          totalInterest={calculations.totalInterest}
          metrics={calculations.metrics}
          paymentFrequency={loanDetails.paymentFrequency}
        />
        <Card className="p-6">
          <LoanChart
            principal={loanDetails.amount - loanDetails.downPayment}
            totalInterest={calculations.totalInterest}
            amortizationSchedule={calculations.amortizationSchedule}
          />
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Tips & Insights</h2>
          <div className="space-y-4 text-sm">
            {/* Loan Affordability */}
            <div>
              <h3 className="font-medium text-primary mb-2">
                {debtToIncomeRatio <= 40 ? "Affordability Analysis" : "Affordability Concerns"}
              </h3>
              <p className="text-muted-foreground">
                {debtToIncomeRatio > 0 
                  ? `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(1)}%:`
                  : "Consider your debt-to-income ratio:"}
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {debtToIncomeRatio <= 36 ? (
                  <>
                    <li>• Your DTI ratio is healthy (under 36%)</li>
                    <li>• You may qualify for better interest rates</li>
                    <li>• Consider a shorter loan term to save on interest</li>
                  </>
                ) : debtToIncomeRatio <= 40 ? (
                  <>
                    <li>• Your DTI ratio is acceptable but high</li>
                    <li>• Consider reducing other debts first</li>
                    <li>• Look for ways to increase your income</li>
                  </>
                ) : (
                  <>
                    <li>• Your DTI ratio exceeds recommended limits</li>
                    <li>• Focus on debt reduction before new loans</li>
                    <li>• Consider debt consolidation options</li>
                  </>
                )}
              </ul>
            </div>

            {/* Down Payment Analysis */}
            <div>
              <h3 className="font-medium text-primary mb-2">Down Payment Strategy</h3>
              <div className="space-y-2">
                {loanToValueRatio > 0 && (
                  <p className="text-muted-foreground">
                    Your loan-to-value ratio is {loanToValueRatio.toFixed(1)}%:
                  </p>
                )}
                <ul className="space-y-1 text-muted-foreground">
                  {loanToValueRatio >= 80 ? (
                    <>
                      <li>• Consider increasing your down payment</li>
                      <li>• PMI may be required (additional cost)</li>
                      <li>• Higher monthly payments</li>
                    </>
                  ) : loanToValueRatio >= 20 ? (
                    <>
                      <li>• Good down payment amount</li>
                      <li>• No PMI typically required</li>
                      <li>• Consider the trade-off between down payment and other investments</li>
                    </>
                  ) : (
                    <>
                      <li>• Substantial down payment</li>
                      <li>• Lower monthly payments</li>
                      <li>• Consider if funds could be better used elsewhere</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Interest Rate Analysis */}
            <div>
              <h3 className="font-medium text-primary mb-2">Interest Rate Insights</h3>
              <div className="space-y-2">
                {loanDetails.creditScore && (
                  <p className={`text-xs ${loanDetails.creditScore >= 740 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {loanDetails.creditScore >= 740 
                      ? "✨ Your credit score may qualify you for the best rates"
                      : "💡 Improving your credit score could help you get better rates"}
                  </p>
                )}
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Total interest: ${calculations.totalInterest.toFixed(2)}</li>
                  <li>• Monthly payment: ${calculations.monthlyPayment.toFixed(2)}</li>
                  {loanDetails.term > 15 && (
                    <li>• Consider a {loanDetails.term - 5} year term to save ${(calculations.totalInterest * 0.2).toFixed(2)} in interest</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-medium text-primary mb-2">Next Steps</h3>
              <ul className="space-y-1 text-muted-foreground">
                {loanDetails.creditScore && loanDetails.creditScore < 700 && (
                  <li>• Work on improving your credit score</li>
                )}
                {debtToIncomeRatio > 36 && (
                  <li>• Look for ways to reduce monthly debt payments</li>
                )}
                {loanToValueRatio > 80 && (
                  <li>• Save for a larger down payment if possible</li>
                )}
                <li>• Compare rates from multiple lenders</li>
                <li>• Review your budget for the new payment</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}