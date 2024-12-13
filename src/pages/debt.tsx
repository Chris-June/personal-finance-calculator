import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DebtForm } from '@/components/calculators/debt/debt-form';
import { DebtChart } from '@/components/calculators/debt/debt-chart';
import { DebtSummary } from '@/components/calculators/debt/debt-summary';
import { useChat } from '@/lib/chat-context';
import { DebtDetails } from '@/lib/types';

export function Debt() {
  const [debtDetails, setDebtDetails] = useState<DebtDetails>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    creditScore: undefined,
    additionalPayment: 0,
    debts: [{
      id: crypto.randomUUID(),
      type: 'creditCard',
      name: 'Credit Card',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
    }],
  });
  const { setCalculatorData } = useChat();

  // Calculate aggregate values
  const totalDebt = debtDetails.debts.reduce((sum, debt) => sum + debt.balance, 0);
  const weightedInterestRate = totalDebt > 0 
    ? debtDetails.debts.reduce((sum, debt) => sum + (debt.interestRate * debt.balance), 0) / totalDebt 
    : 0;
  const totalMinPayment = debtDetails.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  const calculatePayoffTime = () => {
    if (weightedInterestRate === 0 || totalDebt === 0) {
      return {
        months: Math.ceil(totalDebt / totalMinPayment) || 0,
        totalInterest: 0,
      };
    }

    let balance = totalDebt;
    let months = 0;
    let totalInterest = 0;
    const monthlyRate = weightedInterestRate / 100 / 12;

    while (balance > 0 && months < 360) { // 30-year maximum
      const interest = balance * monthlyRate;
      totalInterest += interest;
      
      const principal = Math.min(totalMinPayment - interest, balance);
      balance -= principal;
      months++;
    }

    return {
      months,
      totalInterest,
    };
  };

  const { months, totalInterest } = calculatePayoffTime();
  const totalPayment = totalDebt + totalInterest;

  useEffect(() => {
    setCalculatorData({
      debtDetails,
      calculations: {
        payoffMonths: months,
        totalInterest,
        totalPayment,
        totalDebt,
        totalMinPayment,
      },
      analysis: {
        debtToIncomeRatio: debtDetails.monthlyIncome ? (totalMinPayment / debtDetails.monthlyIncome) * 100 : 0,
        disposableIncome: debtDetails.monthlyIncome - debtDetails.monthlyExpenses - totalMinPayment,
        totalDebts: debtDetails.debts.length,
      },
    });
  }, [debtDetails, months, totalInterest, totalPayment, totalDebt, totalMinPayment, setCalculatorData]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Debt Payoff Calculator</h1>
          <p className="text-muted-foreground mb-6">
            Calculate how long it will take to pay off your debt and see the impact
            of making additional payments.
          </p>
          <DebtForm
            debtDetails={debtDetails}
            setDebtDetails={setDebtDetails}
          />
        </Card>
      </div>
      <div className="space-y-6">
        <DebtSummary
          months={months}
          totalPayment={totalPayment}
          totalInterest={totalInterest}
          totalDebt={totalDebt}
          totalMinPayment={totalMinPayment}
        />
        <Card className="p-6">
          <DebtChart
            principal={totalDebt}
            monthlyPayment={totalMinPayment}
            interestRate={weightedInterestRate}
          />
        </Card>
      </div>
    </div>
  );
}