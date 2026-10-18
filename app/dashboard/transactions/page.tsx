"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { useCurrency } from "@/components/layout/CurrencyProvider";
import { useCategories } from "@/components/layout/CategoriesProvider";
import { handleResponse, toast, toastError } from "@/lib/toast";
import { Transaction } from "@/types";
import { AddTransactionModal } from "@/components/forms/AddTransactionModal";
import {
  ArrowUpRight, ArrowDownRight, Trash2, Filter, Search,
  Pencil, ChevronLeft, ChevronRight, Plus,
} from "lucide-react";

const PAGE_SIZE = 20;

const stagger = {
  animate: {
    transition: { staggerChildren: 0.03, delayChildren: 0.08 },
  },
} as const;

const fadeSlide = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function TransactionsPage() {
  const { fmt } = useCurrency();
  const { expenseCategories, incomeCategories } = useCategories();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: "", category: "" });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [adding, setAdding] = useState(false);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));
      params.set("month", String(period.month));
      params.set("year", String(period.year));
      if (filter.type) params.set("type", filter.type);
      if (filter.category) params.set("category", filter.category);
      if (search) params.set("search", search);
      const res = await fetch(`/api/transactions?${params}`);
      if (!res.ok) {
        toastError("Couldn't load your transactions. Try refreshing.");
        return;
      }
      const data = await res.json();
      setTransactions(data.transactions || []);
      setTotal(data.total || 0);
      setPages(Math.max(data.pages, 1));
    } finally {
      setLoading(false);
    }
  }, [page, filter, search, period]);

  useEffect(() => { load(); }, [load]);

  const del = async (id: string) => {
    const txn = transactions.find((t: Transaction) => t.id === id);
    if (!txn) return;
    // Optimistic removal — undo restores it via re-POST
    setTransactions(list => list.filter(t => t.id !== id));
    setTotal(t => Math.max(t - 1, 0));
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toastError("Failed to delete transaction");
      load();
      return;
    }
    toast("Transaction deleted", {
      type: "info",
      duration: 7000,
      action: {
        label: "Undo",
        onClick: async () => {
          const restoreRes = await fetch("/api/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: txn.type,
              category: txn.category,
              amount: txn.amount,
              description: txn.description,
              date: new Date(txn.date).toISOString().split("T")[0],
              paymentMethod: txn.paymentMethod,
              notes: txn.notes || undefined,
            }),
          });
          if (!restoreRes.ok) {
            toastError("Couldn't restore — retry from the transactions list");
          } else {
            load();
            window.dispatchEvent(new CustomEvent("fin:data-change"));
          }
        },
      },
    });
    window.dispatchEvent(new CustomEvent("fin:data-change"));
  };

  const handleSaved = () => {
    setEditing(null);
    setAdding(false);
    load();
    window.dispatchEvent(new CustomEvent("fin:data-change"));
  };

  const changeMonth = (delta: number) => {
    setPage(1);
    setPeriod(p =>
      p.month + delta > 12 ? { month: 1, year: p.year + 1 }
        : p.month + delta < 1 ? { month: 12, year: p.year - 1 }
        : { month: p.month + delta, year: p.year }
    );
  };

  // Category options respect the selected type filter
  const categoryOptions: string[] =
    filter.type === "INCOME" ? incomeCategories
      : filter.type === "EXPENSE" ? expenseCategories
      : [...incomeCategories, ...expenseCategories];

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
          <p className="text-sm text-[var(--text-secondary)] mt-1">{total} record{total === 1 ? "" : "s"} in {MONTHS[period.month - 1]} {period.year}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setAdding(true)}
          className="btn-primary text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </motion.button>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="btn-ghost p-2 rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {MONTHS[period.month - 1]} {period.year}
          </span>
          <button
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="btn-ghost p-2 rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-[var(--text-tertiary)]" />
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)] pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
              placeholder="Search by description..."
              className="input pl-9"
              aria-label="Search transactions"
            />
          </div>
          <select
            value={filter.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilter(f => ({ ...f, type: e.target.value, category: "" }))}
            className="select text-xs py-1.5 w-auto"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <select
            value={filter.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter(f => ({ ...f, category: e.target.value }));
              setPage(1);
            }}
            className="select text-xs py-1.5 w-auto"
          >
            <option value="">All Categories</option>
            {categoryOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {(filter.type || filter.category || searchInput) && (
            <button
              onClick={() => { setFilter({ type: "", category: "" }); setSearchInput(""); setPage(1); }}
              className="text-xs text-[var(--text-tertiary)] hover:text-coral-500 transition-colors"
            >
              Clear
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
            <p className="text-sm text-[var(--text-tertiary)] mt-1">
              {filter.type || filter.category || search
                ? "Try adjusting your filters"
                : `Add your first transaction for ${MONTHS[period.month - 1]}`}
            </p>
          </div>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate">
            {transactions.map(txn => (
              <motion.div
                key={txn.id}
                variants={fadeSlide}
                className="flex items-center gap-3 sm:gap-4 p-4 hover:bg-[var(--bg-hover)] transition-colors duration-150"
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
                  {txn.type === "INCOME" ? "+" : "-"}{fmt(txn.amount)}
                </span>
                <button
                  onClick={() => setEditing(txn)}
                  aria-label={`Edit ${txn.description}`}
                  title="Edit"
                  className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-indigo-500 hover:bg-indigo-500/10 transition-all duration-150"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => del(txn.id)}
                  aria-label={`Delete ${txn.description}`}
                  title="Delete"
                  className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-coral-500 hover:bg-coral-500/10 transition-all duration-150"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn-ghost text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-xs text-[var(--text-secondary)]">Page {page} of {pages}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, pages))}
            disabled={page === pages}
            className="btn-ghost text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {(adding || editing) && (
        <AddTransactionModal
          onClose={() => { setAdding(false); setEditing(null); }}
          onSuccess={handleSaved}
          transaction={editing || undefined}
        />
      )}
    </motion.div>
  );
}
