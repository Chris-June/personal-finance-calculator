import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { LoanCalculations, PaymentFrequency } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LoanSummaryProps {
  calculations: LoanCalculations;
  paymentFrequency: PaymentFrequency;
}

export function LoanSummary({ calculations, paymentFrequency }: LoanSummaryProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const getProgressColor = (value: number, threshold: number) => {
    if (value > threshold) return 'bg-red-500';
    if (value > threshold * 0.8) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const { debtServiceRatios } = calculations.metrics;

  const isApproved = 
    debtServiceRatios.grossDebtServiceRatio <= 32 && 
    debtServiceRatios.totalDebtServiceRatio <= 44;

  const reasons = [];
  
  if (debtServiceRatios.grossDebtServiceRatio > 32) {
    reasons.push('Gross Debt Service Ratio exceeds 32%');
  }
  if (debtServiceRatios.totalDebtServiceRatio > 44) {
    reasons.push('Total Debt Service Ratio exceeds 44%');
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {paymentFrequency === 'monthly' ? 'Monthly' : 'Bi-weekly'} Payment
            </span>
            <span className="font-medium">
              {formatCurrency(
                paymentFrequency === 'monthly'
                  ? calculations.monthlyPayment
                  : calculations.biweeklyPayment
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Interest</span>
            <span className="font-medium">{formatCurrency(calculations.totalInterest)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Cost</span>
            <span className="font-medium">{formatCurrency(calculations.totalPayment)}</span>
          </div>
          {calculations.metrics.estimatedTaxSavings > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Tax Savings</span>
              <span className="font-medium text-green-500">
                {formatCurrency(calculations.metrics.estimatedTaxSavings)}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Debt Service Ratios</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Gross Debt Service Ratio (GDSR)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Housing costs divided by gross monthly income.</p>
                      <p>Should be below 32% for approval.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-medium">{formatPercentage(debtServiceRatios.grossDebtServiceRatio)}</span>
            </div>
            <Progress
              value={debtServiceRatios.grossDebtServiceRatio}
              max={100}
              className={clsx(
                'h-2',
                getProgressColor(debtServiceRatios.grossDebtServiceRatio, 32)
              )}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Total Debt Service Ratio (TDSR)</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>All debt payments divided by gross monthly income.</p>
                      <p>Should be below 44% for approval.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-medium">{formatPercentage(debtServiceRatios.totalDebtServiceRatio)}</span>
            </div>
            <Progress
              value={debtServiceRatios.totalDebtServiceRatio}
              max={100}
              className={clsx(
                'h-2',
                getProgressColor(debtServiceRatios.totalDebtServiceRatio, 44)
              )}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Loan Metrics</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Housing Expenses</span>
            <span className="font-medium">
              {formatCurrency(debtServiceRatios.monthlyHousingExpenses)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Other Monthly Debt Payments</span>
            <span className="font-medium">
              {formatCurrency(debtServiceRatios.monthlyDebtPayments)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Monthly Obligations</span>
            <span className="font-medium">
              {formatCurrency(debtServiceRatios.totalMonthlyObligations)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Available Monthly Income</span>
            <span className="font-medium">
              {formatCurrency(debtServiceRatios.availableMonthlyIncome)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Maximum Affordable Loan</span>
            <span className="font-medium">
              {formatCurrency(debtServiceRatios.maxAffordableLoan)}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          {isApproved ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-500">Loan Approval Likely</h3>
                <p className="text-sm text-muted-foreground">
                  Your debt service ratios are within acceptable ranges
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-500">Loan Approval May Be Difficult</h3>
                <div className="text-sm text-muted-foreground">
                  {reasons.map((reason, index) => (
                    <p key={index}>{reason}</p>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}