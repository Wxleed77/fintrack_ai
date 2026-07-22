"use client";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Budget, CategoryBreakdown } from "@/types";

function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  return (
    <motion.div
      className="h-full rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ backgroundColor: color }}
    />
  );
}

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
          const barColor = isWarning ? "#fb7185" : isCaution ? "#fbbf24" : "#14b8a6";

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-[var(--text-primary)]">{budget.category}</span>
                <span className="text-[var(--text-tertiary)] num">
                  <span style={{ color: barColor }}>
                    {formatCurrency(spent)}
                  </span>
                  {" / "}{formatCurrency(budget.limitAmount)}
                </span>
              </div>
              <div className="progress-bar">
                <AnimatedBar pct={pct} color={barColor} />
              </div>
            </motion.div>
          );
        })}
        {budgets.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] text-center py-4">No budgets set</p>
        )}
      </div>
    </div>
  );
}