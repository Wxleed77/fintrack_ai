"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useCurrency } from "@/components/layout/CurrencyProvider";
import { handleResponse, toast } from "@/lib/toast";
import { SavingsGoal } from "@/types";

const GOAL_COLORS = ["#1D9E75", "#4F6EF7", "#8B5CF6", "#EF9F27", "#D4537E", "#378ADD"];

const schema = z.object({
  goalName: z.string().min(1, "Name is required"),
  targetAmount: z.number().min(0.01, "Target must be greater than 0"),
  currentAmount: z.number().min(0, "Saved amount can't be negative"),
  deadline: z.string().optional(),
  color: z.string(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  goal?: SavingsGoal;
}

export function GoalModal({ onClose, onSuccess, goal }: Props) {
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();
  const isEdit = Boolean(goal);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      goalName: goal?.goalName || "",
      targetAmount: goal?.targetAmount,
      currentAmount: goal?.currentAmount ?? 0,
      deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "",
      color: goal?.color || GOAL_COLORS[0],
    },
  });

  const color = watch("color");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        goalName: data.goalName,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
        deadline: data.deadline || null,
        color: data.color,
      };
      const res = await fetch(isEdit ? `/api/goals/${goal!.id}` : "/api/goals", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await handleResponse(res, isEdit ? "Failed to update goal" : "Failed to create goal");
      toast(isEdit ? "Goal updated" : "Goal created", { type: "success" });
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
      aria-label={isEdit ? "Edit goal" : "Create goal"}
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
            {isEdit ? "Edit Goal" : "New Savings Goal"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="btn-ghost p-1.5 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Goal name</label>
            <input
              {...register("goalName")}
              placeholder="e.g. Emergency fund"
              className="input"
            />
            {errors.goalName && <p className="text-xs text-coral-500 mt-1">{errors.goalName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Target ({currency})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("targetAmount", { valueAsNumber: true })}
                placeholder="0"
                className="input num"
              />
              {errors.targetAmount && <p className="text-xs text-coral-500 mt-1">{errors.targetAmount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Saved so far</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("currentAmount", { valueAsNumber: true })}
                placeholder="0"
                className="input num"
              />
              {errors.currentAmount && <p className="text-xs text-coral-500 mt-1">{errors.currentAmount.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Target date (optional)</label>
            <input type="date" {...register("deadline")} className="input" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Color</label>
            <div className="flex gap-2">
              {GOAL_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Use color ${c}`}
                  onClick={() => setValue("color", c)}
                  className={`h-7 w-7 rounded-full transition-transform duration-150 ${
                    color === c ? "ring-2 ring-offset-2 ring-[var(--border-focus)] ring-offset-[var(--bg-card)] scale-110" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
              isEdit ? "Save Changes" : "Create Goal"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
