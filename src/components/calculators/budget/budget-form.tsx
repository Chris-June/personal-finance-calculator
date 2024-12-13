import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type {
  BudgetData,
  IncomeSource,
  Expense,
  IncomeCategory,
  ExpenseCategory,
} from '@/lib/types';

type FrequencyType = 'weekly' | 'bi-weekly' | 'monthly' | 'annually';

interface BudgetFormProps {
  data: BudgetData;
  onUpdate: (data: BudgetData) => void;
}

const INCOME_CATEGORIES: Record<IncomeCategory, string> = {
  employment: 'Employment Income',
  investments: 'Investment Income',
  business: 'Business Income',
  pension: 'Pension & Benefits',
  other: 'Other Income',
};

const EXPENSE_CATEGORIES: Record<ExpenseCategory, string[]> = {
  housing: ['Mortgage/Rent', 'Property Tax', 'Home Insurance', 'Maintenance'],
  utilities: ['Electricity', 'Water', 'Gas', 'Internet', 'Phone'],
  insurance: ['Life', 'Health', 'Disability', 'Auto'],
  transportation: ['Gas', 'Public Transit', 'Car Maintenance', 'Parking'],
  food: ['Groceries', 'Dining Out', 'Coffee/Snacks'],
  healthcare: ['Medical', 'Dental', 'Vision', 'Prescriptions'],
  savings: ['Emergency Fund', 'Retirement', 'Education'],
  entertainment: ['Movies', 'Sports', 'Hobbies', 'Subscriptions'],
  other: ['Gifts', 'Charity', 'Miscellaneous'],
};

const EXPENSE_METADATA = {
  fixed: ['housing', 'utilities', 'insurance', 'savings'] as const,
  discretionary: ['food', 'transportation', 'entertainment', 'healthcare', 'other'] as const,
} as const;

type ExpenseType = 'fixed' | 'discretionary';

const getExpenseType = (category: ExpenseCategory): ExpenseType => {
  return EXPENSE_METADATA.fixed.includes(category as (typeof EXPENSE_METADATA.fixed)[number]) 
    ? 'fixed' 
    : 'discretionary';
};

const FREQUENCY_OPTIONS: FrequencyType[] = ['weekly', 'bi-weekly', 'monthly', 'annually'];

export function BudgetForm({ data, onUpdate }: BudgetFormProps) {
  const [newIncome, setNewIncome] = useState<Partial<IncomeSource>>({});
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({});

  const handleAddIncome = () => {
    if (newIncome.name && newIncome.amount && newIncome.category) {
      const income: IncomeSource = {
        id: crypto.randomUUID(),
        name: newIncome.name,
        amount: Number(newIncome.amount),
        category: newIncome.category as IncomeCategory,
        frequency: (newIncome.frequency as FrequencyType) || 'monthly',
      };
      onUpdate({
        ...data,
        incomeSources: [...data.incomeSources, income],
      });
      setNewIncome({});
    }
  };

  const handleRemoveIncome = (id: string) => {
    onUpdate({
      ...data,
      incomeSources: data.incomeSources.filter((income) => income.id !== id),
    });
  };

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.category && newExpense.subcategory) {
      const expense: Expense = {
        id: crypto.randomUUID(),
        name: newExpense.name,
        amount: Number(newExpense.amount),
        category: newExpense.category as ExpenseCategory,
        subcategory: newExpense.subcategory,
        frequency: (newExpense.frequency as FrequencyType) || 'monthly',
      };
      onUpdate({
        ...data,
        expenses: [...data.expenses, expense],
      });
      setNewExpense({});
    }
  };

  const handleRemoveExpense = (id: string) => {
    onUpdate({
      ...data,
      expenses: data.expenses.filter((expense) => expense.id !== id),
    });
  };

  return (
    <Tabs defaultValue="income" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="income">Income Sources</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
      </TabsList>

      <TabsContent value="income" className="space-y-6">
        {/* Add Income Form */}
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incomeName">Source Name</Label>
              <Input
                id="incomeName"
                placeholder="e.g., Salary, Dividends"
                value={newIncome.name || ''}
                onChange={(e) => setNewIncome({ ...newIncome, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incomeAmount">Amount</Label>
              <Input
                id="incomeAmount"
                type="number"
                placeholder="0.00"
                value={newIncome.amount || ''}
                onChange={(e) => setNewIncome({ ...newIncome, amount: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incomeCategory">Category</Label>
              <Select
                value={newIncome.category}
                onValueChange={(value: IncomeCategory) => setNewIncome({ ...newIncome, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INCOME_CATEGORIES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incomeFrequency">Frequency</Label>
              <Select
                value={newIncome.frequency || 'monthly'}
                onValueChange={(value: FrequencyType) => setNewIncome({ ...newIncome, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAddIncome}
            disabled={!newIncome.name || !newIncome.amount || !newIncome.category}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Income Source
          </Button>
        </div>

        {/* Income List */}
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {data.incomeSources.map((income) => (
              <Card key={income.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{income.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {INCOME_CATEGORIES[income.category]} • {income.frequency}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="font-mono">${income.amount.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveIncome(income.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="expenses" className="space-y-6">
        {/* Add Expense Form */}
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenseName">Expense Name</Label>
              <Input
                id="expenseName"
                placeholder="e.g., Rent, Groceries"
                value={newExpense.name || ''}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseAmount">Amount</Label>
              <Input
                id="expenseAmount"
                type="number"
                placeholder="0.00"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expense-category" className="text-right">
                Category
              </Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => {
                  setNewExpense({
                    ...newExpense,
                    category: value as ExpenseCategory,
                    subcategory: '',
                  });
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(EXPENSE_CATEGORIES).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)} 
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({getExpenseType(category as ExpenseCategory)})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenseSubcategory">Subcategory</Label>
              <Select
                value={newExpense.subcategory}
                onValueChange={(value) => setNewExpense({ ...newExpense, subcategory: value })}
                disabled={!newExpense.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {newExpense.category && EXPENSE_CATEGORIES[newExpense.category as ExpenseCategory].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseFrequency">Frequency</Label>
              <Select
                value={newExpense.frequency || 'monthly'}
                onValueChange={(value: FrequencyType) => setNewExpense({ ...newExpense, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAddExpense}
            disabled={!newExpense.name || !newExpense.amount || !newExpense.category || !newExpense.subcategory}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Expenses List */}
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {data.expenses.map((expense) => (
              <Card key={expense.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{expense.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {expense.subcategory} • {expense.frequency}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="font-mono">${expense.amount.toFixed(2)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExpense(expense.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}