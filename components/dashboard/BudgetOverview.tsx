"use client";
import { formatCurrency } from "@/lib/utils";
import { Budget, CategoryBreakdown } from "@/types";

export function BudgetOverview({ budgets, spending, isLoading }: { budgets: Budget[]; spending: CategoryBreakdown[]; isLoading?: boolean }) {
  const spendMap = Object.fromEntries(spending.map(s => [s.category, s.amount]));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Budget Tracker</h3>
      <div className="space-y-3">
        {budgets.map((budget) => {
          const spent = spendMap[budget.category] || 0;
          const pct = Math.min(Math.round((spent / budget.limitAmount) * 100), 100);
          const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-400" : "bg-emerald-500";
          return (
            <div key={budget.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{budget.category}</span>
                <span className="text-gray-500 dark:text-gray-400">{formatCurrency(spent)} / {formatCurrency(budget.limitAmount)}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        {budgets.length === 0 && <p className="text-sm text-gray-400 text-center py-2">No budgets set</p>}
      </div>
    </div>
  );
}
