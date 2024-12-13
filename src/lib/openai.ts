import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Calculator Result Types
export interface NetWorthResults {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  investmentAssets: number;
  personalAssets: number;
  shortTermDebt: number;
  longTermDebt: number;
}

export interface BudgetResults {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  incomeSources: {
    type: string;
    amount: number;
    frequency: string;
  }[];
  expenses: {
    type: string;
    amount: number;
    frequency: string;
  }[];
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface LoanResults {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  debtToIncome: number;
  otherDebts: number;
}

export interface InvestmentResults {
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  investmentPeriod: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
}

export interface RetirementResults {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  nominalValue: number;
  realValue: number;
}

export interface TaxResults {
  taxableIncome: number;
  federalTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  deductions: {
    type: string;
    amount: number;
  }[];
  totalDeductions: number;
}

export type CalculatorResults = 
  | { type: 'Net Worth'; data: NetWorthResults }
  | { type: 'Budget'; data: BudgetResults }
  | { type: 'Loan'; data: LoanResults }
  | { type: 'Investment'; data: InvestmentResults }
  | { type: 'Retirement'; data: RetirementResults }
  | { type: 'Tax'; data: TaxResults };

export const getSystemPrompt = (calculatorType: string) => {
  const prompts: Record<string, string> = {
    'Net Worth': `You are a financial advisor analyzing net worth calculations. 
      Consider the balance between assets and liabilities, asset diversification, and debt management.
      Provide specific recommendations for improving net worth and financial health.
      Focus on practical steps like debt reduction strategies, investment opportunities, and asset optimization.`,
    
    'Budget': `You are a financial advisor analyzing budget calculations.
      Consider income sources, expense patterns, and savings opportunities.
      Provide specific recommendations for optimizing spending, increasing savings, and achieving financial goals.
      Focus on practical steps like expense reduction, income growth, and emergency fund building.`,
    
    'Loan': `You are a financial advisor analyzing loan calculations.
      Consider loan terms, interest rates, and repayment strategies.
      Provide specific recommendations for managing loan payments and reducing interest costs.
      Focus on practical steps like refinancing opportunities, accelerated payment strategies, and debt consolidation.`,
    
    'Retirement': `You are a financial advisor analyzing retirement planning calculations.
      Consider savings rate, investment returns, and retirement timeline.
      Provide specific recommendations for achieving retirement goals and optimizing savings strategies.
      Focus on practical steps like contribution adjustments, investment allocation, and risk management.`,
    
    'Investment': `You are a financial advisor analyzing investment calculations.
      Consider investment returns, risk tolerance, and portfolio diversification.
      Provide specific recommendations for optimizing investment strategy and achieving financial goals.
      Focus on practical steps like asset allocation, rebalancing, and risk management.`,
    
    'Debt': `You are a financial advisor analyzing debt repayment calculations.
      Consider interest rates, payment strategies, and debt prioritization.
      Provide specific recommendations for accelerating debt repayment and reducing interest costs.
      Focus on practical steps like payment optimization, refinancing opportunities, and lifestyle adjustments.`,
    
    'General': `You are a financial advisor providing general financial advice.
      Consider the user's financial situation holistically.
      Provide specific recommendations for improving overall financial health.
      Focus on practical steps that align with their financial goals.`,
  };

  return prompts[calculatorType] || prompts['General'];
};

export interface FinancialData {
  calculatorType: string;
  results: CalculatorResults;
  userMessage: string;
  chatHistory?: ChatCompletionMessageParam[];
}

export interface FinancialAdviceRequest {
  messages: ChatCompletionMessageParam[];
  systemPrompt: string;
}

export async function getFinancialAdvice(data: FinancialData): Promise<string> {
  try {
    const systemPrompt = getSystemPrompt(data.calculatorType);
    const request: FinancialAdviceRequest = {
      messages: [
        { role: 'system', content: systemPrompt },
        ...(data.chatHistory || []),
        { role: 'user', content: data.userMessage },
      ],
      systemPrompt,
    };

    const response = await fetch('/api/ai/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get financial advice');
    }

    const result = await response.json();
    return result.advice;
  } catch (error) {
    console.error('Error getting financial advice:', error);
    throw error;
  }
}

export async function* streamFinancialAdvice(data: FinancialData): AsyncGenerator<string> {
  try {
    const systemPrompt = getSystemPrompt(data.calculatorType);
    const request: FinancialAdviceRequest = {
      messages: [
        { role: 'system', content: systemPrompt },
        ...(data.chatHistory || []),
        { role: 'user', content: data.userMessage },
      ],
      systemPrompt,
    };

    const response = await fetch('/api/ai/advice/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to stream financial advice');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Process all complete lines
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // Remove 'data: ' prefix
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.content) {
              yield parsed.content;
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error streaming financial advice:', error);
    throw error;
  }
}