"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formatCurrency, EXPENSE_CATEGORIES } from "@/lib/utils";
import { Budget } from "@/types";
import { Wallet, Plus } from "lucide-react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { register, handleSubmit, reset } = useForm();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const load = () => fetch(`/api/budgets?month=${month}&year=${year}`).then(r => r.json()).then(setBudgets);
  useEffect(() => { load(); }, []);

  const onSubmit = async (data: any) => {
    await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, amount: +data.limitAmount, limitAmount: +data.limitAmount, month, year }),
    });
    reset();
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Budgets</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Set and manage your monthly spending limits</p>
      </div>

      <div className="card p-5">
        <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Set Monthly Budget</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
          <select {...register("category")} className="select flex-1">
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            {...register("limitAmount")}
            placeholder="Limit (PKR)"
            className="input flex-1 num"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Save
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map(budget => (
          <div key={budget.id} className="card-hover p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-[var(--text-primary)]">{budget.category}</h3>
                <p className="text-xs text-[var(--text-tertiary)]">Budget limit</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold num text-[var(--text-primary)]">{formatCurrency(budget.limitAmount)}</span>
              <span className="text-sm text-[var(--text-tertiary)]">/ month</span>
            </div>
          </div>
        ))}
        {budgets.length === 0 && (
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