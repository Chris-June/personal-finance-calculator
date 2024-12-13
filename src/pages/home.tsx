import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  Calculator,
  PiggyBank,
  Wallet,
  Building,
  LineChart,
  CreditCard,
} from 'lucide-react';

const calculators = [
  {
    title: 'Net Worth',
    description: 'Calculate and track your total net worth',
    icon: Calculator,
    href: '/net-worth',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Budget',
    description: 'Plan and manage your monthly budget',
    icon: PiggyBank,
    href: '/budget',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Loan Qualification',
    description: 'Check your loan eligibility',
    icon: Building,
    href: '/loan',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Retirement',
    description: 'Plan for your retirement savings',
    icon: Wallet,
    href: '/retirement',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Investment',
    description: 'Calculate investment growth',
    icon: LineChart,
    href: '/investment',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    title: 'Debt Payoff',
    description: 'Plan your debt repayment strategy',
    icon: CreditCard,
    href: '/debt',
    gradient: 'from-red-500 to-rose-500',
  },
];

export function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Financial Calculator Suite
        </h1>
        <p className="text-lg text-muted-foreground">
          Make informed financial decisions with our comprehensive calculator tools
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => {
          const Icon = calculator.icon;
          return (
            <Link key={calculator.href} to={calculator.href}>
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${calculator.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-semibold bg-gradient-to-r ${calculator.gradient} bg-clip-text text-transparent`}>
                      {calculator.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {calculator.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}