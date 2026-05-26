"use client";
import Link from "next/link";
import { SavingsGoal } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function GoalsWidget({ goals }: { goals: SavingsGoal[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Savings Goals</h3>
        <Link href="/goals" className="text-xs text-emerald-600 font-medium">View all</Link>
      </div>
      <div className="space-y-3">
        {goals.slice(0, 3).map((goal) => {
          const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          return (
            <div key={goal.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">{goal.goalName}</span>
                <span className="text-gray-500">{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</p>
            </div>
          );
        })}
        {goals.length === 0 && <p className="text-sm text-gray-400 text-center py-2">No goals set</p>}
      </div>
    </div>
  );
}
