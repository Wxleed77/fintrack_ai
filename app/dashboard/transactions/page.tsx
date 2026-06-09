"use client";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/utils";
import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownRight, Trash2, Filter } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: "", category: "" });

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.type) params.set("type", filter.type);
    if (filter.category) params.set("category", filter.category);
    const res = await fetch(`/api/transactions?${params}`);
    const data = await res.json();
    setTransactions(data.transactions || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const del = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{total} total records</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex gap-3 items-center">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))} className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <select value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">All Categories</option>
            {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
        {loading ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-12">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-12">No transactions found</p>
        ) : transactions.map(txn => (
          <div key={txn.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className={`p-2 rounded-lg ${txn.type === "INCOME" ? "bg-emerald-50 dark:bg-emerald-950" : "bg-red-50 dark:bg-red-950"}`}>
              {txn.type === "INCOME" ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{txn.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{txn.category} · {txn.paymentMethod} · {formatDate(txn.date)}</p>
            </div>
            <span className={`text-sm font-semibold ${txn.type === "INCOME" ? "text-emerald-600" : "text-red-500"}`}>
              {txn.type === "INCOME" ? "+" : "-"}{formatCurrency(txn.amount)}
            </span>
            <button onClick={() => del(txn.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
