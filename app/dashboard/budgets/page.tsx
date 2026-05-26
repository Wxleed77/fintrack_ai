"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formatCurrency, EXPENSE_CATEGORIES } from "@/lib/utils";
import { Budget } from "@/types";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { register, handleSubmit, reset } = useForm();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const load = () => fetch(`/api/budgets?month=${month}&year=${year}`).then(r => r.json()).then(setBudgets);
  useEffect(() => { load(); }, []);

  const onSubmit = async (data: any) => {
    await fetch("/api/budgets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, amount: +data.limitAmount, limitAmount: +data.limitAmount, month, year }) });
    reset(); load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
        <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Set Monthly Budget</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
          <select {...register("category")} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" {...register("limitAmount")} placeholder="Limit (PKR)" className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map(budget => (
          <div key={budget.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
              <span className="text-sm text-gray-500">Limit: {formatCurrency(budget.limitAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
