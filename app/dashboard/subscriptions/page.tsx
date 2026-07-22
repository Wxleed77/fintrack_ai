"use client";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Subscription } from "@/types";
import { RefreshCw, CreditCard } from "lucide-react";

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);

  useEffect(() => {
    fetch("/api/subscriptions").then(r => r.json()).then(setSubs);
  }, []);

  const monthlyTotal = subs
    .filter(s => s.isActive && s.frequency === "MONTHLY")
    .reduce((sum, s) => sum + s.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Subscriptions</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your recurring payments</p>
        </div>
        <div className="card px-4 py-3">
          <p className="text-2xs text-coral-500 font-medium">Monthly burn</p>
          <p className="text-xl font-bold num text-coral-500">{formatCurrency(monthlyTotal)}</p>
        </div>
      </div>

      {/* Subscription Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subs.map(sub => (
          <div key={sub.id} className="card-hover p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-[var(--text-primary)] truncate">
                  {sub.serviceName}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {sub.frequency} · Bills on day {sub.billingDate}
                  {!sub.isActive && (
                    <span className="ml-2 text-rose-500">(Inactive)</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold num text-[var(--text-primary)]">
                  {formatCurrency(sub.cost)}
                </p>
                <p className="text-2xs text-[var(--text-tertiary)]">
                  {sub.frequency.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {subs.length === 0 && (
          <div className="md:col-span-2 card p-10 text-center">
            <CreditCard className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-medium">No subscriptions found</p>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Your recurring payments will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}