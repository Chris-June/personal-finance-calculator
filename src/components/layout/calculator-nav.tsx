import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Calculator,
  PiggyBank,
  DollarSign,
  Percent,
  Building2,
  LineChart,
} from 'lucide-react';

const calculators = [
  {
    name: 'Budget',
    href: '/budget',
    icon: PiggyBank,
    description: 'Track income, expenses, and savings',
  },
  {
    name: 'Loan',
    href: '/loan',
    icon: Building2,
    description: 'Calculate loan payments and affordability',
  },
  {
    name: 'Investment',
    href: '/investment',
    icon: LineChart,
    description: 'Plan investments and track growth',
  },
  {
    name: 'Net Worth',
    href: '/net-worth',
    icon: DollarSign,
    description: 'Calculate and track your net worth',
  },
  {
    name: 'Tax',
    href: '/tax',
    icon: Calculator,
    description: 'Estimate taxes and deductions',
  },
  {
    name: 'Interest',
    href: '/interest',
    icon: Percent,
    description: 'Calculate compound interest and returns',
  },
];

export function CalculatorNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {calculators.map((calculator) => {
        const Icon = calculator.icon;
        const isActive = currentPath === calculator.href;
        return (
          <Link
            key={calculator.name}
            to={calculator.href}
            className={cn(
              'flex items-center space-x-3 p-3 rounded-lg transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <div>
              <div className="font-medium">{calculator.name}</div>
              <div className="text-sm text-muted-foreground">
                {calculator.description}
              </div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
