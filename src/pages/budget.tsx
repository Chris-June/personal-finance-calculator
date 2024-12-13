import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BudgetForm } from '@/components/calculators/budget/budget-form';
import { BudgetChart } from '@/components/calculators/budget/budget-chart';
import { BudgetSummary } from '@/components/calculators/budget/budget-summary';
import { BudgetTips } from '@/components/calculators/budget/budget-tips';
import { useChat } from '@/lib/chat-context';
import type { BudgetData, IncomeSource, Expense } from '@/lib/types';

const initialBudgetData: BudgetData = {
  incomeSources: [],
  expenses: [],
};

export function Budget() {
  const [budgetData, setBudgetData] = useState<BudgetData>(initialBudgetData);
  const { setCalculatorData } = useChat();

  // Calculate financial metrics
  const calculateMonthlyAmount = (amount: number, frequency: string) => {
    switch (frequency) {
      case 'weekly': return amount * 52 / 12;
      case 'bi-weekly': return amount * 26 / 12;
      case 'monthly': return amount;
      case 'annually': return amount / 12;
      default: return amount;
    }
  };

  const totalIncome = budgetData.incomeSources.reduce((sum: number, source: IncomeSource) => 
    sum + calculateMonthlyAmount(source.amount, source.frequency), 0);

  const totalExpenses = budgetData.expenses.reduce((sum: number, expense: Expense) => 
    sum + calculateMonthlyAmount(expense.amount, expense.frequency), 0);

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Update chat context whenever budget details change
  useEffect(() => {
    const monthlyExpensesByCategory = budgetData.expenses.reduce((acc: Record<string, number>, expense: Expense) => {
      const monthlyAmount = calculateMonthlyAmount(expense.amount, expense.frequency);
      acc[expense.category] = (acc[expense.category] || 0) + monthlyAmount;
      return acc;
    }, {});

    setCalculatorData({
      budgetData,
      calculations: {
        totalIncome,
        totalExpenses,
        netIncome,
        savingsRate,
        monthlyExpensesByCategory,
      },
      analysis: {
        housingRatio: (monthlyExpensesByCategory.housing || 0) / totalIncome * 100,
        savingsRate: savingsRate,
        expenseToIncomeRatio: (totalExpenses / totalIncome) * 100,
      },
    });
  }, [budgetData, totalIncome, totalExpenses, netIncome, savingsRate, setCalculatorData]);

  // Get total savings from expenses categorized as savings
  const savings = budgetData.expenses
    .filter((expense: Expense) => expense.category === 'savings')
    .reduce((sum: number, expense: Expense) => sum + calculateMonthlyAmount(expense.amount, expense.frequency), 0);

  // Convert expenses to a format suitable for the tips component
  const expensesByCategory = budgetData.expenses.reduce((acc: Record<string, number>, expense: Expense) => {
    const monthlyAmount = calculateMonthlyAmount(expense.amount, expense.frequency);
    acc[expense.category] = (acc[expense.category] || 0) + monthlyAmount;
    return acc;
  }, {});

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Budget Calculator</h1>
          <p className="text-muted-foreground mb-6">
            Track your income and expenses to create a balanced budget and achieve your financial goals.
          </p>
          <BudgetForm 
            data={budgetData}
            onUpdate={setBudgetData}
          />
        </Card>
      </div>
      <div className="space-y-6">
        <BudgetSummary
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netIncome={netIncome}
          savingsRate={savingsRate}
        />
        <Card className="p-6">
          <BudgetChart
            incomeSources={budgetData.incomeSources}
            expenses={budgetData.expenses}
          />
        </Card>
        <BudgetTips
          income={totalIncome}
          expenses={{
            housing: expensesByCategory.housing || 0,
            transportation: expensesByCategory.transportation || 0,
            food: expensesByCategory.food || 0,
            utilities: expensesByCategory.utilities || 0,
            insurance: expensesByCategory.insurance || 0,
            healthcare: expensesByCategory.healthcare || 0,
            savings: expensesByCategory.savings || 0,
            entertainment: expensesByCategory.entertainment || 0,
            other: expensesByCategory.other || 0,
          }}
          savings={savings}
        />
      </div>
    </div>
  );
}
