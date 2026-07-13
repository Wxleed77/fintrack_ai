"use client";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";

export function RecentTransactions({ transactions, isLoading }: { transactions: Transaction[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="card p-5 space-y-3">
        <div className="skeleton h-5 w-40 mb-4" />
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-3.5 w-32" />
              <div className="skeleton h-3 w-24" />
            </div>
            <div className="skeleton h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-[var(--text-primary)]">Recent Transactions</h3>
        <Link
          href="/dashboard/transactions"
          className="text-xs font-medium text-emerald-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
        >
          View all
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-1">
        {transactions.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)] text-center py-6">No transactions yet</p>
        ) : (
          transactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors duration-150"
            >
              <div className={`p-2 rounded-xl ${
                txn.type === "INCOME"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}>
                {txn.type === "INCOME"
                  ? <ArrowUpRight className="h-4 w-4" />
                  : <ArrowDownRight className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{txn.description}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {txn.category} · {formatDate(txn.date)}
                </p>
              </div>
              <span className={`text-sm font-semibold num ${
                txn.type === "INCOME" ? "text-emerald-500" : "text-rose-500"
              }`}>
                {txn.type === "INCOME" ? "+" : "-"}{formatCurrency(txn.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}