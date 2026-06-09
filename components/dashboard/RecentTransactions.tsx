"use client";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function RecentTransactions({ transactions, isLoading }: { transactions: Transaction[]; isLoading?: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        <Link href="/dashboard/transactions" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">View all</Link>
      </div>
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          transactions.map((txn) => (
            <div key={txn.id} className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${txn.type === "INCOME" ? "bg-emerald-50 dark:bg-emerald-950" : "bg-red-50 dark:bg-red-950"}`}>
                {txn.type === "INCOME"
                  ? <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  : <ArrowDownRight className="h-4 w-4 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{txn.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{txn.category} · {formatDate(txn.date)}</p>
              </div>
              <span className={`text-sm font-semibold ${txn.type === "INCOME" ? "text-emerald-600" : "text-red-500"}`}>
                {txn.type === "INCOME" ? "+" : "-"}{formatCurrency(txn.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
