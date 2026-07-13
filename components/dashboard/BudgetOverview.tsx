"use client";
import { formatCurrency } from "@/lib/utils";
import { Budget, CategoryBreakdown } from "@/types";

export function BudgetOverview({ budgets, spending, isLoading }: { budgets: Budget[]; spending: CategoryBreakdown[]; isLoading?: boolean }) {
  const spendMap = Object.fromEntries(spending.map(s => [s.category, s.amount]));

  if (isLoading) {
    return (
      <div className="card p-5 space-y-4">
        <div className="skeleton h-5 w-32" />
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-3.5 w-full" />
            <div className="skeleton h-2 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Budget Tracker</h3>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const spent = spendMap[budget.category] || 0;
          const pct = Math.min(Math.round((spent / budget.limitAmount) * 100), 100);
          const isWarning = pct >= 90;
          const isCaution = pct >= 70 && pct < 90;

          return (
            <div key={budget.id}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-[var(--text-primary)]">{budget.category}</span>
                <span className="text-[var(--text-tertiary)] num">
                  <span className={isWarning ? "text-rose-500" : isCaution ? "text-amber-500" : "text-emerald-500"}>
                    {formatCurrency(spent)}
                  </span>
                  {" / "}{formatCurrency(budget.limitAmount)}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-bar-fill ${
                    isWarning ? "bg-rose-500" :
                    isCaution ? "bg-amber-500" :
                    "bg-emerald-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
        {budgets.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] text-center py-4">No budgets set</p>
        )}
      </div>
    </div>
  );
}