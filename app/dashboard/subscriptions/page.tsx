"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCurrency } from "@/components/layout/CurrencyProvider";
import { toast, toastError } from "@/lib/toast";
import { Subscription } from "@/types";
import { SubscriptionModal } from "@/components/forms/SubscriptionModal";
import { RefreshCw, CreditCard, Plus, Pencil, Trash2, Power } from "lucide-react";

/** Normalize any billing cycle into a monthly amount */
function monthlyEquivalent(sub: Subscription): number {
  if (sub.frequency === "WEEKLY") return (sub.cost * 52) / 12;
  if (sub.frequency === "YEARLY") return sub.cost / 12;
  return sub.cost;
}

export default function SubscriptionsPage() {
  const { fmt } = useCurrency();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions");
      if (!res.ok) {
        toastError("Couldn't load your subscriptions. Try refreshing.");
        return;
      }
      setSubs(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    const sub = subs.find(s => s.id === id);
    if (!sub) return;
    setSubs(list => list.filter(s => s.id !== id));
    const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toastError("Failed to delete subscription");
      load();
      return;
    }
    toast("Subscription deleted", {
      type: "info",
      duration: 7000,
      action: {
        label: "Undo",
        onClick: async () => {
          const restoreRes = await fetch("/api/subscriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serviceName: sub.serviceName,
              cost: sub.cost,
              billingDate: sub.billingDate,
              frequency: sub.frequency,
              category: sub.category,
              icon: sub.icon || undefined,
            }),
          });
          if (!restoreRes.ok) toastError("Couldn't restore — recreate it manually");
          else load();
        },
      },
    });
  };

  const toggleActive = async (id: string) => {
    const sub = subs.find(s => s.id === id);
    if (!sub) return;
    const next = !sub.isActive;
    // Optimistic
    setSubs(list => list.map(s => (s.id === id ? { ...s, isActive: next } : s)));
    const res = await fetch(`/api/subscriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: next }),
    });
    if (!res.ok) {
      toastError("Failed to update subscription");
      load();
      return;
    }
    toast(next ? "Subscription activated" : "Subscription marked inactive", { type: "success" });
  };

  const handleSaved = () => {
    setCreating(false);
    setEditing(null);
    load();
    window.dispatchEvent(new CustomEvent("fin:data-change"));
  };

  const monthlyTotal = subs
    .filter(s => s.isActive)
    .reduce((sum, s) => sum + monthlyEquivalent(s), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Subscriptions</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your recurring payments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card px-4 py-3">
            <p className="text-2xs text-coral-500 font-medium">Monthly burn</p>
            <p className="text-xl font-bold num text-coral-500">{fmt(monthlyTotal)}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCreating(true)}
            className="btn-primary text-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add
          </motion.button>
        </div>
      </div>

      {/* Subscription Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className="skeleton h-11 w-11 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-24" />
              </div>
              <div className="skeleton h-4 w-14" />
            </div>
          ))
        ) : (
          subs.map(sub => (
            <div key={sub.id} className={`card-hover p-5 ${!sub.isActive ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-[var(--text-primary)] truncate">
                    {sub.serviceName}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {sub.frequency.toLowerCase()} · Bills on day {sub.billingDate}
                    {!sub.isActive && <span className="ml-2 text-rose-500">(Inactive)</span>}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold num text-[var(--text-primary)]">
                    {fmt(sub.cost)}
                  </p>
                  <p className="text-2xs text-[var(--text-tertiary)]">
                    {sub.frequency.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 justify-end mt-3 -mb-1">
                <button
                  onClick={() => toggleActive(sub.id)}
                  aria-label={sub.isActive ? `Deactivate ${sub.serviceName}` : `Activate ${sub.serviceName}`}
                  title={sub.isActive ? "Mark inactive" : "Mark active"}
                  className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-indigo-500 hover:bg-indigo-500/10 transition-all duration-150"
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditing(sub)}
                  aria-label={`Edit ${sub.serviceName}`}
                  title="Edit"
                  className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-indigo-500 hover:bg-indigo-500/10 transition-all duration-150"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => del(sub.id)}
                  aria-label={`Delete ${sub.serviceName}`}
                  title="Delete"
                  className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-coral-500 hover:bg-coral-500/10 transition-all duration-150"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          ))
        )}

        {!loading && subs.length === 0 && (
          <div className="md:col-span-2 card p-10 text-center">
            <CreditCard className="h-12 w-12 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-medium">No subscriptions yet</p>
            <button onClick={() => setCreating(true)} className="btn-primary mx-auto mt-4">
              <Plus className="h-4 w-4" />
              Add your first subscription
            </button>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <SubscriptionModal
          onClose={() => { setCreating(false); setEditing(null); }}
          onSuccess={handleSaved}
          subscription={editing || undefined}
        />
      )}
    </div>
  );
}
