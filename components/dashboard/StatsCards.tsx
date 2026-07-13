"use client";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  summary?: { income: number; expenses: number; savings: number; savingsRate: number };
  isLoading?: boolean;
}

export function StatsCards({ summary, isLoading }: Props) {
  const cards = [
    {
      label: "Monthly Income",
      value: formatCurrency(summary?.income || 0),
      icon: TrendingUp,
      accent: "text-emerald-500",
      bar: "bg-emerald-500",
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(summary?.expenses || 0),
      icon: TrendingDown,
      accent: "text-rose-500",
      bar: "bg-rose-500",
    },
    {
      label: "Net Savings",
      value: formatCurrency(summary?.savings || 0),
      icon: DollarSign,
      accent: "text-blue-500",
      bar: "bg-blue-500",
    },
    {
      label: "Savings Rate",
      value: `${summary?.savingsRate || 0}%`,
      icon: PiggyBank,
      accent: "text-violet-500",
      bar: "bg-violet-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card p-4 space-y-3">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-6 w-28" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, accent, bar }) => (
        <div key={label} className="card p-4 relative overflow-hidden">
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 ${bar}`} />
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
            <Icon className={`h-4 w-4 ${accent}`} />
          </div>
          <p className={`text-xl lg:text-2xl font-bold num ${label === "Net Savings" && (summary?.savings || 0) < 0 ? "text-rose-500" : "text-[var(--text-primary)]"}`}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}