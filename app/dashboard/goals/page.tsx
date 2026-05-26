"use client";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SavingsGoal } from "@/types";

export default function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => { fetch("/api/goals").then(r => r.json()).then(setGoals); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map(goal => {
          const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          return (
            <div key={goal.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{goal.goalName}</h3>
                <span className="text-2xl font-bold" style={{ color: goal.color }}>{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-xs text-gray-400">Saved</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.currentAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Target</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.targetAmount)}</p>
                </div>
              </div>
              {goal.deadline && (
                <p className="text-xs text-gray-400 mt-3">Deadline: {formatDate(goal.deadline)}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
