"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/utils";
import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownRight, Trash2, Filter, Search } from "lucide-react";

const stagger = {
  animate: {
    transition: { staggerChildren: 0.03, delayChildren: 0.08 },
  },
} as const;

const fadeSlide = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Transactions</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{total} total records</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-[var(--text-tertiary)]" />
          <select
            value={filter.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(f => ({ ...f, type: e.target.value }))}
            className="select text-xs py-1.5 w-auto"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <select
            value={filter.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(f => ({ ...f, category: e.target.value }))}
            className="select text-xs py-1.5 w-auto"
          >
            <option value="">All Categories</option>
            {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {(filter.type || filter.category) && (
            <button
              onClick={() => setFilter({ type: "", category: "" })}
              className="text-xs text-[var(--text-tertiary)] hover:text-coral-500 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="card divide-y divide-[var(--border-card)] overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton h-9 w-9 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton h-3 w-28" />
                </div>
                <div className="skeleton h-4 w-16" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="h-10 w-10 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-medium">No transactions found</p>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate">
            {transactions.map(txn => (
              <motion.div
                key={txn.id}
                variants={fadeSlide}
                className="flex items-center gap-4 p-4 hover:bg-[var(--bg-hover)] transition-colors duration-150 group"
              >
                <div className={`p-2.5 rounded-md ${
                  txn.type === "INCOME"
                    ? "bg-teal-500/10 text-teal-500"
                    : "bg-coral-500/10 text-coral-500"
                }`}>
                  {txn.type === "INCOME"
                    ? <ArrowUpRight className="h-4.5 w-4.5" />
                    : <ArrowDownRight className="h-4.5 w-4.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{txn.description}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {txn.category} · {txn.paymentMethod} · {formatDate(txn.date)}
                  </p>
                </div>
                <span className={`text-sm font-semibold num ${
                  txn.type === "INCOME" ? "text-teal-500" : "text-coral-500"
                }`}>
                  {txn.type === "INCOME" ? "+" : "-"}{formatCurrency(txn.amount)}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => del(txn.id)}
                  className="p-2 rounded-md text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 hover:text-coral-500 hover:bg-coral-500/10 transition-all duration-150"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}