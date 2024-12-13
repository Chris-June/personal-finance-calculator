import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { 
  TaxDetails,
  BudgetData,
} from '../../src/lib/types';

// Define interfaces for missing calculator types
interface NetWorthData {
  assets: {
    cash: number;
    investments: number;
    realEstate: number;
    other: number;
  };
  liabilities: {
    mortgage: number;
    loans: number;
    creditCards: number;
    other: number;
  };
}

interface LoanData {
  amount: number;
  interestRate: number;
  term: number;
  paymentFrequency: 'monthly' | 'bi-weekly' | 'weekly';
  additionalPayments?: number;
}

interface InvestmentData {
  portfolio: {
    stocks: number;
    bonds: number;
    cash: number;
    other: number;
  };
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon: number;
  goals: string[];
}

interface RetirementData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  desiredIncome: number;
}

interface DebtData {
  debts: Array<{
    type: 'mortgage' | 'creditCard' | 'studentLoan' | 'personalLoan' | 'other';
    balance: number;
    interestRate: number;
    minimumPayment: number;
  }>;
  monthlyIncome: number;
  monthlyExpenses: number;
}

type CalculatorData = {
  'Net Worth': NetWorthData;
  'Budget': BudgetData;
  'Loan': LoanData;
  'Investment': InvestmentData;
  'Retirement': RetirementData;
  'Debt': DebtData;
  'Tax': TaxDetails;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FinancialAdviceRequest {
  calculatorType: keyof CalculatorData;
  results: CalculatorData[keyof CalculatorData];
  userMessage: string;
  chatHistory?: ChatCompletionMessageParam[];
}

const CALCULATOR_PROMPTS: Record<keyof CalculatorData, string> = {
  'Net Worth': `You are a financial advisor specializing in net worth analysis. Your role is to:
1. Analyze the balance between assets and liabilities
2. Evaluate asset diversification and quality
3. Assess debt levels and management strategies
4. Identify potential risks and opportunities
5. Provide actionable recommendations for improving net worth

Focus on practical advice that considers:
- Asset growth strategies
- Debt reduction techniques
- Risk management
- Tax efficiency
- Long-term wealth building`,

  'Budget': `You are a financial advisor specializing in budgeting and cash flow management. Your role is to:
1. Analyze income sources and stability
2. Evaluate expense patterns and categories
3. Identify saving opportunities
4. Suggest budget optimization strategies
5. Help create realistic financial goals

Focus on practical advice that considers:
- Income maximization
- Expense reduction
- Emergency fund building
- Debt management
- Lifestyle sustainability`,

  'Loan': `You are a financial advisor specializing in loan and debt management. Your role is to:
1. Analyze loan terms and conditions
2. Evaluate interest rates and fees
3. Assess repayment strategies
4. Identify refinancing opportunities
5. Suggest debt optimization approaches

Focus on practical advice that considers:
- Interest cost reduction
- Payment optimization
- Debt consolidation
- Credit score impact
- Long-term financial planning`,

  'Retirement': `You are a financial advisor specializing in retirement planning. Your role is to:
1. Analyze retirement savings progress
2. Evaluate investment strategies
3. Assess retirement timeline feasibility
4. Identify potential shortfalls
5. Suggest optimization strategies

Focus on practical advice that considers:
- Contribution strategies
- Investment allocation
- Risk management
- Tax efficiency
- Social Security optimization`,

  'Investment': `You are a financial advisor specializing in investment management. Your role is to:
1. Analyze investment portfolio composition
2. Evaluate risk and return metrics
3. Assess diversification levels
4. Identify optimization opportunities
5. Suggest rebalancing strategies

Focus on practical advice that considers:
- Asset allocation
- Risk management
- Tax efficiency
- Fee optimization
- Long-term performance`,

  'Debt': `You are a financial advisor specializing in debt management. Your role is to:
1. Analyze debt composition and terms
2. Evaluate interest rates and fees
3. Assess repayment strategies
4. Identify consolidation opportunities
5. Suggest debt reduction approaches

Focus on practical advice that considers:
- Interest cost reduction
- Payment prioritization
- Credit score impact
- Debt snowball/avalanche methods
- Long-term financial freedom`,

  'Tax': `You are a financial advisor specializing in tax planning. Your role is to:
1. Analyze tax liability and effective rates
2. Evaluate deduction opportunities
3. Assess tax efficiency strategies
4. Identify tax saving opportunities
5. Suggest tax optimization approaches

Focus on practical advice that considers:
- Tax bracket management
- Deduction optimization
- Credit utilization
- Tax-efficient investing
- Long-term tax planning`,
};

export async function getFinancialAdvice({
  calculatorType,
  results,
  userMessage,
  chatHistory = [],
}: FinancialAdviceRequest): Promise<string> {
  try {
    const systemPrompt = CALCULATOR_PROMPTS[calculatorType];
    
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      {
        role: 'user',
        content: `${userMessage}\n\nHere is my financial data:\n${JSON.stringify(results, null, 2)}`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    });

    return response.choices[0].message.content || 'I apologize, but I could not generate advice at this time.';
  } catch (error) {
    console.error('Error getting financial advice:', error);
    throw new Error('Failed to generate financial advice. Please try again later.');
  }
}

export async function* streamFinancialAdvice({
  calculatorType,
  results,
  userMessage,
  chatHistory = [],
}: FinancialAdviceRequest): AsyncGenerator<string> {
  try {
    const systemPrompt = CALCULATOR_PROMPTS[calculatorType];
    
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      {
        role: 'user',
        content: `${userMessage}\n\nHere is my financial data:\n${JSON.stringify(results, null, 2)}`,
      },
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Error streaming financial advice:', error);
    throw new Error('Failed to stream financial advice. Please try again later.');
  }
}
