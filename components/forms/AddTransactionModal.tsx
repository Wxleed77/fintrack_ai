"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, Loader2, Plus } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/utils";
import { useCurrency } from "@/components/layout/CurrencyProvider";
import { useCategories } from "@/components/layout/CategoriesProvider";
import { handleResponse, toast } from "@/lib/toast";
import { Transaction } from "@/types";

const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.string(),
  paymentMethod: z.string(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction;
}

function toInputDate(date: string | Date): string {
  return new Date(date).toISOString().split("T")[0];
}

export function AddTransactionModal({ onClose, onSuccess, transaction }: Props) {
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();
  const { expenseCategories, incomeCategories, addCategory } = useCategories();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          description: transaction.description,
          date: toInputDate(transaction.date),
          paymentMethod: transaction.paymentMethod,
          notes: transaction.notes || undefined,
        }
      : { type: "EXPENSE", date: new Date().toISOString().split("T")[0], paymentMethod: "cash" },
  });

  const isEdit = Boolean(transaction);

  // Inline custom-category creation
  const [showCatInput, setShowCatInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setShowCatInput(false);
      return;
    }
    setAddingCategory(true);
    const created = await addCategory(newCategory, type);
    setAddingCategory(false);
    if (created) {
      setValue("category", created, { shouldValidate: true });
      setNewCategory("");
      setShowCatInput(false);
    }
  };

  // Close on Escape, trap background interaction politely
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const type = watch("type");
  const categories = type === "INCOME" ? incomeCategories : expenseCategories;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/transactions/${transaction!.id}` : "/api/transactions",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      await handleResponse(res, isEdit ? "Failed to update transaction" : "Failed to add transaction");
      toast(isEdit ? "Transaction updated" : "Transaction added", { type: "success" });
      onSuccess();
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit transaction" : "Add transaction"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-display font-semibold text-[var(--text-primary)]">
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="btn-ghost p-1.5 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type toggle */}
          <div className="flex bg-[var(--bg-hover)] rounded-md p-1">
            {(["EXPENSE", "INCOME"] as const).map(t => (
              <label key={t} className="flex-1 relative">
                <input type="radio" value={t} {...register("type")} className="sr-only" />
                <span
                  className={`block text-center text-sm py-2 rounded-md cursor-pointer transition-all duration-150 font-medium ${
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
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Amount ({currency})</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("amount", { valueAsNumber: true })}
              placeholder="0"
              className="input text-lg font-semibold num"
            />
            {errors.amount && <p className="text-xs text-coral-500 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Description</label>
            <input
              {...register("description")}
              placeholder="e.g. Grocery shopping"
              className="input"
            />
            {errors.description && <p className="text-xs text-coral-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">Category</label>
                <button
                  type="button"
                  onClick={() => setShowCatInput(v => !v)}
                  className="flex items-center gap-0.5 text-2xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                  aria-label="Add custom category"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              </div>
              <select {...register("category")} className="select">
                <option value="">Select...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-coral-500 mt-1">{errors.category.message}</p>}
              {showCatInput && (
                <div className="flex gap-1.5">
                  <input
                    autoFocus
                    type="text"
                    value={newCategory}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter") { e.preventDefault(); handleAddCategory(); }
                      if (e.key === "Escape") setShowCatInput(false);
                    }}
                    placeholder="New category name"
                    className="input text-xs py-1.5"
                    maxLength={30}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={addingCategory}
                    className="btn-primary px-2 py-1"
                    aria-label="Save category"
                  >
                    {addingCategory ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
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

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              isEdit ? "Save Changes" : "Add Transaction"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
