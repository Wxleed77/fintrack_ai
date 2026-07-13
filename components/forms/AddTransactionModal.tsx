"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from "@/lib/utils";

const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  date: z.string(),
  paymentMethod: z.string(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props { onClose: () => void; onSuccess: () => void }

export function AddTransactionModal({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "EXPENSE", date: new Date().toISOString().split("T")[0], paymentMethod: "cash" },
  });

  const type = watch("type");
  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      onSuccess();
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in" onClick={onClose}>
      <div
        className="card w-full max-w-md p-6 animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-display font-semibold text-[var(--text-primary)]">Add Transaction</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-1.5 rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type toggle */}
          <div className="flex bg-[var(--bg-hover)] rounded-xl p-1">
            {(["EXPENSE", "INCOME"] as const).map(t => (
              <label key={t} className="flex-1 relative">
                <input type="radio" value={t} {...register("type")} className="sr-only" />
                <span
                  className={`block text-center text-sm py-2 rounded-lg cursor-pointer transition-all duration-150 font-medium ${
                    type === t
                      ? "bg-[var(--bg-card)] text-[var(--text-primary)]"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {t === "INCOME" ? "Income" : "Expense"}
                </span>
              </label>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Amount (PKR)</label>
            <input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              placeholder="0"
              className="input text-lg font-semibold num"
            />
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Description</label>
            <input
              {...register("description")}
              placeholder="e.g. Grocery shopping"
              className="input"
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Category</label>
              <select {...register("category")} className="select">
                <option value="">Select...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Date</label>
              <input type="date" {...register("date")} className="input" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Payment Method</label>
            <select {...register("paymentMethod")} className="select">
              {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Notes (optional)</label>
            <textarea
              {...register("notes")}
              rows={2}
              className="input resize-none"
              placeholder="Any additional notes..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Add Transaction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}