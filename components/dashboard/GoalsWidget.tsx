"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SavingsGoal } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Target, ExternalLink } from "lucide-react";

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

export function GoalsWidget({ goals, isLoading }: { goals: SavingsGoal[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="card p-5 space-y-4">
        <div className="skeleton h-5 w-32" />
        {[1, 2].map(i => (
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-[var(--text-primary)]">Savings Goals</h3>
        <Link
          href="/dashboard/goals"
          className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
        >
          View all
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <motion.div
        className="space-y-4"
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
        }}
      >
        {goals.slice(0, 3).map((goal) => {
          const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          return (
            <motion.div
              key={goal.id}
              variants={{
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: goal.color }} />
                  <span className="text-xs font-medium text-[var(--text-primary)]">{goal.goalName}</span>
                </div>
                <span className="text-xs font-semibold text-[var(--text-secondary)] num">{pct}%</span>
              </div>
              <div className="progress-bar">
                <AnimatedBar pct={pct} color={goal.color} />
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-1.5 num">
                {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
              </p>
            </motion.div>
          );
        })}
        {goals.length === 0 && (
          <div className="text-center py-4">
            <Target className="h-8 w-8 text-[var(--text-tertiary)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-tertiary)]">No goals set</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}