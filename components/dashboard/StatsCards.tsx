"use client";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  summary?: { income: number; expenses: number; savings: number; savingsRate: number };
}

export function StatsCards({ summary }: Props) {
  const cards = [
    {
      label: "Monthly Income",
      value: formatCurrency(summary?.income || 0),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(summary?.expenses || 0),
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950",
    },
    {
      label: "Net Savings",
      value: formatCurrency(summary?.savings || 0),
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Savings Rate",
      value: `${summary?.savingsRate || 0}%`,
      icon: PiggyBank,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <div className={`p-2 rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
