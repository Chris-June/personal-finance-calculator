export type IncomeCategory = 'employment' | 'investments' | 'business' | 'pension' | 'other';
export type InvestmentType = 'registered' | 'non-registered';
export type RegisteredAccountType = 'RRSP' | 'TFSA' | 'RESP' | 'RDSP' | 'RPP';
export type NonRegisteredType = 'stocks' | 'bonds' | 'mutual-funds' | 'gics' | 'other';
export type ExpenseCategory = 'housing' | 'transportation' | 'food' | 'utilities' | 'insurance' | 'healthcare' | 'savings' | 'entertainment' | 'other';

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  category: IncomeCategory;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
  details?: {
    investmentType?: InvestmentType;
    registeredType?: RegisteredAccountType;
    nonRegisteredType?: NonRegisteredType;
  };
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  subcategory: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
}

export interface BudgetData {
  incomeSources: IncomeSource[];
  expenses: Expense[];
}

export type TaxCategory = 'income' | 'deductions' | 'credits' | 'personalInfo';
export type TaxField = string;

export type FilingStatus = 'single' | 'married' | 'separated' | 'divorced' | 'widowed';
export type Province = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

export interface TaxDetails {
  income: {
    employment: number;
    selfEmployment: number;
    investments: number;
    rental: number;
    other: number;
    rrspContributions: number;
    tfsaContributions: number;
    capitalGains: number;
    eligibleDividends: number;
    nonEligibleDividends: number;
  };
  deductions: {
    rrspDeduction: number;
    unionDues: number;
    childcare: number;
    movingExpenses: number;
    workFromHome: number;
    studentLoan: number;
    charitable: number;
    medical: number;
    disabilitySupports: number;
  };
  credits: {
    basicPersonal: number;
    age: number;
    pension: number;
    disability: number;
    caregiver: number;
    education: number;
    donations: number;
    foreignTaxCredit: number;
  };
  personalInfo: {
    filingStatus: FilingStatus;
    province: Province;
    dependents: number;
    selfEmployed: boolean;
    hasDisability: boolean;
    age: number;
    isCitizen: boolean;
    socialInsuranceNumber?: string;
  };
}

export type TaxDetailKey<T extends TaxCategory> = keyof TaxDetails[T];

export interface DebtDetails {
  debts: Array<{
    id: string;
    name: string;
    type: 'creditCard' | 'personalLoan' | 'studentLoan' | 'mortgage' | 'other';
    balance: number;
    interestRate: number;
    minimumPayment: number;
  }>;
  monthlyIncome: number;
  monthlyExpenses: number;
  creditScore?: number;
  additionalPayment: number;
}

export interface Goal {
  id: string;
  type: string;
  target: number;
  timeframe: number;
  description: string;
}

export interface InvestmentDetails {
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  investmentPeriod: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  riskLevel?: 'low' | 'moderate' | 'high';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  age?: number;
  goals: Goal[];
}

export interface RetirementDetails {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  desiredIncome: number;
  socialSecurity: number;
  goals: Goal[];
}

export type DebtType = 
  | 'personal'
  | 'mortgage'
  | 'auto'
  | 'student'
  | 'other'
  | 'carLoan'
  | 'studentLoan'
  | 'creditCard'
  | 'lineOfCredit'
  | 'personalLoan'
  | 'heloc';

export type PaymentFrequency = 
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'acceleratedBiweekly';

export interface DebtFacility {
  id: string;
  type: DebtType;
  balance: number;
  creditLimit?: number;
  interestRate: number;
  minimumPayment: number;
  paymentFrequency: PaymentFrequency;
  isInterestOnly?: boolean;
  isSecured?: boolean;
  lender?: string;
}

export interface LoanDetails {
  // Loan specific details
  amount: number;
  downPayment: number;
  interestRate: number;
  term: number;
  type: DebtType;
  paymentFrequency: PaymentFrequency;
  creditScore: number | null;
  includeInsurance: boolean;
  
  // Income details for TDSR
  monthlyIncome: number;
  otherIncome: number;
  
  // Property details (for mortgage)
  propertyValue?: number;
  propertyTax?: number;
  heatingCosts?: number;
  condoFees?: number;
  
  // Existing debts for TDSR calculation
  existingDebts: DebtFacility[];
}

export interface TDSRMetrics {
  grossDebtServiceRatio: number;  // GDSR - housing costs only
  totalDebtServiceRatio: number;  // TDSR - all debts
  monthlyHousingExpenses: number;
  monthlyDebtPayments: number;
  totalMonthlyObligations: number;
  availableMonthlyIncome: number;
  maxAffordableLoan: number;
}

export interface LoanCalculations {
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
    debtServiceRatios: TDSRMetrics;
    totalCostOfBorrowing: number;
    breakEvenPoint: number;
    estimatedTaxSavings: number;
  };
}

export type AssetCategory = 'cash' | 'savings' | 'investment' | 'retirement' | 'property' | 'vehicle' | 'other';
export type LiabilityCategory = 'credit_card' | 'personal_loan' | 'mortgage' | 'student_loan' | 'other';

export interface Asset {
  id: string;
  name: string;
  value: number;
  category: AssetCategory;
  details?: {
    location?: string;
    interestRate?: number;
    purchaseDate?: string;
    appreciationRate?: number;
  };
}

export interface Liability {
  id: string;
  name: string;
  value: number;
  category: LiabilityCategory;
  details?: {
    interestRate: number;
    minimumPayment?: number;
    dueDate?: string;
    lender?: string;
  };
}