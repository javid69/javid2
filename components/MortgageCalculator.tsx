"use client";

import { useMemo, useState } from "react";
import { IndianRupee, Percent, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface MortgageCalculatorProps {
  defaultLoanAmount: number;
  className?: string;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function calculateEmi(
  loanAmount: number,
  interestRate: number,
  years: number,
) {
  const principal = loanAmount;
  const monthlyInterest = interestRate / 12 / 100;
  const numberOfPayments = years * 12;

  if (monthlyInterest === 0) {
    const emi = principal / numberOfPayments;
    return {
      emi,
      totalAmount: emi * numberOfPayments,
      totalInterest: 0,
    };
  }

  const pow = Math.pow(1 + monthlyInterest, numberOfPayments);
  const emi = (principal * monthlyInterest * pow) / (pow - 1);
  const totalAmount = emi * numberOfPayments;
  const totalInterest = totalAmount - principal;

  return {
    emi,
    totalAmount,
    totalInterest,
  };
}

export function MortgageCalculator({
  defaultLoanAmount,
  className,
}: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = useState(8);
  const [loanYears, setLoanYears] = useState(20);

  const results = useMemo(
    () => calculateEmi(loanAmount, interestRate, loanYears),
    [interestRate, loanAmount, loanYears],
  );

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white shadow-sm",
        className,
      )}
    >
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-xl font-semibold text-foreground">Calculate EMI</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimate your monthly payments with adjustable interest and tenure.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <IndianRupee className="h-4 w-4 text-primary" /> Loan Amount
            </label>
            <input
              type="number"
              min={1000000}
              step={500000}
              value={loanAmount}
              onChange={(event) =>
                setLoanAmount(Number.parseInt(event.target.value || "0", 10))
              }
              className="w-full rounded-lg border border-border px-4 py-2"
            />
            <input
              type="range"
              min={1000000}
              max={loanAmount * 2}
              step={500000}
              value={loanAmount}
              onChange={(event) =>
                setLoanAmount(Number.parseInt(event.target.value || "0", 10))
              }
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Percent className="h-4 w-4 text-primary" /> Interest Rate (% per year)
            </label>
            <input
              type="number"
              min={5}
              max={20}
              step={0.1}
              value={interestRate}
              onChange={(event) =>
                setInterestRate(Number.parseFloat(event.target.value || "0"))
              }
              className="w-full rounded-lg border border-border px-4 py-2"
            />
            <input
              type="range"
              min={5}
              max={20}
              step={0.1}
              value={interestRate}
              onChange={(event) =>
                setInterestRate(Number.parseFloat(event.target.value || "0"))
              }
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Timer className="h-4 w-4 text-primary" /> Loan Duration (years)
            </label>
            <input
              type="number"
              min={1}
              max={40}
              step={1}
              value={loanYears}
              onChange={(event) =>
                setLoanYears(Number.parseInt(event.target.value || "0", 10))
              }
              className="w-full rounded-lg border border-border px-4 py-2"
            />
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={loanYears}
              onChange={(event) =>
                setLoanYears(Number.parseInt(event.target.value || "0", 10))
              }
              className="mt-2 w-full"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-xl bg-primary/5 p-6">
          <h4 className="text-lg font-semibold text-primary">
            EMI Calculation Summary
          </h4>
          <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-muted-foreground">Monthly EMI</p>
            <p className="text-2xl font-bold text-primary">
              {currencyFormatter.format(results.emi)}
            </p>
          </div>
          <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Amount Paid</p>
            <p className="text-xl font-semibold text-foreground">
              {currencyFormatter.format(results.totalAmount)}
            </p>
          </div>
          <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Interest Payable</p>
            <p className="text-xl font-semibold text-accent">
              {currencyFormatter.format(results.totalInterest)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            * Calculations are for illustration purposes only. Actual values may vary
            based on lender and loan terms.
          </p>
        </div>
      </div>
    </div>
  );
}
