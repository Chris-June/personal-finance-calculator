import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoanForm } from '@/components/calculators/loan/loan-form';
import { LoanChart } from '@/components/calculators/loan/loan-chart';
import { LoanSummary } from '@/components/calculators/loan/loan-summary';
import { useChat } from '@/lib/chat-context';
import { LoanDetails, LoanCalculations, DebtType, PaymentFrequency } from '@/lib/types';

export function Loan() {
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    // Loan specific details
    amount: 0,
    downPayment: 0,
    interestRate: 0,
    term: 0,
    type: 'personal' as DebtType,
    paymentFrequency: 'monthly' as PaymentFrequency,
    creditScore: null,
    includeInsurance: false,
    
    // Income details
    monthlyIncome: 0,
    otherIncome: 0,
    
    // Property details
    propertyValue: 0,
    propertyTax: 0,
    heatingCosts: 0,
    condoFees: 0,
    
    // Existing debts
    existingDebts: [],
  });

  const [calculations, setCalculations] = useState<LoanCalculations>({
    monthlyPayment: 0,
    biweeklyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    amortizationSchedule: [],
    metrics: {
      loanToValueRatio: 0,
      debtServiceRatios: {
        grossDebtServiceRatio: 0,
        totalDebtServiceRatio: 0,
        monthlyHousingExpenses: 0,
        monthlyDebtPayments: 0,
        totalMonthlyObligations: 0,
        availableMonthlyIncome: 0,
        maxAffordableLoan: 0,
      },
      totalCostOfBorrowing: 0,
      breakEvenPoint: 0,
      estimatedTaxSavings: 0,
    },
  });

  const { setCalculatorData } = useChat();

  useEffect(() => {
    const result = calculateLoan();
    setCalculations(result);
    
    setCalculatorData({
      type: 'loan',
      data: {
        loanDetails,
        calculations: result,
      },
    });
  }, [loanDetails, setCalculatorData]);

  const calculateLoan = (): LoanCalculations => {
    const principal = loanDetails.amount - (loanDetails.downPayment || 0);
    const monthlyRate = (loanDetails.interestRate || 0) / 100 / 12;
    const numberOfPayments = (loanDetails.term || 0) * 12;
    let monthlyPayment = 0;
    let biweeklyPayment = 0;

    // Prevent division by zero and handle edge cases
    if (principal <= 0 || numberOfPayments <= 0) {
      return {
        monthlyPayment: 0,
        biweeklyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        amortizationSchedule: [],
        metrics: {
          loanToValueRatio: 0,
          debtServiceRatios: {
            grossDebtServiceRatio: 0,
            totalDebtServiceRatio: 0,
            monthlyHousingExpenses: 0,
            monthlyDebtPayments: 0,
            totalMonthlyObligations: 0,
            availableMonthlyIncome: 0,
            maxAffordableLoan: 0,
          },
          totalCostOfBorrowing: 0,
          breakEvenPoint: 0,
          estimatedTaxSavings: 0,
        },
      };
    }

    if (monthlyRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    biweeklyPayment = (monthlyPayment * 12) / 26;

    // Calculate amortization schedule
    let remainingBalance = principal;
    const schedule = [];
    let totalInterest = 0;

    for (let period = 1; period <= numberOfPayments; period++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);
      totalInterest += interestPayment;

      schedule.push({
        period,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance,
      });
    }

    // Calculate housing expenses for GDSR
    const monthlyHousingExpenses = 
      monthlyPayment + // Principal and Interest
      (loanDetails.propertyTax || 0) / 12 + // Monthly property tax
      (loanDetails.heatingCosts || 0) + // Monthly heating
      (loanDetails.condoFees || 0); // Monthly condo fees

    // Calculate total monthly debt payments
    const monthlyDebtPayments = loanDetails.existingDebts.reduce((total, debt) => {
      const payment = debt.minimumPayment;
      // Convert to monthly payment based on frequency
      switch (debt.paymentFrequency) {
        case 'weekly':
          return total + (payment * 52) / 12;
        case 'biweekly':
          return total + (payment * 26) / 12;
        case 'acceleratedBiweekly':
          return total + (payment * 26 * 1.08) / 12;
        default:
          return total + payment;
      }
    }, 0);

    const totalMonthlyIncome = loanDetails.monthlyIncome + (loanDetails.otherIncome / 12);
    const totalMonthlyObligations = monthlyHousingExpenses + monthlyDebtPayments;

    const grossDebtServiceRatio = totalMonthlyIncome > 0 
      ? (monthlyHousingExpenses / totalMonthlyIncome) * 100 
      : 0;

    const totalDebtServiceRatio = totalMonthlyIncome > 0
      ? (totalMonthlyObligations / totalMonthlyIncome) * 100
      : 0;

    const totalPayment = monthlyPayment * numberOfPayments;
    const loanToValueRatio = loanDetails.propertyValue 
      ? (principal / loanDetails.propertyValue) * 100 
      : 0;

    return {
      monthlyPayment,
      biweeklyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule: schedule,
      metrics: {
        loanToValueRatio,
        debtServiceRatios: {
          grossDebtServiceRatio,
          totalDebtServiceRatio,
          monthlyHousingExpenses,
          monthlyDebtPayments,
          totalMonthlyObligations,
          availableMonthlyIncome: totalMonthlyIncome - totalMonthlyObligations,
          maxAffordableLoan: totalMonthlyIncome * 0.44 * numberOfPayments,
        },
        totalCostOfBorrowing: totalPayment,
        breakEvenPoint: Math.ceil(principal / monthlyPayment),
        estimatedTaxSavings: loanDetails.type === 'mortgage' ? totalInterest * 0.25 : 0,
      },
    };
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <LoanForm loanDetails={loanDetails} setLoanDetails={setLoanDetails} />
          <LoanSummary calculations={calculations} paymentFrequency={loanDetails.paymentFrequency} />
        </div>
      </Card>
      <Card className="p-6">
        <LoanChart calculations={calculations} />
      </Card>
    </div>
  );
}