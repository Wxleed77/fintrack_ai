"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getMonthName } from "@/lib/utils";
import { useCurrency } from "@/components/layout/CurrencyProvider";
import { useCategories } from "@/components/layout/CategoriesProvider";
import { toast, toastError, handleResponse } from "@/lib/toast";
import { Budget, CategoryBreakdown } from "@/types";
import { motion } from "framer-motion";
import { Wallet, Plus, Loader2, Trash2 } from "lucide-react";

export default function BudgetsPage() {
  const { fmt, currency } = useCurrency();
  const { expenseCategories } = useCategories();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [spentByCategory, setSpentByCategory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ category: string; limitAmount: number }>();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, aRes] = await Promise.all([
        fetch(`/api/budgets?month=${month}&year=${year}`),
        fetch(`/api/analytics?month=${month}&year=${year}`),
      ]);
      if (!bRes.ok || !aRes.ok) {
        toastError("Couldn't load your budgets. Try refreshing.");
        return;
      }
      setBudgets(await bRes.json());
      const analytics = await aRes.json();
      const breakdown: CategoryBreakdown[] = analytics.categoryBreakdown || [];
      setSpentByCategory(Object.fromEntries(breakdown.map(b => [b.category, b.amount || 0])));
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { load(); }, [load]);

  const onSubmit = async (data: { category: string; limitAmount: number }) => {
    const limitAmount = Number(data.limitAmount);
    if (!Number.isFinite(limitAmount) || limitAmount <= 0) {
      toastError("Enter a positive budget amount");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: data.category, limitAmount, month, year }),
      });
      await handleResponse(res, "Failed to save budget");
      toast("Budget saved", { type: "success" });
      reset();
      load();
      window.dispatchEvent(new CustomEvent("fin:data-change"));
    } catch {
      /* handled */
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    const budget = budgets.find(b => b.id === id);
    if (!budget) return;
    setBudgets(list => list.filter(b => b.id !== id));
    const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toastError("Failed to delete budget");
      load();
      return;
    }
    toast("Budget deleted", {
      type: "info",
      duration: 7000,
      action: {
        label: "Undo",
        onClick: async () => {
          const restoreRes = await fetch("/api/budgets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category: budget.category,
              limitAmount: budget.limitAmount,
              month: budget.month,
              year: budget.year,
            }),
          });
          if (!restoreRes.ok) toastError("Couldn't restore — recreate it manually");
          else load();
        },
      },
    });
    window.dispatchEvent(new CustomEvent("fin:data-change"));
  };

  const totalLimit = budgets.reduce((s, b) => s + b.limitAmount, 0);
  const totalSpent = budgets.reduce((s, b) => s + (spentByCategory[b.category] || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Budgets</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your {getMonthName(month)} {year} spending limits
        </p>
      </div>

      {/* Summary */}
      {budgets.length > 0 && (
        <div className="card p-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs text-[var(--text-secondary)]">Total budgeted this month</p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {fmt(totalSpent)} spent of {fmt(totalLimit)}
            </p>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-bar-fill ${totalSpent > totalLimit ? "bg-coral-500" : "bg-indigo-500"}`}
              style={{ width: totalLimit > 0 ? `${Math.min(Math.round((totalSpent / totalLimit) * 100), 100)}%` : "0%" }}
            />
          </div>
        </div>
      )}

      <div className="card p-5">
        <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Set Monthly Budget</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
          <select {...register("category", { required: true })} className="select flex-1">
            {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={`Limit (${currency} — e.g. 10000)`}
            className="input flex-1 num"
            {...register("limitAmount", { valueAsNumber: true })}
          />
          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={saving} className="btn-primary whitespace-nowrap">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Save
          </motion.button>
        </form>
        {errors.limitAmount && <p className="text-xs text-coral-500 mt-2">{errors.limitAmount.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="card p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="skeleton h-10 w-10 rounded-md" />
                <div className="skeleton h-4 w-24" />
              </div>
              <div className="skeleton h-6 w-28" />
            </div>
          ))
        ) : (
          budgets.map(budget => {
            const spent = spentByCategory[budget.category] || 0;
            const pct = budget.limitAmount > 0 ? Math.min(Math.round((spent / budget.limitAmount) * 100), 100) : 0;
            const over = spent > budget.limitAmount;
            const warn = !over && pct >= 80;
            return (
              <div key={budget.id} className="card-hover p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-md bg-indigo-500/10 text-indigo-500">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-[var(--text-primary)] truncate">{budget.category}</h3>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {over
                        ? "Over budget!"
                        : warn
                        ? "Almost spent — watch out"
                        : `${pct}% of budget used`}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => del(budget.id)}
                    aria-label={`Delete ${budget.category} budget`}
                    title="Delete"
                    className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-coral-500 hover:bg-coral-500/10 transition-all duration-150"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold num text-[var(--text-primary)]">{fmt(budget.limitAmount)}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">/ month</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill ${over ? "bg-coral-500" : warn ? "bg-amber-500" : "bg-indigo-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-2 num">
                  {fmt(spent)} spent · {fmt(Math.max(budget.limitAmount - spent, 0))} left · {pct}%
                </p>
              </div>
            );
          })
        )}

        {!loading && budgets.length === 0 && (
          <div className="md:col-span-2 card p-8 text-center">
            <Wallet className="h-10 w-10 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-medium">No budgets set</p>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Add a budget above to start tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}
