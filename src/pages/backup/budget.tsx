import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BudgetForm } from '@/components/calculators/budget/budget-form';
import { BudgetChart } from '@/components/calculators/budget/budget-chart';
import { BudgetSummary } from '@/components/calculators/budget/budget-summary';
import type { BudgetData } from '@/lib/types';
import { useChat } from '@/lib/chat-context';

const initialBudgetData: BudgetData = {
  incomeSources: [],
  expenses: [],
};

export function Budget() {
  const [budgetData, setBudgetData] = useState<BudgetData>(initialBudgetData);
  const { setCalculatorData } = useChat();

  const calculateTotalIncome = () => {
    return budgetData.incomeSources.reduce((total, income) => {
      const amount = income.amount;
      switch (income.frequency) {
        case 'weekly':
          return total + amount * 52 / 12;
        case 'bi-weekly':
          return total + amount * 26 / 12;
        case 'monthly':
          return total + amount;
        case 'annually':
          return total + amount / 12;
        default:
          return total;
      }
    }, 0);
  };

  const calculateTotalExpenses = () => {
    return budgetData.expenses.reduce((total, expense) => {
      const amount = expense.amount;
      switch (expense.frequency) {
        case 'weekly':
          return total + amount * 52 / 12;
        case 'bi-weekly':
          return total + amount * 26 / 12;
        case 'monthly':
          return total + amount;
        case 'annually':
          return total + amount / 12;
        default:
          return total;
      }
    }, 0);
  };

  const totalMonthlyIncome = calculateTotalIncome();
  const totalMonthlyExpenses = calculateTotalExpenses();
  const monthlyNetIncome = totalMonthlyIncome - totalMonthlyExpenses;

  // Update chat context whenever budget data changes
  useEffect(() => {
    const incomeByCategory = budgetData.incomeSources.reduce((acc, income) => {
      const category = income.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += income.amount;
      return acc;
    }, {} as Record<string, number>);

    const expensesByCategory = budgetData.expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    setCalculatorData({
      budgetData,
      summary: {
        totalMonthlyIncome,
        totalMonthlyExpenses,
        monthlyNetIncome,
        savingsRate: totalMonthlyIncome > 0 ? (monthlyNetIncome / totalMonthlyIncome) * 100 : 0,
      },
      analysis: {
        incomeByCategory,
        expensesByCategory,
        fixedExpensesRatio: totalMonthlyExpenses > 0 
          ? (budgetData.expenses.filter(e => e.category === 'fixed')
              .reduce((sum, e) => sum + e.amount, 0) / totalMonthlyExpenses) * 100 
          : 0,
      },
    });
  }, [budgetData, totalMonthlyIncome, totalMonthlyExpenses, monthlyNetIncome, setCalculatorData]);

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Budget Calculator
        </h1>
        <p className="text-muted-foreground">
          Plan and track your monthly income and expenses to better manage your finances.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* Main Content */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Income & Expenses</h2>
            <BudgetForm data={budgetData} onUpdate={setBudgetData} />
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Budget Breakdown</h2>
            <BudgetChart 
              incomeSources={budgetData.incomeSources}
              expenses={budgetData.expenses}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Summary</h2>
            <BudgetSummary
              totalIncome={totalMonthlyIncome}
              totalExpenses={totalMonthlyExpenses}
              netIncome={monthlyNetIncome}
              savingsRate={totalMonthlyIncome > 0 ? (monthlyNetIncome / totalMonthlyIncome) * 100 : 0}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Tips & Insights</h2>
            <div className="space-y-4 text-sm">
              {/* Savings Tips */}
              <div>
                <h3 className="font-medium text-primary mb-2">
                  {monthlyNetIncome >= 0 ? "Savings Strategy" : "Debt Management Priority"}
                </h3>
                <p className="text-muted-foreground">
                  {monthlyNetIncome >= 0 
                    ? "Consider allocating your $" + monthlyNetIncome.toFixed(2) + " monthly surplus:"
                    : "Your monthly deficit of $" + Math.abs(monthlyNetIncome).toFixed(2) + " needs attention:"}
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {monthlyNetIncome >= 0 ? (
                    <>
                      <li>• 50% towards emergency fund (3-6 months of expenses)</li>
                      <li>• 30% for retirement savings</li>
                      <li>• 20% for short-term goals</li>
                    </>
                  ) : (
                    <>
                      <li>• Review and cut non-essential expenses</li>
                      <li>• Consider debt consolidation options</li>
                      <li>• Build an emergency fund gradually</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Budget Rule */}
              <div>
                <h3 className="font-medium text-primary mb-2">50/30/20 Rule Analysis</h3>
                <p className="text-muted-foreground">
                  {totalMonthlyIncome > 0 ? (
                    `Based on your $${totalMonthlyIncome.toFixed(2)} monthly income:`
                  ) : (
                    "Recommended monthly allocation:"
                  )}
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Needs (50%): up to ${(totalMonthlyIncome * 0.5).toFixed(2)}</li>
                  <li>• Wants (30%): up to ${(totalMonthlyIncome * 0.3).toFixed(2)}</li>
                  <li>• Savings (20%): at least ${(totalMonthlyIncome * 0.2).toFixed(2)}</li>
                </ul>
              </div>

              {/* Smart Goals */}
              <div>
                <h3 className="font-medium text-primary mb-2">Financial Goals</h3>
                <div className="space-y-2">
                  {monthlyNetIncome > totalMonthlyIncome * 0.2 && (
                    <p className="text-green-600 dark:text-green-400 text-xs">
                      ✨ Great job! You're saving more than the recommended 20%
                    </p>
                  )}
                  <p className="text-muted-foreground">Next steps to consider:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Max out tax-advantaged accounts</li>
                    <li>• Consider diversifying investments</li>
                    <li>• Review insurance coverage</li>
                  </ul>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-medium text-primary mb-2">Quick Wins</h3>
                <ul className="space-y-1 text-muted-foreground">
                  {totalMonthlyExpenses > totalMonthlyIncome * 0.8 && (
                    <li>• Look for subscription services you can reduce</li>
                  )}
                  {monthlyNetIncome < 0 && (
                    <li>• Identify non-essential expenses to cut back</li>
                  )}
                  <li>• Set up automatic savings transfers</li>
                  <li>• Track expenses for 30 days</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}