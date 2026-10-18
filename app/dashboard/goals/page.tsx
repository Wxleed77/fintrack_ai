"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { useCurrency } from "@/components/layout/CurrencyProvider";
import { toast, toastError } from "@/lib/toast";
import { SavingsGoal } from "@/types";
import { GoalModal } from "@/components/forms/GoalModal";
import { Target, Plus, Pencil, Trash2 } from "lucide-react";

export default function GoalsPage() {
  const { fmt } = useCurrency();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<SavingsGoal | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/goals");
      if (!res.ok) {
        toastError("Couldn't load your goals. Try refreshing.");
        return;
      }
      setGoals(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    setGoals(list => list.filter(g => g.id !== id));
    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toastError("Failed to delete goal");
      load();
      return;
    }
    toast("Goal deleted", {
      type: "info",
      duration: 7000,
      action: {
        label: "Undo",
        onClick: async () => {
          const restoreRes = await fetch("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              goalName: goal.goalName,
              targetAmount: goal.targetAmount,
              currentAmount: goal.currentAmount,
              deadline: goal.deadline || null,
              color: goal.color,
              icon: goal.icon,
            }),
          });
          if (!restoreRes.ok) toastError("Couldn't restore — recreate it manually");
          else load();
        },
      },
    });
  };

  const handleSaved = () => {
    setCreating(false);
    setEditing(null);
    load();
    window.dispatchEvent(new CustomEvent("fin:data-change"));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Savings Goals</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Track your savings targets and progress</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCreating(true)}
          className="btn-primary text-sm"
        >
          <Plus className="h-4 w-4" />
          New Goal
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card p-5 space-y-4">
              <div className="flex justify-between">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-4 w-10" />
              </div>
              <div className="skeleton h-1.5 w-full rounded-full" />
              <div className="flex justify-between">
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 w-16" />
              </div>
            </div>
          ))
        ) : (
          goals.map(goal => {
            const pct = goal.targetAmount > 0
              ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
              : 0;
            const isComplete = pct >= 100;
            return (
              <div key={goal.id} className="card-hover p-5 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: goal.color }}
                />

                <div className="flex items-center justify-between mb-5 mt-1">
                  <h3 className="font-display font-semibold text-[var(--text-primary)] truncate">{goal.goalName}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isComplete && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-500">
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
                    <p className="text-sm font-bold num text-[var(--text-primary)]">{fmt(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-tertiary)]">Target</p>
                    <p className="text-sm font-bold num text-[var(--text-primary)]">{fmt(goal.targetAmount)}</p>
                  </div>
                </div>

                {goal.deadline && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-card)]">
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Deadline: {formatDate(goal.deadline)}
                    </p>
                  </div>
                )}

                <div className="flex gap-1.5 justify-end mt-3">
                  <button
                    onClick={() => setEditing(goal)}
                    aria-label={`Edit ${goal.goalName}`}
                    title="Edit"
                    className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-indigo-500 hover:bg-indigo-500/10 transition-all duration-150"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => del(goal.id)}
                    aria-label={`Delete ${goal.goalName}`}
                    title="Delete"
                    className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-coral-500 hover:bg-coral-500/10 transition-all duration-150"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            );
          })
        )}

        {!loading && goals.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 card p-10 text-center">
            <Target className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-medium">No savings goals yet</p>
            <button onClick={() => setCreating(true)} className="btn-primary mx-auto mt-4">
              <Plus className="h-4 w-4" />
              Create your first goal
            </button>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <GoalModal
          onClose={() => { setCreating(false); setEditing(null); }}
          onSuccess={handleSaved}
          goal={editing || undefined}
        />
      )}
    </div>
  );
}
