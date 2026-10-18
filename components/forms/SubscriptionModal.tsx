"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { EXPENSE_CATEGORIES } from "@/lib/utils";
import { useCurrency } from "@/components/layout/CurrencyProvider";
import { handleResponse, toast } from "@/lib/toast";
import { Subscription } from "@/types";

const schema = z.object({
  serviceName: z.string().min(1, "Name is required"),
  cost: z.number().min(0.01, "Cost must be greater than 0"),
  billingDate: z.number().min(1, "Day 1-31").max(31, "Day 1-31"),
  frequency: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]),
  category: z.string().min(1),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  subscription?: Subscription;
}

export function SubscriptionModal({ onClose, onSuccess, subscription }: Props) {
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();
  const isEdit = Boolean(subscription);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceName: subscription?.serviceName || "",
      cost: subscription?.cost,
      billingDate: subscription?.billingDate ?? 1,
      frequency: subscription?.frequency || "MONTHLY",
      category: subscription?.category || "Entertainment",
      isActive: subscription?.isActive ?? true,
    },
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isActive = watch("isActive");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/subscriptions/${subscription!.id}` : "/api/subscriptions",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      await handleResponse(res, isEdit ? "Failed to update subscription" : "Failed to create subscription");
      toast(isEdit ? "Subscription updated" : "Subscription added", { type: "success" });
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
      aria-label={isEdit ? "Edit subscription" : "Add subscription"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-display font-semibold text-[var(--text-primary)]">
            {isEdit ? "Edit Subscription" : "New Subscription"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="btn-ghost p-1.5 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Service name</label>
            <input
              {...register("serviceName")}
              placeholder="e.g. Netflix"
              className="input"
            />
            {errors.serviceName && <p className="text-xs text-coral-500 mt-1">{errors.serviceName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Cost ({currency})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("cost", { valueAsNumber: true })}
                placeholder="0"
                className="input num"
              />
              {errors.cost && <p className="text-xs text-coral-500 mt-1">{errors.cost.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Bills on day of month</label>
              <input
                type="number"
                min="1"
                max="31"
                {...register("billingDate", { valueAsNumber: true })}
                placeholder="1"
                className="input num"
              />
              {errors.billingDate && <p className="text-xs text-coral-500 mt-1">{errors.billingDate.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Billing cycle</label>
            <select {...register("frequency")} className="select">
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Category</label>
            <select {...register("category")} className="select">
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 rounded-md bg-[var(--bg-hover)]">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Active</p>
              <p className="text-xs text-[var(--text-tertiary)]">Inactive subscriptions are excluded from monthly burn</p>
            </div>
            <label className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
              <input type="checkbox" {...register("isActive")} className="sr-only" />
              <span
                className={`inline-block h-full w-full rounded-full transition-colors duration-150 ${
                  isActive ? "bg-indigo-500" : "bg-[var(--bg-hover)] border border-[var(--border-card)]"
                }`}
              />
              <span
                className={`absolute h-4 w-4 transform rounded-full bg-white transition-transform duration-150 ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </label>
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
              isEdit ? "Save Changes" : "Add Subscription"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
