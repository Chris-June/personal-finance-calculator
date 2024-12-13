import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DebtFacility, DebtType, PaymentFrequency } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface DebtListProps {
  debts: DebtFacility[];
  onDebtsChange: (debts: DebtFacility[]) => void;
}

const DEBT_TYPES: { value: DebtType; label: string }[] = [
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'carLoan', label: 'Car Loan' },
  { value: 'studentLoan', label: 'Student Loan' },
  { value: 'creditCard', label: 'Credit Card' },
  { value: 'lineOfCredit', label: 'Line of Credit' },
  { value: 'personalLoan', label: 'Personal Loan' },
  { value: 'heloc', label: 'HELOC' },
  { value: 'other', label: 'Other' },
];

const PAYMENT_FREQUENCIES: { value: PaymentFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'acceleratedBiweekly', label: 'Accelerated Bi-weekly' },
];

export function DebtList({ debts, onDebtsChange }: DebtListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newDebt, setNewDebt] = useState<Partial<DebtFacility>>({
    type: 'other',
    paymentFrequency: 'monthly',
    isInterestOnly: false,
    isSecured: false,
  });

  const handleAddDebt = () => {
    if (
      newDebt.type &&
      newDebt.balance &&
      newDebt.interestRate &&
      newDebt.minimumPayment &&
      newDebt.paymentFrequency
    ) {
      const debt: DebtFacility = {
        id: uuidv4(),
        type: newDebt.type,
        balance: Number(newDebt.balance),
        creditLimit: newDebt.creditLimit ? Number(newDebt.creditLimit) : undefined,
        interestRate: Number(newDebt.interestRate),
        minimumPayment: Number(newDebt.minimumPayment),
        paymentFrequency: newDebt.paymentFrequency,
        isInterestOnly: newDebt.isInterestOnly,
        isSecured: newDebt.isSecured,
        lender: newDebt.lender,
      };

      onDebtsChange([...debts, debt]);
      setIsOpen(false);
      setNewDebt({
        type: 'other',
        paymentFrequency: 'monthly',
        isInterestOnly: false,
        isSecured: false,
      });
    }
  };

  const handleRemoveDebt = (id: string) => {
    onDebtsChange(debts.filter((debt) => debt.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Existing Debts</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Debt</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  value={newDebt.type}
                  onValueChange={(value: DebtType) =>
                    setNewDebt({ ...newDebt, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEBT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="number"
                  placeholder="Balance"
                  value={newDebt.balance || ''}
                  onChange={(e) =>
                    setNewDebt({ ...newDebt, balance: e.target.valueAsNumber })
                  }
                />
              </div>

              {(newDebt.type === 'lineOfCredit' ||
                newDebt.type === 'heloc' ||
                newDebt.type === 'creditCard') && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    type="number"
                    placeholder="Credit Limit"
                    value={newDebt.creditLimit || ''}
                    onChange={(e) =>
                      setNewDebt({
                        ...newDebt,
                        creditLimit: e.target.valueAsNumber,
                      })
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="number"
                  placeholder="Interest Rate (%)"
                  value={newDebt.interestRate || ''}
                  onChange={(e) =>
                    setNewDebt({
                      ...newDebt,
                      interestRate: e.target.valueAsNumber,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="number"
                  placeholder="Minimum Payment"
                  value={newDebt.minimumPayment || ''}
                  onChange={(e) =>
                    setNewDebt({
                      ...newDebt,
                      minimumPayment: e.target.valueAsNumber,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  value={newDebt.paymentFrequency}
                  onValueChange={(value: PaymentFrequency) =>
                    setNewDebt({ ...newDebt, paymentFrequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_FREQUENCIES.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newDebt.isInterestOnly}
                  onCheckedChange={(checked) =>
                    setNewDebt({ ...newDebt, isInterestOnly: checked })
                  }
                />
                <span>Interest Only</span>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newDebt.isSecured}
                  onCheckedChange={(checked) =>
                    setNewDebt({ ...newDebt, isSecured: checked })
                  }
                />
                <span>Secured</span>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  type="text"
                  placeholder="Lender (optional)"
                  value={newDebt.lender || ''}
                  onChange={(e) =>
                    setNewDebt({ ...newDebt, lender: e.target.value })
                  }
                />
              </div>
            </div>
            <Button onClick={handleAddDebt}>Add Debt</Button>
          </DialogContent>
        </Dialog>
      </div>

      {debts.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>
                  {DEBT_TYPES.find((t) => t.value === debt.type)?.label}
                </TableCell>
                <TableCell>{formatCurrency(debt.balance)}</TableCell>
                <TableCell>{debt.interestRate}%</TableCell>
                <TableCell>{formatCurrency(debt.minimumPayment)}</TableCell>
                <TableCell>
                  {
                    PAYMENT_FREQUENCIES.find(
                      (f) => f.value === debt.paymentFrequency
                    )?.label
                  }
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDebt(debt.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground py-4">
          No existing debts added
        </div>
      )}
    </div>
  );
}
