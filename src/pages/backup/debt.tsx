import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DebtForm } from '@/components/calculators/debt/debt-form';
import { DebtChart } from '@/components/calculators/debt/debt-chart';
import { DebtSummary } from '@/components/calculators/debt/debt-summary';
import { useChat } from '@/lib/chat-context';

interface DebtDetails {
  amount: number;
  interestRate: number;
  monthlyPayment: number;
  additionalPayment: number;
  type: 'credit-card' | 'personal-loan' | 'student-loan' | 'auto-loan' | 'other';
}

export function Debt() {
  const [debtDetails, setDebtDetails] = useState<DebtDetails>({
    amount: 0,
    interestRate: 0,
    monthlyPayment: 0,
    additionalPayment: 0,
    type: 'credit-card',
  });
  const { setCalculatorData } = useChat();

  const calculatePayoffTime = () => {
    const monthlyRate = debtDetails.interestRate / 100 / 12;
    const totalMonthlyPayment = debtDetails.monthlyPayment + debtDetails.additionalPayment;

    if (monthlyRate === 0) {
      return {
        months: Math.ceil(debtDetails.amount / totalMonthlyPayment),
        totalInterest: 0,
      };
    }

    let balance = debtDetails.amount;
    let months = 0;
    let totalInterest = 0;

    while (balance > 0 && months < 360) { // 30-year maximum
      const interest = balance * monthlyRate;
      totalInterest += interest;
      
      const principal = Math.min(totalMonthlyPayment - interest, balance);
      balance -= principal;
      months++;
    }

    return {
      months,
      totalInterest,
    };
  };

  const { months, totalInterest } = calculatePayoffTime();
  const totalPayment = debtDetails.amount + totalInterest;

  // Update chat context whenever debt details or calculations change
  useEffect(() => {
    setCalculatorData({
      debtDetails,
      calculations: {
        payoffMonths: months,
        totalInterest,
        totalPayment,
        monthlyPayment: debtDetails.monthlyPayment,
        additionalPayment: debtDetails.additionalPayment,
        totalMonthlyPayment: debtDetails.monthlyPayment + debtDetails.additionalPayment,
      },
      analysis: {
        interestSavings: calculatePayoffTime().totalInterest - totalInterest,
        timeReduction: calculatePayoffTime().months - months,
        debtToIncomeRatio: ((debtDetails.monthlyPayment + debtDetails.additionalPayment) / totalPayment) * 100,
      },
    });
  }, [debtDetails, months, totalInterest, totalPayment, setCalculatorData]);

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
          monthlyPayment={debtDetails.monthlyPayment}
          additionalPayment={debtDetails.additionalPayment}
        />
        <Card className="p-6">
          <DebtChart
            principal={debtDetails.amount}
            monthlyPayment={debtDetails.monthlyPayment}
            additionalPayment={debtDetails.additionalPayment}
            interestRate={debtDetails.interestRate}
          />
        </Card>
      </div>
    </div>
  );
}