import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  PiggyBank,
  TrendingUp,
  Landmark,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  {
    name: "Loan",
    href: "/loan",
    icon: Calculator,
    description: "Calculate loan payments and analyze affordability",
  },
  {
    name: "Investment",
    href: "/investment",
    icon: TrendingUp,
    description: "Plan and track your investment portfolio",
  },
  {
    name: "Retirement",
    href: "/retirement",
    icon: PiggyBank,
    description: "Plan for your retirement goals",
  },
  {
    name: "Net Worth",
    href: "/net-worth",
    icon: Landmark,
    description: "Track your assets and liabilities",
  },
  {
    name: "Debt",
    href: "/debt",
    icon: CreditCard,
    description: "Manage and optimize your debt",
  },
];

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              IntelliSync
            </span>
          </Link>

          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <div className="flex items-center gap-1">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search or other controls here */}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="border-t px-4 py-2 md:hidden">
          <nav className="grid gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  location.pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
