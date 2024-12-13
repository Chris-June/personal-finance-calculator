import { useState, useRef, useEffect } from 'react';
import { Loader2, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  streamFinancialAdvice, 
  type FinancialData, 
  type NetWorthResults, 
  type BudgetResults, 
  type LoanResults, 
  type InvestmentResults, 
  type RetirementResults, 
  type TaxResults,
  type CalculatorResults
} from '@/lib/openai';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './chat-message';
import { useChat, type ChatMessage as ChatMessageType } from '@/lib/chat-context';

interface ChatSidebarProps {
  calculatorType: string;
  isOpen: boolean;
}

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  category: 'employment' | 'investments' | 'business' | 'pension' | 'other';
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  subcategory: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
}

interface DebtFacility {
  id: string;
  type: 'creditCard' | 'lineOfCredit' | 'studentLoan' | 'carLoan' | 'mortgage' | 'other';
  balance: number;
  interestRate: number;
  minimumPayment: number;
  lender?: string;
}

interface Deduction {
  id: string;
  name: string;
  amount: number;
  category: 'rrsp' | 'childCare' | 'medical' | 'charitable' | 'other';
}

// Input interfaces (raw data from calculators)
interface NetWorthInput {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  investmentAssets: number;
  personalAssets: number;
  shortTermDebt: number;
  longTermDebt: number;
}

interface BudgetInput {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  incomeSources: IncomeSource[];
  expenses: Expense[];
}

interface LoanInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  annualIncome: number;
  otherDebts: DebtFacility[];
}

interface InvestmentInput {
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  investmentPeriod: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
}

interface RetirementInput {
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

interface TaxInput {
  taxableIncome: number;
  federalTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  deductions: Deduction[];
}

// Result interfaces (processed data for chat)
interface ProcessedNetWorth {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  investmentAssets: number;
  personalAssets: number;
  shortTermDebt: number;
  longTermDebt: number;
}

interface ProcessedBudget {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  incomeSources: IncomeSource[];
  expenses: Expense[];
  monthlyIncome: number;
  monthlyExpenses: number;
}

interface ProcessedLoan {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  debtToIncome: number;
  otherDebts: DebtFacility[];
}

interface ProcessedInvestment {
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  investmentPeriod: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
}

interface ProcessedRetirement {
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

interface ProcessedTax {
  taxableIncome: number;
  federalTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  deductions: Deduction[];
  totalDeductions: number;
}

interface ProcessedCalculatorResults {
  type: 'Net Worth' | 'Budget' | 'Loan' | 'Investment' | 'Retirement' | 'Tax';
  data: ProcessedNetWorth | ProcessedBudget | ProcessedLoan | ProcessedInvestment | ProcessedRetirement | ProcessedTax;
}

export function ChatSidebar({
  calculatorType,
  isOpen,
}: ChatSidebarProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamedMessage, setCurrentStreamedMessage] = useState('');
  const { toast } = useToast();
  const { calculatorData, chatHistory, addMessage } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory, currentStreamedMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || Object.keys(calculatorData).length === 0) return;

    const userMessage = input.trim();
    setInput('');
    
    const newUserMessage: ChatMessageType = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    addMessage(newUserMessage);
    setCurrentStreamedMessage('');

    try {
      setIsLoading(true);
      
      // Type guard function to ensure calculator data matches expected type
      const validateCalculatorData = (type: string, rawData: unknown): ProcessedCalculatorResults['data'] => {
        // Type guard functions
        const isNetWorthInput = (data: unknown): data is NetWorthInput => {
          const d = data as NetWorthInput;
          return typeof d?.totalAssets === 'number' && typeof d?.netWorth === 'number';
        };

        const isBudgetInput = (data: unknown): data is BudgetInput => {
          const d = data as BudgetInput;
          return typeof d?.totalIncome === 'number' && Array.isArray(d?.expenses);
        };

        const isLoanInput = (data: unknown): data is LoanInput => {
          const d = data as LoanInput;
          return typeof d?.loanAmount === 'number' && typeof d?.interestRate === 'number';
        };

        const isInvestmentInput = (data: unknown): data is InvestmentInput => {
          const d = data as InvestmentInput;
          return typeof d?.initialAmount === 'number' && typeof d?.annualReturn === 'number';
        };

        const isRetirementInput = (data: unknown): data is RetirementInput => {
          const d = data as RetirementInput;
          return typeof d?.currentAge === 'number' && typeof d?.retirementAge === 'number';
        };

        const isTaxInput = (data: unknown): data is TaxInput => {
          const d = data as TaxInput;
          return typeof d?.taxableIncome === 'number' && typeof d?.federalTax === 'number';
        };

        switch (type) {
          case 'Net Worth': {
            if (!isNetWorthInput(rawData)) {
              throw new Error('Invalid Net Worth data');
            }
            const {
              totalAssets,
              totalLiabilities,
              netWorth,
              liquidAssets,
              investmentAssets,
              personalAssets,
              shortTermDebt,
              longTermDebt,
            } = rawData;

            const result: ProcessedNetWorth = {
              totalAssets,
              totalLiabilities,
              netWorth,
              liquidAssets,
              investmentAssets,
              personalAssets,
              shortTermDebt,
              longTermDebt,
            };
            return result;
          }

          case 'Budget': {
            if (!isBudgetInput(rawData)) {
              throw new Error('Invalid Budget data');
            }
            const { totalIncome, totalExpenses, netIncome, savingsRate, incomeSources, expenses } = rawData;

            const result: ProcessedBudget = {
              totalIncome,
              totalExpenses,
              netIncome,
              savingsRate,
              incomeSources,
              expenses,
              monthlyIncome: totalIncome / 12,
              monthlyExpenses: totalExpenses / 12,
            };
            return result;
          }

          case 'Loan': {
            if (!isLoanInput(rawData)) {
              throw new Error('Invalid Loan data');
            }
            const {
              loanAmount,
              interestRate,
              loanTerm,
              monthlyPayment,
              totalInterest,
              totalPayment,
              annualIncome,
              otherDebts,
            } = rawData;

            const result: ProcessedLoan = {
              loanAmount,
              interestRate,
              loanTerm,
              monthlyPayment,
              totalInterest,
              totalPayment,
              debtToIncome: (monthlyPayment * 12) / annualIncome,
              otherDebts,
            };
            return result;
          }

          case 'Investment': {
            if (!isInvestmentInput(rawData)) {
              throw new Error('Invalid Investment data');
            }
            const {
              initialAmount,
              monthlyContribution,
              annualReturn,
              investmentPeriod,
              compoundingFrequency,
              futureValue,
              totalContributions,
              totalInterest,
            } = rawData;

            const result: ProcessedInvestment = {
              initialAmount,
              monthlyContribution,
              annualReturn,
              investmentPeriod,
              compoundingFrequency,
              futureValue,
              totalContributions,
              totalInterest,
            };
            return result;
          }

          case 'Retirement': {
            if (!isRetirementInput(rawData)) {
              throw new Error('Invalid Retirement data');
            }
            const {
              currentAge,
              retirementAge,
              lifeExpectancy,
              currentSavings,
              monthlyContribution,
              expectedReturn,
              inflationRate,
              nominalValue,
              realValue,
            } = rawData;

            const result: ProcessedRetirement = {
              currentAge,
              retirementAge,
              lifeExpectancy,
              currentSavings,
              monthlyContribution,
              expectedReturn,
              inflationRate,
              nominalValue,
              realValue,
            };
            return result;
          }

          case 'Tax': {
            if (!isTaxInput(rawData)) {
              throw new Error('Invalid Tax data');
            }
            const {
              taxableIncome,
              federalTax,
              totalTax,
              effectiveTaxRate,
              marginalTaxRate,
              deductions,
            } = rawData;

            const result: ProcessedTax = {
              taxableIncome,
              federalTax,
              totalTax,
              effectiveTaxRate,
              marginalTaxRate,
              deductions,
              totalDeductions: deductions.reduce((sum, d) => sum + d.amount, 0),
            };
            return result;
          }

          default:
            throw new Error(`Unknown calculator type: ${type}`);
        }
      };

      // Transform processed data to OpenAI format
      const transformToOpenAIFormat = (type: string, data: ProcessedCalculatorResults['data']): CalculatorResults['data'] => {
        switch (type) {
          case 'Net Worth': {
            const netWorthData = data as ProcessedNetWorth;
            const result: NetWorthResults = {
              totalAssets: netWorthData.totalAssets,
              totalLiabilities: netWorthData.totalLiabilities,
              netWorth: netWorthData.netWorth,
              liquidAssets: netWorthData.liquidAssets,
              investmentAssets: netWorthData.investmentAssets,
              personalAssets: netWorthData.personalAssets,
              shortTermDebt: netWorthData.shortTermDebt,
              longTermDebt: netWorthData.longTermDebt,
            };
            return result;
          }

          case 'Budget': {
            const budgetData = data as ProcessedBudget;
            const result: BudgetResults = {
              totalIncome: budgetData.totalIncome,
              totalExpenses: budgetData.totalExpenses,
              netIncome: budgetData.netIncome,
              savingsRate: budgetData.savingsRate,
              monthlyIncome: budgetData.monthlyIncome,
              monthlyExpenses: budgetData.monthlyExpenses,
              incomeSources: budgetData.incomeSources.map(source => ({
                type: source.category,
                amount: source.amount,
                frequency: source.frequency
              })),
              expenses: budgetData.expenses.map(expense => ({
                type: expense.category,
                amount: expense.amount,
                frequency: expense.frequency
              }))
            };
            return result;
          }

          case 'Loan': {
            const loanData = data as ProcessedLoan;
            const result: LoanResults = {
              loanAmount: loanData.loanAmount,
              interestRate: loanData.interestRate,
              loanTerm: loanData.loanTerm,
              monthlyPayment: loanData.monthlyPayment,
              totalInterest: loanData.totalInterest,
              totalPayment: loanData.totalPayment,
              debtToIncome: loanData.debtToIncome,
              otherDebts: loanData.otherDebts.reduce((sum, debt) => sum + debt.balance, 0)
            };
            return result;
          }

          case 'Investment': {
            const investmentData = data as ProcessedInvestment;
            const result: InvestmentResults = {
              initialAmount: investmentData.initialAmount,
              monthlyContribution: investmentData.monthlyContribution,
              annualReturn: investmentData.annualReturn,
              investmentPeriod: investmentData.investmentPeriod,
              compoundingFrequency: investmentData.compoundingFrequency,
              futureValue: investmentData.futureValue,
              totalContributions: investmentData.totalContributions,
              totalInterest: investmentData.totalInterest,
            };
            return result;
          }

          case 'Retirement': {
            const retirementData = data as ProcessedRetirement;
            const result: RetirementResults = {
              currentAge: retirementData.currentAge,
              retirementAge: retirementData.retirementAge,
              lifeExpectancy: retirementData.lifeExpectancy,
              currentSavings: retirementData.currentSavings,
              monthlyContribution: retirementData.monthlyContribution,
              expectedReturn: retirementData.expectedReturn,
              inflationRate: retirementData.inflationRate,
              nominalValue: retirementData.nominalValue,
              realValue: retirementData.realValue,
            };
            return result;
          }

          case 'Tax': {
            const taxData = data as ProcessedTax;
            const result: TaxResults = {
              taxableIncome: taxData.taxableIncome,
              federalTax: taxData.federalTax,
              totalTax: taxData.totalTax,
              effectiveTaxRate: taxData.effectiveTaxRate,
              marginalTaxRate: taxData.marginalTaxRate,
              deductions: taxData.deductions.map(d => ({
                type: d.category,
                amount: d.amount
              })),
              totalDeductions: taxData.totalDeductions
            };
            return result;
          }

          default:
            throw new Error(`Unknown calculator type: ${type}`);
        }
      };

      // Create a properly typed results object
      const getTypedResults = (type: string, data: CalculatorResults['data']): CalculatorResults => {
        switch (type) {
          case 'Net Worth':
            return { type: 'Net Worth', data: data as NetWorthResults };
          case 'Budget':
            return { type: 'Budget', data: data as BudgetResults };
          case 'Loan':
            return { type: 'Loan', data: data as LoanResults };
          case 'Investment':
            return { type: 'Investment', data: data as InvestmentResults };
          case 'Retirement':
            return { type: 'Retirement', data: data as RetirementResults };
          case 'Tax':
            return { type: 'Tax', data: data as TaxResults };
          default:
            throw new Error(`Unknown calculator type: ${type}`);
        }
      };

      const processedData = validateCalculatorData(calculatorType, calculatorData);
      const openAIData = transformToOpenAIFormat(calculatorType, processedData);

      const data: FinancialData = {
        calculatorType,
        results: getTypedResults(calculatorType, openAIData),
        userMessage,
        chatHistory: chatHistory.map(({ role, content }) => ({ role, content })),
      };
      
      // Start streaming the response
      let fullResponse = '';
      for await (const chunk of streamFinancialAdvice(data)) {
        fullResponse += chunk;
        setCurrentStreamedMessage(fullResponse);
      }
      
      // Add the complete message to chat history
      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };
      addMessage(assistantMessage);
      setCurrentStreamedMessage('');
      
    } catch (error) {
      console.error('Error getting financial advice:', error);
      toast({
        title: 'Error',
        description: 'Failed to get financial advice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-96 border-l bg-background flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Financial Advisor</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about your {calculatorType.toLowerCase()} calculations
        </p>
        {Object.keys(calculatorData).length === 0 && (
          <p className="text-sm text-yellow-600 mt-2">
            Please enter some financial data to get personalized advice
          </p>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {chatHistory.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} isLoading={isLoading && index === chatHistory.length - 1 && message.role === 'assistant'} />
          ))}
          {currentStreamedMessage && (
            <ChatMessage role="assistant" content={currentStreamedMessage} isLoading={true} />
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              Object.keys(calculatorData).length === 0
                ? 'Enter financial data first...'
                : 'Ask for financial advice...'
            }
            className="min-h-[80px] resize-none"
            disabled={Object.keys(calculatorData).length === 0 || isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={
              isLoading || !input.trim() || Object.keys(calculatorData).length === 0
            }
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRightCircle className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}