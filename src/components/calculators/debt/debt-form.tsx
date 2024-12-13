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
import { DebtDetails } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

interface DebtFormProps {
  debtDetails: DebtDetails;
  setDebtDetails: Dispatch<SetStateAction<DebtDetails>>;
}

type DebtField = keyof DebtDetails['debts'][0];
type DebtFieldValue<T extends DebtField> = DebtDetails['debts'][0][T];

export function DebtForm({ debtDetails, setDebtDetails }: DebtFormProps) {
  const addDebt = () => {
    setDebtDetails({
      ...debtDetails,
      debts: [
        ...debtDetails.debts,
        {
          id: crypto.randomUUID(),
          type: 'creditCard',
          name: 'New Debt',
          balance: 0,
          interestRate: 0,
          minimumPayment: 0,
        },
      ],
    });
  };

  const removeDebt = (id: string) => {
    setDebtDetails({
      ...debtDetails,
      debts: debtDetails.debts.filter(debt => debt.id !== id),
    });
  };

  const updateDebt = <T extends DebtField>(id: string, field: T, value: DebtFieldValue<T>) => {
    setDebtDetails({
      ...debtDetails,
      debts: debtDetails.debts.map(debt =>
        debt.id === id ? { ...debt, [field]: value } : debt
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Income and Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={debtDetails.monthlyIncome || ''}
            onChange={(e) =>
              setDebtDetails({
                ...debtDetails,
                monthlyIncome: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
          <Input
            id="monthlyExpenses"
            type="number"
            value={debtDetails.monthlyExpenses || ''}
            onChange={(e) =>
              setDebtDetails({
                ...debtDetails,
                monthlyExpenses: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Credit Score */}
      <div className="space-y-2">
        <Label htmlFor="creditScore">Credit Score (optional)</Label>
        <Input
          id="creditScore"
          type="number"
          value={debtDetails.creditScore || ''}
          onChange={(e) =>
            setDebtDetails({
              ...debtDetails,
              creditScore: parseFloat(e.target.value) || undefined,
            })
          }
          placeholder="Enter your credit score"
        />
      </div>

      {/* Debts */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Your Debts</Label>
          <Button onClick={addDebt} variant="outline" size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Debt
          </Button>
        </div>

        {debtDetails.debts.map((debt) => (
          <div key={debt.id} className="grid gap-4 p-4 border rounded-lg">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1 mr-4">
                <Label>Name</Label>
                <Input
                  type="text"
                  value={debt.name}
                  onChange={(e) =>
                    updateDebt(debt.id, 'name', e.target.value)
                  }
                  placeholder="e.g., Credit Card 1"
                />
              </div>
              <Select
                value={debt.type}
                onValueChange={(value: DebtDetails['debts'][0]['type']) =>
                  updateDebt(debt.id, 'type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select debt type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creditCard">Credit Card</SelectItem>
                  <SelectItem value="personalLoan">Personal Loan</SelectItem>
                  <SelectItem value="studentLoan">Student Loan</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDebt(debt.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Balance</Label>
                <Input
                  type="number"
                  value={debt.balance || ''}
                  onChange={(e) =>
                    updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Interest Rate (%)</Label>
                <Input
                  type="number"
                  value={debt.interestRate || ''}
                  onChange={(e) =>
                    updateDebt(
                      debt.id,
                      'interestRate',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Payment</Label>
                <Input
                  type="number"
                  value={debt.minimumPayment || ''}
                  onChange={(e) =>
                    updateDebt(
                      debt.id,
                      'minimumPayment',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Payment */}
      <div className="space-y-2">
        <Label htmlFor="additionalPayment">Additional Monthly Payment</Label>
        <Input
          id="additionalPayment"
          type="number"
          value={debtDetails.additionalPayment || ''}
          onChange={(e) =>
            setDebtDetails({
              ...debtDetails,
              additionalPayment: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="0.00"
        />
      </div>
    </div>
  );
}