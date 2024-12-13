import { DebtFacility, LoanDetails, TDSRMetrics, PaymentFrequency } from './types';

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termInYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = termInYears * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}

export function normalizePaymentToMonthly(
  payment: number,
  frequency: PaymentFrequency
): number {
  switch (frequency) {
    case 'weekly':
      return (payment * 52) / 12;
    case 'biweekly':
      return (payment * 26) / 12;
    case 'acceleratedBiweekly':
      return (payment * 26) / 12 * 1.08; // 8% more payments per year
    case 'monthly':
    default:
      return payment;
  }
}

export function calculateMinimumPayment(
  debt: DebtFacility
): number {
  if (debt.isInterestOnly) {
    return (debt.balance * (debt.interestRate / 100)) / 12;
  }

  // For credit cards, typical minimum payment is 3% of balance
  if (debt.type === 'creditCard') {
    return Math.max(debt.balance * 0.03, 10); // $10 minimum
  }

  // For lines of credit, typical minimum payment is interest + 1% of principal
  if (debt.type === 'lineOfCredit' || debt.type === 'heloc') {
    return (debt.balance * (debt.interestRate / 100)) / 12 + (debt.balance * 0.01);
  }

  // For term loans, use the standard amortization formula
  return calculateMonthlyPayment(debt.balance, debt.interestRate, 25); // Assume 25 year amortization if not specified
}

export function calculateTDSR(
  loanDetails: LoanDetails,
  newMonthlyPayment: number
): TDSRMetrics {
  const totalMonthlyIncome = loanDetails.monthlyIncome + (loanDetails.otherIncome / 12);
  
  // Calculate housing expenses
  const propertyTax = (loanDetails.propertyTax || 0) / 12;
  const heatingCosts = loanDetails.heatingCosts || 0;
  const condoFees = loanDetails.condoFees || 0;
  
  const monthlyHousingExpenses = 
    newMonthlyPayment + // Principal and Interest
    propertyTax +
    heatingCosts +
    condoFees;

  // Calculate total monthly debt payments
  const monthlyDebtPayments = loanDetails.existingDebts.reduce((total, debt) => {
    const minimumPayment = debt.minimumPayment || calculateMinimumPayment(debt);
    return total + normalizePaymentToMonthly(minimumPayment, debt.paymentFrequency);
  }, 0);

  const totalMonthlyObligations = monthlyHousingExpenses + monthlyDebtPayments;
  
  // Calculate ratios
  const grossDebtServiceRatio = (monthlyHousingExpenses / totalMonthlyIncome) * 100;
  const totalDebtServiceRatio = (totalMonthlyObligations / totalMonthlyIncome) * 100;
  
  // Calculate maximum affordable loan based on TDSR limit of 44%
  const maxMonthlyPayment = (totalMonthlyIncome * 0.44) - monthlyDebtPayments;
  const maxAffordableLoan = calculateMaxLoanAmount(
    maxMonthlyPayment,
    loanDetails.interestRate,
    loanDetails.term
  );

  return {
    grossDebtServiceRatio,
    totalDebtServiceRatio,
    monthlyHousingExpenses,
    monthlyDebtPayments,
    totalMonthlyObligations,
    availableMonthlyIncome: totalMonthlyIncome - totalMonthlyObligations,
    maxAffordableLoan
  };
}

export function calculateMaxLoanAmount(
  maxMonthlyPayment: number,
  annualRate: number,
  termInYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = termInYears * 12;

  if (monthlyRate === 0) {
    return maxMonthlyPayment * numberOfPayments;
  }

  return (
    maxMonthlyPayment *
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1) /
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))
  );
}
