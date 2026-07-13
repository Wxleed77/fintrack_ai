"use client";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SavingsGoal } from "@/types";
import { Target } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => { fetch("/api/goals").then(r => r.json()).then(setGoals); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Savings Goals</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Track your savings targets and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map(goal => {
          const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          const isComplete = pct >= 100;
          return (
            <div key={goal.id} className="card-hover p-5 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: goal.color }}
              />

              <div className="flex items-center justify-between mb-5 mt-1">
                <h3 className="font-display font-semibold text-[var(--text-primary)]">{goal.goalName}</h3>
                <div className="flex items-center gap-2">
                  {isComplete && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      Complete!
                    </span>
                  )}
                  <span className="text-2xl font-bold num" style={{ color: goal.color }}>
                    {pct}%
                  </span>
                </div>
              </div>

              <div className="progress-bar mb-3">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: goal.color }}
                />
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">Saved</p>
                  <p className="text-sm font-bold num text-[var(--text-primary)]">{formatCurrency(goal.currentAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-tertiary)]">Target</p>
                  <p className="text-sm font-bold num text-[var(--text-primary)]">{formatCurrency(goal.targetAmount)}</p>
                </div>
              </div>

              {goal.deadline && (
                <div className="mt-3 pt-3 border-t border-[var(--border-card)]">
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Deadline: {formatDate(goal.deadline)}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 card p-10 text-center">
            <Target className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-medium">No savings goals yet</p>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Create your first goal to start saving</p>
          </div>
        )}
      </div>
    </div>
  );
}